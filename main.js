import { initDB, closeDB } from "./db.js";
import { mainMenu } from "./index.js";

async function start() {
  try {
    await initDB();
  } catch (err) {
    console.log("Could not connect to the database:", err.message);
    process.exit(1);
  }

  await mainMenu();
  await closeDB();
}

start();
