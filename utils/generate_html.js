import { parse } from "node-html-parser";
import fs from "fs";
import mysql from "mysql2";
import sql from "mssql";

const strConnectionToSQL =
  "Server=10.1.15.241,1433;Database=ElectricitySCKK;User Id=bot_telegram;Password=bp#1m8dm;Encrypt=false";

const monthNames = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

export const generateYearHTML = async () => {
  let contentHtml = fs.readFileSync(
    new URL("../html/template_year.html", import.meta.url),
    "utf8"
  );

  const root = parse(contentHtml);

  let lines = [];

  try {
    await sql.connect(strConnectionToSQL);
    const resultYear =
      await sql.query`select * from ProductionConsumptionsYears`;
    const lastYear = resultYear.recordset[resultYear.recordset.length - 1];
    lines.push(`
        <tr class="table-primary">
          <td>${lastYear.Year}</td>
          <td>${
            lastYear.ProductionPulp.toFixed(2).replace(".00", "") || ""
          }</td>
          <td>${
            lastYear.TotalConsumption.toFixed(2).replace(".00", "") || ""
          }</td>
          <td>${
            lastYear.BPPConsumption.toFixed(2).replace(".00", "") || ""
          }</td>
          <td>${
            lastYear.ProductionElectricity.toFixed(2).replace(".00", "") || ""
          }</td>
          <td>${lastYear.Procentage.toFixed(2).replace(".00", "") || ""}</td>
          <td>${lastYear.Sales.toFixed(2).replace(".00", "") || ""}</td>
          <td>${
            lastYear.GomelConsumptionkWh.toFixed(2).replace(".00", "") || ""
          }</td>
          <td></td>
          <td></td>
          <td>${
            lastYear.GomelConsumptionGkal.toFixed(2).replace(".00", "") || ""
          }</td>
        </tr>`);

    const resultMonths =
      await sql.query`select * from ProductionConsumptionsMonths where Year=${lastYear.Year}`;

    let kvartal1 = {
      name: "1 квартал",
      ProductionPulp: 0,
      TotalConsumption: 0,
      BPPConsumption: 0,
      ProductionElectricity: 0,
      Procentage: 0,
      Sales: 0,
      GomelConsumptionkWh: 0,
      GomelConsumptionGkal: 0,
    };

    let kvartal2 = {
      name: "2 квартал",
      ProductionPulp: 0,
      TotalConsumption: 0,
      BPPConsumption: 0,
      ProductionElectricity: 0,
      Procentage: 0,
      Sales: 0,
      GomelConsumptionkWh: 0,
      GomelConsumptionGkal: 0,
    };

    let kvartal3 = {
      name: "3 квартал",
      ProductionPulp: 0,
      TotalConsumption: 0,
      BPPConsumption: 0,
      ProductionElectricity: 0,
      Procentage: 0,
      Sales: 0,
      GomelConsumptionkWh: 0,
      GomelConsumptionGkal: 0,
    };

    let kvartal4 = {
      name: "4 квартал",
      ProductionPulp: 0,
      TotalConsumption: 0,
      BPPConsumption: 0,
      ProductionElectricity: 0,
      Procentage: 0,
      Sales: 0,
      GomelConsumptionkWh: 0,
      GomelConsumptionGkal: 0,
    };

    resultMonths.recordset.map((month) => {
      lines.push(`
        <tr class="table-secondary">
            <td>${monthNames[month.MonthId - 1]}</td>
            <td>${month.ProductionPulp.toFixed(2).replace(".00", "") || ""}</td>
            <td>${
              month.TotalConsumption.toFixed(2).replace(".00", "") || ""
            }</td>
            <td>${month.BPPConsumption.toFixed(2).replace(".00", "") || ""}</td>
            <td>${
              month.ProductionElectricity.toFixed(2).replace(".00", "") || ""
            }</td>
            <td>${month.Procentage.toFixed(2).replace(".00", "") || ""}</td>
            <td>${month.Sales.toFixed(2).replace(".00", "") || ""}</td>
            <td>${
              month.GomelConsumptionkWh.toFixed(2).replace(".00", "") || ""
            }</td>
            <td>${
              month.GomelConsumptionMW.toFixed(2).replace(".00", "") || ""
            }</td>
            <td>${month.MWstatus || ""}</td>
            <td>${
              month.GomelConsumptionGkal.toFixed(2).replace(".00", "") || ""
            }</td>
        </tr>`);

      if (month.MonthId >= 1 && month.MonthId <= 3) {
        kvartal1 = {
          ...kvartal1,
          ProductionPulp: kvartal1.ProductionPulp + month.ProductionPulp,
          TotalConsumption: kvartal1.TotalConsumption + month.TotalConsumption,
          BPPConsumption: kvartal1.BPPConsumption + month.BPPConsumption,
          ProductionElectricity:
            kvartal1.ProductionElectricity + month.ProductionElectricity,
          Procentage:
            ((kvartal1.ProductionElectricity + month.ProductionElectricity) *
              100) /
            (kvartal1.TotalConsumption + month.TotalConsumption),
          Sales: kvartal1.Sales + month.Sales,
          GomelConsumptionkWh:
            kvartal1.GomelConsumptionkWh + month.GomelConsumptionkWh,
          GomelConsumptionGkal:
            kvartal1.GomelConsumptionGkal + month.GomelConsumptionGkal,
        };

        if (month.MonthId == 3) {
          lines.push(`
                    <tr class="table-info">
                    <td>${kvartal1.name}</td>
                    <td>${
                      kvartal1.ProductionPulp.toFixed(2).replace(".00", "") ||
                      ""
                    }</td>
                    <td>${
                      kvartal1.TotalConsumption.toFixed(2).replace(".00", "") ||
                      ""
                    }</td>
                    <td>${
                      kvartal1.BPPConsumption.toFixed(2).replace(".00", "") ||
                      ""
                    }</td>
                    <td>${
                      kvartal1.ProductionElectricity.toFixed(2).replace(
                        ".00",
                        ""
                      ) || ""
                    }</td>
                    <td>${
                      kvartal1.Procentage.toFixed(2).replace(".00", "") || ""
                    }</td>
                    <td>${
                      kvartal1.Sales.toFixed(2).replace(".00", "") || ""
                    }</td>
                    <td>${
                      kvartal1.GomelConsumptionkWh.toFixed(2).replace(
                        ".00",
                        ""
                      ) || ""
                    }</td>
                    <td></td>
                    <td></td>
                    <td>${
                      kvartal1.GomelConsumptionGkal.toFixed(2).replace(
                        ".00",
                        ""
                      ) || ""
                    }</td>
                    </tr>`);
        }
      }

      if (month.MonthId >= 4 && month.MonthId <= 6) {
        kvartal2 = {
          ...kvartal2,
          ProductionPulp: kvartal2.ProductionPulp + month.ProductionPulp,
          TotalConsumption: kvartal2.TotalConsumption + month.TotalConsumption,
          BPPConsumption: kvartal2.BPPConsumption + month.BPPConsumption,
          ProductionElectricity:
            kvartal2.ProductionElectricity + month.ProductionElectricity,
          Procentage:
            ((kvartal2.ProductionElectricity + month.ProductionElectricity) *
              100) /
            (kvartal2.TotalConsumption + month.TotalConsumption),
          Sales: kvartal2.Sales + month.Sales,
          GomelConsumptionkWh:
            kvartal2.GomelConsumptionkWh + month.GomelConsumptionkWh,
          GomelConsumptionGkal:
            kvartal2.GomelConsumptionGkal + month.GomelConsumptionGkal,
        };

        if (month.MonthId == 6) {
          lines.push(`
                            <tr class="table-info">
                            <td>${kvartal2.name}</td>
                            <td>${
                              kvartal2.ProductionPulp.toFixed(2).replace(
                                ".00",
                                ""
                              ) || ""
                            }</td>
                            <td>${
                              kvartal2.TotalConsumption.toFixed(2).replace(
                                ".00",
                                ""
                              ) || ""
                            }</td>
                            <td>${
                              kvartal2.BPPConsumption.toFixed(2).replace(
                                ".00",
                                ""
                              ) || ""
                            }</td>
                            <td>${
                              kvartal2.ProductionElectricity.toFixed(2).replace(
                                ".00",
                                ""
                              ) || ""
                            }</td>
                            <td>${
                              kvartal2.Procentage.toFixed(2).replace(
                                ".00",
                                ""
                              ) || ""
                            }</td>
                            <td>${
                              kvartal2.Sales.toFixed(2).replace(".00", "") || ""
                            }</td>
                            <td>${
                              kvartal2.GomelConsumptionkWh.toFixed(2).replace(
                                ".00",
                                ""
                              ) || ""
                            }</td>
                            <td></td>
                            <td></td>
                            <td>${
                              kvartal2.GomelConsumptionGkal.toFixed(2).replace(
                                ".00",
                                ""
                              ) || ""
                            }</td>
                            </tr>`);
        }
      }

      if (month.MonthId >= 7 && month.MonthId <= 9) {
        kvartal3 = {
          ...kvartal3,
          ProductionPulp: kvartal3.ProductionPulp + month.ProductionPulp,
          TotalConsumption: kvartal3.TotalConsumption + month.TotalConsumption,
          BPPConsumption: kvartal3.BPPConsumption + month.BPPConsumption,
          ProductionElectricity:
            kvartal3.ProductionElectricity + month.ProductionElectricity,
          Procentage:
            ((kvartal3.ProductionElectricity + month.ProductionElectricity) *
              100) /
            (kvartal3.TotalConsumption + month.TotalConsumption),
          Sales: kvartal3.Sales + month.Sales,
          GomelConsumptionkWh:
            kvartal3.GomelConsumptionkWh + month.GomelConsumptionkWh,
          GomelConsumptionGkal:
            kvartal3.GomelConsumptionGkal + month.GomelConsumptionGkal,
        };

        if (month.MonthId == 9) {
          lines.push(`
                                        <tr class="table-info">
                                        <td>${kvartal3.name}</td>
                                        <td>${
                                          kvartal3.ProductionPulp.toFixed(
                                            2
                                          ).replace(".00", "") || ""
                                        }</td>
                                        <td>${
                                          kvartal3.TotalConsumption.toFixed(
                                            2
                                          ).replace(".00", "") || ""
                                        }</td>
                                        <td>${
                                          kvartal3.BPPConsumption.toFixed(
                                            2
                                          ).replace(".00", "") || ""
                                        }</td>
                                        <td>${
                                          kvartal3.ProductionElectricity.toFixed(
                                            2
                                          ).replace(".00", "") || ""
                                        }</td>
                                        <td>${
                                          kvartal3.Procentage.toFixed(
                                            2
                                          ).replace(".00", "") || ""
                                        }</td>
                                        <td>${
                                          kvartal3.Sales.toFixed(2).replace(
                                            ".00",
                                            ""
                                          ) || ""
                                        }</td>
                                        <td>${
                                          kvartal3.GomelConsumptionkWh.toFixed(
                                            2
                                          ).replace(".00", "") || ""
                                        }</td>
                                        <td></td>
                                        <td></td>
                                        <td>${
                                          kvartal3.GomelConsumptionGkal.toFixed(
                                            2
                                          ).replace(".00", "") || ""
                                        }</td>
                                        </tr>`);
        }
      }

      if (month.MonthId >= 10 && month.MonthId <= 12) {
        kvartal4 = {
          ...kvartal4,
          ProductionPulp: kvartal4.ProductionPulp + month.ProductionPulp,
          TotalConsumption: kvartal4.TotalConsumption + month.TotalConsumption,
          BPPConsumption: kvartal4.BPPConsumption + month.BPPConsumption,
          ProductionElectricity:
            kvartal4.ProductionElectricity + month.ProductionElectricity,
          Procentage:
            ((kvartal4.ProductionElectricity + month.ProductionElectricity) *
              100) /
            (kvartal4.TotalConsumption + month.TotalConsumption),
          Sales: kvartal4.Sales + month.Sales,
          GomelConsumptionkWh:
            kvartal4.GomelConsumptionkWh + month.GomelConsumptionkWh,
          GomelConsumptionGkal:
            kvartal4.GomelConsumptionGkal + month.GomelConsumptionGkal,
        };

        if (month.MonthId == 12) {
          lines.push(`
                                                    <tr class="table-info">
                                                    <td>${kvartal4.name}</td>
                                                    <td>${
                                                      kvartal4.ProductionPulp.toFixed(
                                                        2
                                                      ).replace(".00", "") || ""
                                                    }</td>
                                                    <td>${
                                                      kvartal4.TotalConsumption.toFixed(
                                                        2
                                                      ).replace(".00", "") || ""
                                                    }</td>
                                                    <td>${
                                                      kvartal4.BPPConsumption.toFixed(
                                                        2
                                                      ).replace(".00", "") || ""
                                                    }</td>
                                                    <td>${
                                                      kvartal4.ProductionElectricity.toFixed(
                                                        2
                                                      ).replace(".00", "") || ""
                                                    }</td>
                                                    <td>${
                                                      kvartal4.Procentage.toFixed(
                                                        2
                                                      ).replace(".00", "") || ""
                                                    }</td>
                                                    <td>${
                                                      kvartal4.Sales.toFixed(
                                                        2
                                                      ).replace(".00", "") || ""
                                                    }</td>
                                                    <td>${
                                                      kvartal4.GomelConsumptionkWh.toFixed(
                                                        2
                                                      ).replace(".00", "") || ""
                                                    }</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>${
                                                      kvartal4.GomelConsumptionGkal.toFixed(
                                                        2
                                                      ).replace(".00", "") || ""
                                                    }</td>
                                                    </tr>`);
        }
      }
    });
  } catch (err) {
    console.log(err);
  }

  lines.map((line) => {
    root
      .querySelector("tbody")
      .appendChild(parse(line, { parseNoneClosedTags: true }));
  });

  fs.writeFileSync(
    new URL("../html/index_year.html", import.meta.url),
    root.innerHTML
  );
};

