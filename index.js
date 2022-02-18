import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import express from "express";
import { sendRequestUser, sendMessageToAdmin } from "./utils/notify.js";
import { getUsersIds } from "./utils/utils.js";
import fs from "fs";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const app = express();
const host = "localhost";
const port = process.env.PORT || 9081;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Проверка пользователем на работоспособность
bot.on("text", (ctx) => {
  if (getUsersIds().includes("" + ctx.message.chat.id)) {
    ctx.reply(`Работает`);
  } else {
    ctx.reply(`Запрос на пользование отправлен!`);
    sendRequestUser(bot, ctx);
  }
});

bot.launch();

app.listen(port, host, function () {
  console.log(`Bot listens http://${host}:${port} :: ${new Date()}`);
});
