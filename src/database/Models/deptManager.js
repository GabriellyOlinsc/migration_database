const { DataTypes } = require('sequelize');
const sequelize = require('../Connection/mysql');

const DeptManager = sequelize.define('DeptManager', {
  dept_no: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  emp_no: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  from_date: DataTypes.DATE,
  to_date: DataTypes.DATE
}, {
  tableName: 'dept_manager',
  timestamps: false
});

module.exports = DeptManager;