export const generateYearsHTML = async () => {
  let contentHtml = fs.readFileSync(
    new URL("../html/template_years.html", import.meta.url),
    "utf8"
  );

  const root = parse(contentHtml);

  let lines = [];

  try {
    await sql.connect(strConnectionToSQL);
    const resultYear =
      await sql.query`select * from ProductionConsumptionsYears`;

    resultYear.recordset.map((year) => {
      lines.push(`
      <tr class="table-primary">
        <td>${year.Year}</td>
        <td>${year.ProductionPulp.toFixed(2).replace(".00", "") || ""}</td>
        <td>${year.TotalConsumption.toFixed(2).replace(".00", "") || ""}</td>
        <td>${year.BPPConsumption.toFixed(2).replace(".00", "") || ""}</td>
        <td>${
          year.ProductionElectricity.toFixed(2).replace(".00", "") || ""
        }</td>
        <td>${year.Procentage.toFixed(2).replace(".00", "") || ""}</td>
        <td>${year.Sales.toFixed(2).replace(".00", "") || ""}</td>
        <td>${year.GomelConsumptionkWh.toFixed(2).replace(".00", "") || ""}</td>
        <td></td>
        <td></td>
        <td>${
          year.GomelConsumptionGkal.toFixed(2).replace(".00", "") || ""
        }</td>
      </tr>`);
    });
  } catch (err) {
    console.log(err);
  }

  lines.map((line) => {
    root
      .querySelector("tbody")
      .appendChild(parse(line, { parseNoneClosedTags: true }));
  });

  fs.writeFileSync(
    new URL("../html/index_years.html", import.meta.url),
    root.innerHTML
  );
};

