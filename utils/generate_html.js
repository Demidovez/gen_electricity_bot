import { parse } from "node-html-parser";
import fs from "fs";
import QUERIES from "./queries.js";
import sql from "mssql";

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
    await sql.connect(process.env.SQL_STRING);

    const result = await sql.query(QUERIES.getYears());

    const lastYear = result.recordset[result.recordset.length - 1];

    lines.push(`
        <tr class="table-primary">
          <td>${lastYear.year}</td>
          <td>${lastYear.production.toFixed(2).replace(".00", "") || ""}</td>
          <td>${
            lastYear.total_consumed.toFixed(2).replace(".00", "") || ""
          }</td>
          <td>${lastYear.ZBC_consumed.toFixed(2).replace(".00", "") || ""}</td>
          <td>${
            ((lastYear.generation / lastYear.total_consumed) * 100)
              .toFixed(2)
              .replace(".00", "") || ""
          }</td>
          <td>${lastYear.procentage.toFixed(2).replace(".00", "") || ""}</td>
          <td>${lastYear.sold.toFixed(2).replace(".00", "") || ""}</td>
          <td>${lastYear.RUP_consumed.toFixed(2).replace(".00", "") || ""}</td>
          <td></td>
          <td></td>
          <td>${lastYear.gkal.toFixed(2).replace(".00", "") || ""}</td>
        </tr>`);

    const resultMonths = await sql.query(QUERIES.getMonths(lastYear.year));

    const resultPluses = await sql.query(
      QUERIES.getPlusesByYear(lastYear.year)
    );

    let kvartal1 = {
      name: "1 квартал",
      production: 0,
      total_consumed: 0,
      ZBC_consumed: 0,
      generation: 0,
      procentage: 0,
      sold: 0,
      RUP_consumed: 0,
      gkal: 0,
    };

    let kvartal2 = {
      name: "2 квартал",
      production: 0,
      total_consumed: 0,
      ZBC_consumed: 0,
      generation: 0,
      procentage: 0,
      sold: 0,
      RUP_consumed: 0,
      gkal: 0,
    };

    let kvartal3 = {
      name: "3 квартал",
      production: 0,
      total_consumed: 0,
      ZBC_consumed: 0,
      generation: 0,
      procentage: 0,
      sold: 0,
      RUP_consumed: 0,
      gkal: 0,
    };

    let kvartal4 = {
      name: "4 квартал",
      production: 0,
      total_consumed: 0,
      ZBC_consumed: 0,
      generation: 0,
      procentage: 0,
      sold: 0,
      RUP_consumed: 0,
      gkal: 0,
    };

    resultMonths.recordset.map((month, index) => {
      const days = resultPluses.recordset.filter(
        (day) => day.month_id === month.month_id
      );

      lines.push(`
        <tr class="table-secondary">
            <td>${monthNames[month.month_id - 1]}</td>
            <td>${month.production.toFixed(2).replace(".00", "") || ""}</td>
            <td>${month.total_consumed.toFixed(2).replace(".00", "") || ""}</td>
            <td>${month.ZBC_consumed.toFixed(2).replace(".00", "") || ""}</td>
            <td>${month.generation.toFixed(2).replace(".00", "") || ""}</td>
            <td>${month.procentage.toFixed(2).replace(".00", "") || ""}</td>
            <td>${month.sold.toFixed(2).replace(".00", "") || ""}</td>
            <td>${month.RUP_consumed.toFixed(2).replace(".00", "") || ""}</td>
            <td>${month.power.toFixed(1).replace(".0", "") || ""}</td> 
            <td>${
              days.reduce((a, b) => a + +b.plus, 0) >= days.length / 2
                ? "+"
                : ""
            }</td>
            <td>${month.gkal.toFixed(2).replace(".00", "") || ""}</td>
        </tr>`);

      if (month.month_id >= 1 && month.month_id <= 3) {
        kvartal1 = {
          ...kvartal1,
          production: kvartal1.production + month.production,
          total_consumed: kvartal1.total_consumed + month.total_consumed,
          ZBC_consumed: kvartal1.ZBC_consumed + month.ZBC_consumed,
          generation: kvartal1.generation + month.generation,
          procentage:
            ((kvartal1.procentage + month.procentage) * 100) /
            (kvartal1.total_consumed + month.total_consumed),
          sold: kvartal1.sold + month.sold,
          RUP_consumed: kvartal1.RUP_consumed + month.RUP_consumed,
          gkal: kvartal1.gkal + month.gkal,
        };

        if (month.month_id == 3) {
          lines.push(`
            <tr class="table-info">
            <td>${kvartal1.name}</td>
            <td>${kvartal1.production.toFixed(2).replace(".00", "") || ""}</td>
            <td>${
              kvartal1.total_consumed.toFixed(2).replace(".00", "") || ""
            }</td>
            <td>${
              kvartal1.ZBC_consumed.toFixed(2).replace(".00", "") || ""
            }</td>
            <td>${kvartal1.generation.toFixed(2).replace(".00", "") || ""}</td>
            <td>${kvartal1.procentage.toFixed(2).replace(".00", "") || ""}</td>
            <td>${kvartal1.sold.toFixed(2).replace(".00", "") || ""}</td>
            <td>${
              kvartal1.RUP_consumed.toFixed(2).replace(".00", "") || ""
            }</td>
            <td></td>
            <td></td>
            <td>${kvartal1.gkal.toFixed(2).replace(".00", "") || ""}</td>
            </tr>`);
        }
      }

      if (month.month_id >= 4 && month.month_id <= 6) {
        kvartal2 = {
          ...kvartal2,
          production: kvartal2.production + month.production,
          total_consumed: kvartal2.total_consumed + month.total_consumed,
          ZBC_consumed: kvartal2.ZBC_consumed + month.ZBC_consumed,
          generation: kvartal2.generation + month.generation,
          procentage:
            ((kvartal2.generation + month.generation) * 100) /
            (kvartal2.total_consumed + month.total_consumed),
          sold: kvartal2.sold + month.sold,
          RUP_consumed: kvartal2.RUP_consumed + month.RUP_consumed,
          gkal: kvartal2.gkal + month.gkal,
        };

        if (month.month_id == 6) {
          lines.push(`
            <tr class="table-info">
            <td>${kvartal2.name}</td>
            <td>${kvartal2.production.toFixed(2).replace(".00", "") || ""}</td>
            <td>${
              kvartal2.total_consumed.toFixed(2).replace(".00", "") || ""
            }</td>
            <td>${
              kvartal2.ZBC_consumed.toFixed(2).replace(".00", "") || ""
            }</td>
            <td>${kvartal2.generation.toFixed(2).replace(".00", "") || ""}</td>
            <td>${kvartal2.procentage.toFixed(2).replace(".00", "") || ""}</td>
            <td>${kvartal2.sold.toFixed(2).replace(".00", "") || ""}</td>
            <td>${
              kvartal2.RUP_consumed.toFixed(2).replace(".00", "") || ""
            }</td>
            <td></td>
            <td></td>
            <td>${kvartal2.gkal.toFixed(2).replace(".00", "") || ""}</td>
            </tr>`);
        }
      }

      if (month.month_id >= 7 && month.month_id <= 9) {
        kvartal3 = {
          ...kvartal3,
          production: kvartal3.production + month.production,
          total_consumed: kvartal3.total_consumed + month.total_consumed,
          ZBC_consumed: kvartal3.ZBC_consumed + month.ZBC_consumed,
          generation: kvartal3.generation + month.generation,
          procentage:
            ((kvartal3.generation + month.generation) * 100) /
            (kvartal3.total_consumed + month.total_consumed),
          sold: kvartal3.sold + month.sold,
          RUP_consumed: kvartal3.RUP_consumed + month.RUP_consumed,
          gkal: kvartal3.gkal + month.gkal,
        };

        if (month.month_id == 9) {
          lines.push(`
            <tr class="table-info">
            <td>${kvartal3.name}</td>
            <td>${kvartal3.production.toFixed(2).replace(".00", "") || ""}</td>
            <td>${
              kvartal3.total_consumed.toFixed(2).replace(".00", "") || ""
            }</td>
            <td>${
              kvartal3.ZBC_consumed.toFixed(2).replace(".00", "") || ""
            }</td>
            <td>${kvartal3.generation.toFixed(2).replace(".00", "") || ""}</td>
            <td>${kvartal3.procentage.toFixed(2).replace(".00", "") || ""}</td>
            <td>${kvartal3.sold.toFixed(2).replace(".00", "") || ""}</td>
            <td>${
              kvartal3.RUP_consumed.toFixed(2).replace(".00", "") || ""
            }</td>
            <td></td>
            <td></td>
            <td>${kvartal3.gkal.toFixed(2).replace(".00", "") || ""}</td>
            </tr>`);
        }
      }

      if (month.month_id >= 10 && month.month_id <= 12) {
        kvartal4 = {
          ...kvartal4,
          production: kvartal4.production + month.production,
          total_consumed: kvartal4.total_consumed + month.total_consumed,
          ZBC_consumed: kvartal4.ZBC_consumed + month.ZBC_consumed,
          generation: kvartal4.generation + month.generation,
          procentage:
            ((kvartal4.generation + month.generation) * 100) /
            (kvartal4.total_consumed + month.total_consumed),
          sold: kvartal4.sold + month.sold,
          RUP_consumed: kvartal4.RUP_consumed + month.RUP_consumed,
          gkal: kvartal4.gkal + month.gkal,
        };

        if (month.month_id == 12) {
          lines.push(`
            <tr class="table-info">
            <td>${kvartal4.name}</td>
            <td>${kvartal4.production.toFixed(2).replace(".00", "") || ""}</td>
            <td>${
              kvartal4.total_consumed.toFixed(2).replace(".00", "") || ""
            }</td>
            <td>${
              kvartal4.ZBC_consumed.toFixed(2).replace(".00", "") || ""
            }</td>
            <td>${kvartal4.generation.toFixed(2).replace(".00", "") || ""}</td>
            <td>${kvartal4.procentage.toFixed(2).replace(".00", "") || ""}</td>
            <td>${kvartal4.sold.toFixed(2).replace(".00", "") || ""}</td>
            <td>${
              kvartal4.RUP_consumed.toFixed(2).replace(".00", "") || ""
            }</td>
            <td></td>
            <td></td>
            <td>${kvartal4.gkal.toFixed(2).replace(".00", "") || ""}</td>
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
    await sql.connect(process.env.SQL_STRING);

    const result = await sql.query(QUERIES.getYears());

    result.recordset.map((year) => {
      lines.push(`
      <tr class="table-primary">
        <td>${year.year}</td>
        <td>${year.production.toFixed(2).replace(".00", "") || ""}</td>
        <td>${year.total_consumed.toFixed(2).replace(".00", "") || ""}</td>
        <td>${year.ZBC_consumed.toFixed(2).replace(".00", "") || ""}</td>
        <td>${year.generation.toFixed(2).replace(".00", "") || ""}</td>
        <td>${
          ((year.generation / year.total_consumed) * 100)
            .toFixed(2)
            .replace(".00", "") || ""
        }</td>
        <td>${year.sold.toFixed(2).replace(".00", "") || ""}</td>
        <td>${year.RUP_consumed.toFixed(2).replace(".00", "") || ""}</td>
        <td></td>
        <td></td>
        <td>${year.gkal.toFixed(2).replace(".00", "") || ""}</td>
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
    await sql.connect(process.env.SQL_STRING);

    const resultDays = await sql.query(
      QUERIES.getDaysByMonthOffset(offsetMonth)
    );

    const lastDay = resultDays.recordset[resultDays.recordset.length - 1];

    lines.push(`
        <tr class="table-secondary">
          <td>${
            monthNames[lastDay.month_id - 1]
          } ${lastDay.date.getFullYear()}</td>
          <td>${lastDay.production.toFixed(2).replace(".00", "") || ""}</td>
          <td>${lastDay.total_consumed.toFixed(2).replace(".00", "") || ""}</td>
          <td>${lastDay.ZBC_consumed.toFixed(2).replace(".00", "") || ""}</td>
          <td>${lastDay.generation.toFixed(2).replace(".00", "") || ""}</td>
          <td>${lastDay.procentage.toFixed(2).replace(".00", "") || ""}</td>
          <td>${lastDay.sold.toFixed(2).replace(".00", "") || ""}</td>
          <td>${lastDay.RUP_consumed.toFixed(2).replace(".00", "") || ""}</td>
          <td>${lastDay.power.toFixed(1).replace(".0", "") || ""}</td>
          <td>${
            resultDays.recordset.reduce((a, b) => a + +b.plus, 0) >=
            resultDays.recordset.length / 2
              ? "+"
              : ""
          }</td>
          <td>${lastDay.gkal.toFixed(2).replace(".00", "") || ""}</td>
        </tr>`);

    resultDays.recordset.map((day, index) => {
      lines.push(`
        <tr class="table-day">
            <td>с 1 по ${day.date.getDate()}</td>
            <td>${day.production.toFixed(2).replace(".00", "") || ""}</td>
            <td>${day.total_consumed.toFixed(2).replace(".00", "") || ""}</td>
            <td>${day.ZBC_consumed.toFixed(2).replace(".00", "") || ""}</td>
            <td>${day.generation.toFixed(2).replace(".00", "") || ""}</td>
            <td>${day.procentage.toFixed(2).replace(".00", "") || ""}</td>
            <td>${day.sold.toFixed(2).replace(".00", "") || ""}</td>
            <td>${day.RUP_consumed.toFixed(2).replace(".00", "") || ""}</td>
            <td>${day.power.toFixed(1).replace(".0", "") || ""}</td>
            <td>${day.plus ? "+" : ""}</td>
            <td>${day.gkal.toFixed(2).replace(".00", "") || ""}</td>
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
