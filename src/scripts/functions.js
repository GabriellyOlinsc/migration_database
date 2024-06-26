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
            limit: 300
        });
        const dataJson = [];
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

async function getLastDepartment(emp_no) {
    const deptEmp = await DeptEmp.findOne({
        where: { emp_no },
        order: [['to_date', 'DESC']],
        include: [{ model: Department, attributes: ["dept_no", "dept_name"] }],
    });
    return deptEmp ? deptEmp.Department : null;
}

async function getManagerOfDepartment(dept_no) {
    const currentManager = await DeptManager.findOne({
        where: { dept_no },
        order: [['to_date', 'DESC']],
    });

    const deptManager = await Employee.findOne({ where: { emp_no: currentManager.emp_no } })
    if (!deptManager) {
        return null
    }
    const managerJSON = deptManager.toJSON()

    const finalData = {
        first_name: managerJSON.first_name,
        last_name: managerJSON.last_name,
        gender: managerJSON.gender,
        ...currentManager.toJSON()
    }
    return finalData; 
}
getEmployeesData()

module.exports = { getEmployeesData, filterDuplicatedData };
