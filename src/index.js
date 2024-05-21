const {
  Employee,
  Salary,
  Title,
  DeptManager,
  Department,
  DeptEmp,
} = require("./database/Models/associations.js");
const db = require("./database/Connection/mysql.js");
const client = require('.//database/Connection/mongodb.js')
const { getEmployeesData } = require("./scripts/functions.js");
const { MongoClient } = require('mongodb');

db.authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

  //TODO: organizar main
async function migrateData() {
  await Employee.sync();
  const exportedData = await getEmployeesData();
  console.log(exportedData)
  try{
    await client.connect(); //TODO verificar se dado já não existe no banco
    const db = client.db('M2')
    const collection = db.collection('Employees')

    await collection.insertMany(exportedData)
    console.log('deu certo')
  }catch(error){
    console.log(error)
    await client.close()
  }
}

migrateData();
