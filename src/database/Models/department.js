const { DataTypes } = require('sequelize');
const sequelize = require('../Connection/mysql');

const Department = sequelize.define('Department', {
  dept_no: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  dept_name: DataTypes.STRING
}, {
  tableName: 'departments',
  timestamps: false
});

module.exports = Department;
