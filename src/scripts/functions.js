const { Op, literal } = require("sequelize");
const {
    Employee,
    Salary,
    Title,
    Department,
    DeptEmp,
    DeptManager,
} = require("../database/Models/associations");
const client = require('../database/Connection/mongodb')

async function getEmployeesData() {
    await Employee.sync();
    try {
        const employees = await Employee.findAll({
            include: [
                { model: Salary, attributes: ["salary", "from_date", "to_date"] },
                { model: Title, attributes: ["title", "from_date", "to_date"] },
                {
                    model: DeptEmp,
                    attributes: ["from_date", "to_date"],
                    include: [
                        {
                            model: Department,
                            attributes: ["dept_no", "dept_name"],
                        },
                    ],
                },
            ],
            limit: 1
        });
        const dataJson = [];
        //  employees.forEach((employee) => dataJson.push(transformData(employee)));

        for (const employee of employees) {
            const employeeData = transformData(employee);
            const lastDepartment = await getLastDepartment(employee.emp_no);
            if (lastDepartment) {
                const manager = await getManagerOfDepartment(lastDepartment.dept_no);
                employeeData.manager = manager;
            }
            dataJson.push(employeeData);
        }       
        return dataJson;
    } catch (err) {
        throw err;
    }
}

function transformData(employee) {

    const transformedEmployee = {
        emp_no: employee.emp_no,
        first_name: employee.first_name,
        last_name: employee.last_name,
        gender: employee.gender,
        hire_date: employee.hire_date,
        salaries: employee.Salaries.map((salary) => ({
            salary: salary.salary,
            from_date: salary.from_date,
            to_date: salary.to_date,
        })),
        titles: employee.Titles.map((title) => ({
            title: title.title,
            from_date: title.from_date,
            to_date: title.to_date,
        })),
        departments: employee.DeptEmps.map((deptEmp) => ({
            dept_no: deptEmp.Department.dept_no,
            dept_name: deptEmp.Department.dept_name,
            from_date: deptEmp.from_date,
            to_date: deptEmp.to_date,
        })),
    };
    return transformedEmployee;
}

async function filterDuplicatedData(employee) {
    const newValues = []

    try {
        await client.connect(); 
        const db = client.db('M2');
        const collection = db.collection('Employees');

        for (const element of employee) {
            try {
                const employeeExists = await collection.findOne({ emp_no: element.emp_no });
                if (!employeeExists) {
                    newValues.push(element);
                }
            } catch (error) {
                console.error('Error finding employee:', error);
            }
        }
    } catch (connectionError) {
        console.error('Error connecting to MongoDB:', connectionError);
    } finally {
        await client.close(); 
    }
    return newValues;

}

async function getLastDepartment(emp_no = 10010) {
    const deptEmp = await DeptEmp.findOne({
        where: { emp_no },
        order: [['to_date', 'DESC']],
        include: [{ model: Department, attributes: ["dept_no", "dept_name"] }],
    });
    return deptEmp ? deptEmp.Department : null;
}


async function getManagerOfDepartment(dept_no = 'd006') {
    const currentManager = await DeptManager.findOne({
        where: { dept_no },
        order: [['to_date', 'DESC']],
    });
    //TODO: escolher método , FORMAA 1 
    console.log('debug forma 1: \n', currentManager.toJSON())

    //forma 2
    const deptManager = await Employee.findOne({ where: { emp_no: currentManager.emp_no } })
    if (!deptManager) {
        return null
    }
    console.log('debug forma 2, \n', deptManager.toJSON())
    return currentManager.toJSON()

    return currentManager ? await Employee.findOne({ where: { emp_no: currentManager.emp_no } }) : null;
}
getEmployeesData()
module.exports = { getEmployeesData, filterDuplicatedData };
