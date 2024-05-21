const { DataTypes } = require('sequelize');
const sequelize = require('../Connection/mysql');

const DeptEmp = sequelize.define('DeptEmp', {
  emp_no: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  dept_no: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  from_date: DataTypes.DATE,
  to_date: DataTypes.DATE
}, {
  tableName: 'dept_emp',
  timestamps: false
});

module.exports = DeptEmp;