export const generateMonthHTML = async (offsetMonth) => {
  let contentHtml = fs.readFileSync(
    new URL("../html/template_month.html", import.meta.url),
    "utf8"
  );

  const root = parse(contentHtml);

  const lines = [];

  try {
    await sql.connect(strConnectionToSQL);

    const monthData =
      await sql.query`select top(3) * from ProductionConsumptionsMonths ORDER BY Year DESC, MonthId DESC`.then(
        (data) => {
          const month = data.recordset[offsetMonth];
          lines.push(`
                <tr class="table-primary">
                    <td>${monthNames[month.MonthId - 1]} ${month.Year}</td>
                    <td>${
                      month.ProductionPulp.toFixed(2).replace(".00", "") || ""
                    }</td>
                    <td>${
                      month.TotalConsumption.toFixed(2).replace(".00", "") || ""
                    }</td>
                    <td>${
                      month.BPPConsumption.toFixed(2).replace(".00", "") || ""
                    }</td>
                    <td>${
                      month.ProductionElectricity.toFixed(2).replace(
                        ".00",
                        ""
                      ) || ""
                    }</td>
                    <td>${
                      month.Procentage.toFixed(2).replace(".00", "") || ""
                    }</td>
                    <td>${month.Sales.toFixed(2).replace(".00", "") || ""}</td>
                    <td>${
                      month.GomelConsumptionkWh.toFixed(2).replace(".00", "") ||
                      ""
                    }</td>
                    <td>${
                      month.GomelConsumptionMW.toFixed(2).replace(".00", "") ||
                      ""
                    }</td>
                    <td>${month.MWstatus || ""}</td>
                    <td>${
                      month.GomelConsumptionGkal.toFixed(2).replace(
                        ".00",
                        ""
                      ) || ""
                    }</td>
                </tr>`);

          return month;
        }
      );

    const resultDays =
      await sql.query`select * from ProductionConsumptions where DATEPART(YEAR, [Date]) = ${monthData.Year} AND DATEPART(MONTH, [Date]) = ${monthData.MonthId}`;

    resultDays.recordset.map((day, index) => {
      lines.push(`
        <tr class="table-secondary">
            <td>с 1 по ${day.Date.getDate()} | ${index + 1}</td>
            <td>${day.ProductionPulp.toFixed(2).replace(".00", "") || ""}</td>
            <td>${day.TotalConsumption.toFixed(2).replace(".00", "") || ""}</td>
            <td>${day.BPPConsumption.toFixed(2).replace(".00", "") || ""}</td>
            <td>${
              day.ProductionElectricity.toFixed(2).replace(".00", "") || ""
            }</td>
            <td>${day.Procentage.toFixed(2).replace(".00", "") || ""}</td>
            <td>${day.Sales.toFixed(2).replace(".00", "") || ""}</td>
            <td>${
              day.GomelConsumptionkWh.toFixed(2).replace(".00", "") || ""
            }</td>
            <td>${
              day.GomelConsumptionMW.toFixed(2).replace(".00", "") || ""
            }</td>
            <td>${day.MWstatus || ""}</td>
            <td>${
              day.GomelConsumptionGkal.toFixed(2).replace(".00", "") || ""
            }</td>
        </tr>`);
    });
  } catch (err) {
    console.log(err);
  }

  lines.map((line) => {
    root
      .querySelector("tbody")
      .appendChild(parse(line, { parseNoneClosedTags: true }));
  });

  fs.writeFileSync(
    new URL("../html/index_month.html", import.meta.url),
    root.innerHTML
  );
};
