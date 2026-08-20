import dotenv from "dotenv";
import { Sequelize } from "sequelize";
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
  },
);

async function initDB() {
  await sequelize.authenticate();
  await sequelize.sync();
  console.log("DB is connected and table is synced");
}

async function closeDB() {
  await sequelize.close();
}

export { closeDB, initDB, sequelize };
