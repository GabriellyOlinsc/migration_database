const Sequelize = require("sequelize");

const dbName = "employees";
const dbUser = "root";
const dbHost = "localhost";
const dbPassword = "Mkmgb@1954!";

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  dialect: "mysql",
  host: dbHost,
  models: [],
});

module.exports = sequelize;