const {Op, literal } = require("sequelize");
const {
    Employee,
    Salary,
    Title,
    Department,
    DeptEmp,
    DeptManager,
} = require("../database/Models/associations");

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
                {
                    model: DeptManager,
                    attributes: ["emp_no", "dept_no", "from_date", "to_date"],  //TODO achar uma maneira de não inserir como um array
                    where: {
                        to_date: {
                            [Op.gt]: literal("NOW()"),
                        },
                    },
                },
            ],
            limit: 10,
        });

        const dataJson = [];
        employees.forEach((employee) => dataJson.push(transformData(employee)));

        return dataJson;
    } catch (err) {
        throw err;
    }
}
function transformData(employee) {
    console.log(
        employee.DeptManagers[0].emp_no)

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
       /* deptManager: employee.DeptManagers.map((manager) => ({
            dept_no: manager.dept_no,
            emp_no: manager.emp_no,
            from_date: manager.from_date,
            to_date: manager.to_date
        }))*/
         deptManager: {
            dept_no: employee.DeptManagers[0].dept_no,
            emp_no: employee.DeptManagers[0].emp_no,
            from_date: employee.DeptManagers[0].from_date,
            to_date: employee.DeptManagers[0].to_date
        }
    };
    return transformedEmployee;
}

getEmployeesData()
module.exports = { getEmployeesData };
