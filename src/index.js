const db = require("./database/Connection/mysql.js");
const client = require('.//database/Connection/mongodb.js')
const { getEmployeesData, filterDuplicatedData } = require("./scripts/functions.js");
const Employee = require("./database/Models/employee.js");

db.authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

async function migrateData() {
  await Employee.sync();
  const exportedData = await getEmployeesData();

  if(exportedData.length === 0){
    console.log("No data to insert! ", exportedData)
    return 
  }
  const filteredData = await filterDuplicatedData(exportedData);
  if (filteredData.length === 0) {
      console.log("No new data to insert");
      return;
  }

  console.log(`Exported ${filteredData.length} employees`);

  try{
    await client.connect(); 
    const db = client.db('M2')
    const collection = db.collection('Employees')

    await collection.insertMany(filteredData)
    console.log('Data insertion successful');
  } catch (error) {
    console.error('Error during data migration:', error);
  } finally {
    await client.close();
  }
}

migrateData();
