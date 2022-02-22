import { Markup } from "telegraf";
import { getUsersIds } from "./utils.js";
import { generateYearImage, generateMonthImage } from "./generate_images.js";

export const sendRequestUser = (bot, from) => {
  try {
    process.env.ADMINS_ID.split(",").map((admin_id) => {
      const { id, username, first_name, last_name } = from;
      const text = `
    Запрос на доступ:
    
    Имя: ${first_name} ${last_name}
    Nik: ${username ? "@" + username : "-"}
    ID: ${id}
        `;
      const keyboard = Markup.inlineKeyboard([
        Markup.button.callback(
          "Добавить",
          `addUser |${id}| |${username || "-"}| |${
            first_name + " " + last_name
          }|`
        ),
      ]);

      // bot.getChat(admin_id).

      bot.telegram
        .getChat(admin_id)
        .then((user) => bot.telegram.sendMessage(user.id, text, keyboard))
        .catch((err) => console.log(err));
    });
  } catch (err) {
    console.log(err);
  }
};

export const sendMessageToAdmin = (bot, message) => {
  try {
    process.env.ADMINS_ID.split(",").map((admin_id) => {
      bot.telegram
        .getChat(admin_id)
        .then((user) => bot.telegram.sendMessage(user.id, message))
        .catch((err) => console.log(err));
    });
  } catch (err) {
    console.log(err);
  }
};

export const sendDataNotify = (bot, user_id) => {
  try {
    bot.telegram
      .getChat(user_id)
      .then((user) => {
        const { id, username, first_name, last_name } = user;

        bot.telegram.sendMessage(id, "Вот данные!");

        if (id != process.env.SUPER_ADMIN_ID) {
          bot.telegram.sendMessage(
            process.env.SUPER_ADMIN_ID,
            `Запрос данных от: ${
              first_name + " " + last_name
            }, @${username}, ${id}`
          );
        }
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
};

export const sendDataYearNotify = (bot, ctx) => {
  try {
    const { id, username, first_name, last_name } = ctx.message.chat;

    ctx.replyWithChatAction("upload_photo");

    generateYearImage().then(() => {
      ctx.replyWithPhoto({
        source: "year.png",
      });
    });

    if (id != process.env.SUPER_ADMIN_ID) {
      bot.telegram.sendMessage(
        process.env.SUPER_ADMIN_ID,
        `Запрос данных от: ${first_name + " " + last_name}, @${username}, ${id}`
      );
    }
  } catch (err) {
    console.log(err);
  }
};

export const sendDataMonthNotify = (bot, ctx, offsetMonth) => {
  try {
    const { id, username, first_name, last_name } = ctx.message.chat;

    ctx.replyWithChatAction("upload_photo");

    generateMonthImage(offsetMonth).then(() => {
      ctx.replyWithPhoto({
        source: "month.png",
      });
    });

    if (id != process.env.SUPER_ADMIN_ID) {
      bot.telegram.sendMessage(
        process.env.SUPER_ADMIN_ID,
        `Запрос данных от: ${first_name + " " + last_name}, @${username}, ${id}`
      );
    }
  } catch (err) {
    console.log(err);
  }
};
