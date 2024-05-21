const { DataTypes } = require('sequelize');
const sequelize = require('../Connection/mysql');
const Employee = require('./employee');

const Salary = sequelize.define('Salary', {
  emp_no: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  salary: DataTypes.INTEGER,
  from_date: {
    type: DataTypes.DATE,
    primaryKey: true
  },
  to_date: DataTypes.DATE
}, {
  tableName: 'salaries',
  timestamps: false
});

module.exports = Salary;