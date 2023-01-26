import { Telegraf, Markup } from "telegraf";
import dotenv from "dotenv";
import express from "express";
import {
  sendRequestUser,
  sendMessageToAdmin,
  sendDataYearNotify,
  sendDataAllYearsNotify,
  sendDataMonthNotify,
} from "./utils/notify.js";
import { getUsersIds, reloadBot } from "./utils/utils.js";
import fs from "fs";

dotenv.config();

const buttons = [
  ["Прошлые года", "Год"],
  ["-2 мес.", "-1 мес.", "0 мес."],
];

const bot = new Telegraf(process.env.BOT_TOKEN);

const app = express();
const host = "localhost";
const port = process.env.PORT || 9081;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

bot.use(async (ctx, next) => {
  if (getUsersIds().includes("" + ctx.chat.id)) {
    await next();
  } else {
    sendRequestUser(bot, ctx.from);
  }
});

bot.hears("Перезапуск", () => {
  reloadBot();
});

bot.action(/addUser \|(.+)\| \|(.+)\| \|(.+)\|/, (ctx) => {
  try {
    const id = ctx.match[1];
    const username = ctx.match[2];
    const fio = ctx.match[3];

    const lineToFile = `${id}|${username}|${fio}\n`;

    fs.readFile("users.txt", "utf8", (err, data) => {
      if (err) console.log(err);

      const ids = data
        .split("\n")
        .filter((line) => line != "")
        .map((line) => line.split("|")[0]);

      if (ids.some((idInArray) => idInArray == id)) {
        sendMessageToAdmin(bot, `Доступ уже предоставлен раньше!!!`);
      } else {
        fs.appendFile("users.txt", lineToFile, (err) => {
          if (err) console.log(err);
        });

        sendMessageToAdmin(
          bot,
          `Доступ предоставлен: ${ctx.match[3]}, ${
            ctx.match[2] == "-" ? "-" : "@" + ctx.match[2]
          }, ${ctx.match[1]}`
        );

        bot.telegram.sendMessage(
          id,
          "Доступ предоставлен!",
          Markup.keyboard(buttons).resize()
        );
      }

      ctx.deleteMessage();
    });
  } catch (err) {
    console.log(err);
  }
});

bot.hears("Год", (ctx) => {
  sendDataYearNotify(bot, ctx, buttons);
});

bot.hears("Прошлые года", (ctx) => {
  sendDataAllYearsNotify(bot, ctx, buttons);
});

bot.hears(/(.+) мес./i, (ctx) => {
  const offsetMonth = parseInt(ctx.match[1]);
  if (!isNaN(offsetMonth) && offsetMonth <= 0 && offsetMonth >= -2) {
    sendDataMonthNotify(bot, ctx, Math.abs(offsetMonth), buttons);
  } else {
    ctx.reply("Ошибка!");
  }
});

// Проверка пользователем на работоспособность
bot.on("text", (ctx) => {
  if (getUsersIds().includes("" + ctx.message.chat.id)) {
    ctx.reply("Мне такое неизвестно", Markup.keyboard(buttons).resize());
  } else {
    ctx.reply(`Запрос на пользование отправлен!`);
    sendRequestUser(bot, ctx.chat);
  }
});

bot.launch();

app.listen(port, host, function () {
  console.log(`Bot listens http://${host}:${port} :: ${new Date()}`);
});
