import fs from "fs";

export const getUsersIds = () => {
  const lines = fs.readFileSync(
    new URL("../users.txt", import.meta.url),
    "utf8"
  );

  return lines
    .split("\n")
    .filter((line) => line != "")
    .map((line) => line.split("|")[0]);
};

export const reloadBot = () => {
  console.log("Перезапуск бота");
  setTimeout(() => {
    process.exit(1);
  }, 5000);
};
