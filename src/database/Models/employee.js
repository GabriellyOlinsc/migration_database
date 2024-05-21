const { DataTypes } = require('sequelize');
const sequelize = require('../Connection/mysql');

const Employee = sequelize.define('Employee', {
  emp_no: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  gender: DataTypes.STRING,
  hire_date: DataTypes.DATE,
  birth_date: DataTypes.DATE,
}, {
  tableName: 'employees',
  timestamps: false
});

module.exports = Employee;