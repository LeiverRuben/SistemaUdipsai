import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "sistema_udipsai",
  "root",
  "Leiver1234",
  {
    host: "localhost",
    dialect: "mysql",
  }
);
