import { Markup } from "telegraf";
import { getUsersIds } from "./utils.js";

export const sendRequestUser = (bot, ctx) => {
  process.env.ADMINS_ID.split(",").map((admin_id) => {
    const { id, username, first_name, last_name } = ctx.message.chat;
    const text = `
  Запрос на доступ:
  
  Имя: ${first_name} ${last_name}
  Nik: ${username ? "@" + username : "-"}
  ID: ${id}
      `;
    const keyboard = Markup.inlineKeyboard([
      Markup.button.callback(
        "Добавить",
        `addUser |${id}| |${username || "-"}| |${first_name + " " + last_name}|`
      ),
    ]);

    bot.telegram.sendMessage(admin_id, text, keyboard);
  });
};

export const sendMessageToAdmin = (bot, message) => {
  process.env.ADMINS_ID.split(",").map((admin_id) => {
    bot.telegram.sendMessage(admin_id, message);
  });
};
