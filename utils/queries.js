export default {
  getYears: () => `
    SELECT 
      DATEPART(YEAR, date) as year 
      ,SUM(production) as production
      ,SUM(total_consumed) as total_consumed
      ,SUM(ZBC_consumed) as ZBC_consumed
      ,SUM(generation) as generation
      ,SUM(procentage) as procentage
      ,SUM(sold) as sold
      ,SUM(RUP_consumed) as RUP_consumed
      ,SUM(gkal) as gkal 
    FROM (SELECT  *
        FROM    (
            SELECT 
            ROW_NUMBER() OVER (PARTITION BY CONCAT(DATEPART(YEAR, date), '_', DATEPART(MONTH, date)) ORDER BY date DESC) AS RowNumber
            ,[date]
            ,[production]
            ,[total_consumed]
            ,[ZBC_consumed]
            ,[generation]
            ,[procentage]
            ,[sold]
            ,[RUP_consumed]
            ,[power]
            ,[plus]
            ,[gkal]
            FROM [Apps].[dbo].[gen_electricity]) as a
        WHERE   a.RowNumber = 1) as b
    GROUP BY DATEPART(YEAR, date) 
    ORDER BY DATEPART(YEAR, date);
    `,
  getMonths: (year) => `
  SELECT  DATEPART(MONTH, date) as month_id , *
  FROM (SELECT  *
      FROM    (
          SELECT 
          ROW_NUMBER() OVER (PARTITION BY CONCAT(DATEPART(YEAR, date), '_', DATEPART(MONTH, date)) ORDER BY date DESC) AS RowNumber
          ,[date]
          ,[production]
          ,[total_consumed]
          ,[ZBC_consumed]
          ,[generation]
          ,[procentage]
          ,[sold]
          ,[RUP_consumed]
          ,[power]
          ,[plus]
          ,[gkal]
          FROM [Apps].[dbo].[gen_electricity]) as a
      WHERE   a.RowNumber = 1) as b
  WHERE DATEPART(YEAR, date) = ${year}
  ORDER BY DATEPART(MONTH, date);
    `,
  getDaysByMonthOffset: (offsetMonth) => `
      SELECT  *
            FROM    (
                SELECT 
          DENSE_RANK() OVER (ORDER BY DATEPART(YEAR, date) DESC, DATEPART(MONTH, date) DESC) as month_group
          ,DATEPART(MONTH, date) as month_id 
                ,[date]
                ,[production]
                ,[total_consumed]
                ,[ZBC_consumed]
                ,[generation]
                ,[procentage]
                ,[sold]
                ,[RUP_consumed]
                ,[power]
                ,[plus]
                ,[gkal]
                FROM [Apps].[dbo].[gen_electricity]) as a
    WHERE month_group = ${offsetMonth + 1}
    ORDER BY date
  `,
  getPlusesByYear: (year) => `
  SELECT 
  DATEPART(MONTH, date) as month_id 
  ,[date]
  ,[plus]
      FROM [Apps].[dbo].[gen_electricity] 
      where DATEPART(YEAR, date) = ${year}
      ORDER BY DATEPART(MONTH, date);
    `,
  getDays: (year) => `
    SELECT 
        [date]
        ,[production]
        ,[total_consumed]
        ,[ZBC_consumed]
        ,[generation]
        ,[procentage]
        ,[sold]
        ,[RUP_consumed]
        ,[power]
        ,[plus]
        ,[gkal]
    FROM [Apps].[dbo].[gen_electricity] 
        where DATEPART(YEAR, date) = ${
          year ||
          "(SELECT TOP 1 DATEPART(YEAR, date) FROM [Apps].[dbo].[gen_electricity] ORDER BY date DESC)"
        }
    ORDER BY date;
    `,
  updateDay: (day) => `
    UPDATE [Apps].[dbo].[gen_electricity]
    SET
       [production] = ${day.production}
      ,[total_consumed] = ${day.total_consumed}
      ,[ZBC_consumed] = ${day.ZBC_consumed}
      ,[generation] = ${day.generation}
      ,[procentage] = ${day.procentage}
      ,[sold] = ${day.sold}
      ,[RUP_consumed] = ${day.RUP_consumed}
      ,[power] = ${day.power}
      ,[plus] = ${+day.plus}
      ,[gkal] = ${day.gkal}
    WHERE date = '${new Date(day.date).getFullYear()}-${
    new Date(day.date).getMonth() + 1
  }-${new Date(day.date).getDate()}'
    
    `,
  insertDay: (day) => `
    INSERT INTO [Apps].[dbo].[gen_electricity] (date, production, total_consumed, ZBC_consumed, generation, procentage, sold, RUP_consumed, power, plus, gkal)
    VALUES (
      '${new Date(day.date).getFullYear()}-${
    new Date(day.date).getMonth() + 1
  }-${new Date(day.date).getDate()}', 
      ${day.production}, 
      ${day.total_consumed}, 
      ${day.ZBC_consumed}, 
      ${day.generation}, 
      ${day.procentage}, 
      ${day.sold}, 
      ${day.RUP_consumed}, 
      ${day.power}, 
      ${+day.plus}, 
      ${day.gkal});
  `,
  deleteDay: (date) => `
    DELETE FROM [Apps].[dbo].[gen_electricity] WHERE date = '${new Date(
      date
    ).getFullYear()}-${new Date(date).getMonth() + 1}-${new Date(
    date
  ).getDate()}';
  `,
  getAllDays: () => `
  SELECT  
        [date]
        ,[production]
        ,[total_consumed]
        ,[ZBC_consumed]
        ,[generation]
        ,[procentage]
        ,[sold]
        ,[RUP_consumed]
        ,[power]
        ,[plus]
        ,[gkal]
    FROM [Apps].[dbo].[gen_electricity] 
    ORDER BY date;
  `,
  checkDayByDate: (date) => `
    SELECT *
    FROM [Apps].[dbo].[gen_electricity] 
    WHERE [date] = '${new Date(date).getFullYear()}-${
    new Date(date).getMonth() + 1
  }-${new Date(date).getDate()}'
  `,
  getUser: (login, password) => `
    SELECT id, first_name as firstname, last_name as lastname, last_name_2 as secondname, login 
    FROM [Apps].[dbo].[users]
    WHERE 
      login = '${login}' AND
      password = '${password}'
  `,
  getUserByID: (id) => `
    SELECT id, first_name as firstname, last_name as lastname, last_name_2 as secondname, login 
    FROM [Apps].[dbo].[users]
    WHERE 
      id = '${id}'
  `,
};
