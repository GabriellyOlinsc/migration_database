const { DataTypes } = require("sequelize");
const sequelize = require("../Connection/mysql");

const Title = sequelize.define(
  "Title",
  {
    emp_no: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    from_date: {
      type: DataTypes.DATE,
      primaryKey: true,
    },
    to_date: {
      type: DataTypes.DATE,
      primaryKey: true,
    },
  },
  {
    tableName: "titles",
    timestamps: false,
  }
);

module.exports = Title;



