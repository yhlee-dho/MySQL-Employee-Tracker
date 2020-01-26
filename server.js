// requirements
const inquirer = require("inquirer");
const { sqlPassword } = require("./config.json");
const consoleTable = require("console-table");
const Database = require ("./DbAsync");



// new db
const db = new Database({
    host: "localhost",
    port: 3306,
    user: "root",
    password: sqlPassword,
    database: "cms"
  });


// db.connect(function(err) {
//     if (err) throw err;
//     runSearch();
// });


// --------------------------------------------------------------------------------
// call to db
// --------------------------------------------------------------------------------
// get first and last name
async function getFirstAndLastName(fullName) {
    let employee = fullName.split(" ");
    if(employee.length == 2) {
        return employee;
    };

    const last_name = employee[employee.length-1];
    let first_name = " ";
    for(let i=0; i < employee.length-1; i++) {
        first_name = first_name + employee[i] + " ";
    };
    return [first_name.trim(), last_name];
};

// get manager names
async function getManagerNames() {
    let query = "SELECT * FROM employee WHERE manager_id IS NULL";
    const rows = await db.query(query);
    console.log("row.length " + rows.length);

    let employeeNames = [];
    for(const employee of rows) {
        employeeNames.push(employee.first_name + " " + employee.last_name);
    };
    return employeeNames;
};

// get employee names
async function getEmployeeNames() {
    let query = "SELECT * FROM employee";

    const rows = await db.query(query);
    let employeeNames = [];
    for(const employee of rows) {
        employeeNames.push(employee.first_name + " " + employee.last_name);
    };
    return employeeNames;
};

// get employee id
async function getEmployeeId(fullName) {
    // parse name into first and last name
    let employee = getFirstAndLastName(fullName);

    let query = "SELECT id FROM employee WHERE employee.first_name=? AND employee.last_name=?";
    let args=[employee[0], employee[1]];
    const rows = await db.query(query, args);
    return rows[0].id;
};

// get roles
async function getRoles() {
    let query = "SELECT title FROM role";
    const rows = await db.query(query);
    console.log("Number of rows returned: " + rows.length);

    let roles = [];
    for(const row of rows) {
        roles.push(row.title);
    };
    return roles;
};

// get role id
async function getRoleId(roleName) {
    let query = "SELECT * FROM role WHERE role.title=?";
    let args = [roleName];
    const rows = await db.query(query, args);
    return rows[0].id;
};

// get department names
async function getDepartmentNames() {
    let query = "SELECT name FROM department";
    const rows = await db.query(query);
    console.log("Number of rows returned: " + rows.length);
    let departments = [];
    for(const row of rows) {
        departments.push(row.name);
    };
    return departments;
};

// get department id
async function getDepartmentId(departmentName) {
    let query = "SELECT * FROM department WHERE department.name=?";
    let args = [departmentName];
    const rows = await db.query(query, args);
    return rows[0].id;
};

// add department
async function addDepartment(departmentInfo) {
    const departmentName = departmentInfo.departmentName;
    let query = 'INSERT into department (name) VALUES (?)';
    let args = [departmentName];
    const rows = await db.query(query, args);
    console.log(`Added department named ${departmentName}`);
};

// get departmentInfo
async function getDepartmentInfo() {
    return inquirer
    .prompt([
        {
            type: "input",
            message: "What is the name of the new department?",
            name: "departmentName"
        }
    ]);
};

// add role
async function addRole(roleInfo) {
    // INSERT into role (title, salary, department_id) VALUES ("TITLE", 9999999, 1);
    const departmentId = await getDepartmentId(roleInfo.departmentName);
    const salary = roleInfo.salary;
    const title = roleInfo.roleName;
    let query = 'INSERT into role (title, salary, department_id) VALUES (?,?,?)';
    let args = [title, salary, departmentId];
    const rows = await db.query(query, args);
    console.log(`Added role ${title}`);
};

// get roleInfo
async function getRoleInfo() {
    const departments = await getDepartmentNames();
    return inquirer
    .prompt([
        {
            type: "input",
            message: "What is the title of the new role?",
            name: "roleName"
        },
        {
            type: "input",
            message: "What is the salary of the new role?",
            name: "salary"
        },
        {
            type: "list",
            message: "Which department uses this role?",
            name: "departmentName",
            choices: [
                ...departments
            ]
        }
    ]);
};

// add employee
async function addEmployee(employeeInfo) {
    let roleId = await getRoleId(employeeInfo.role);
    let managerId = await getEmployeeId(employeeInfo.manager);

    // INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("KENNY", "SMITH", 2, 5);
    let query = "INSERT into employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";
    let args = [employeeInfo.first_name, employeeInfo.last_name, roleId, managerId];
    const rows = await db.query(query, args);
    console.log(`Added employee ${employeeInfo.first_name} ${employeeInfo.last_name}.`);
};

// get employeeInfo
async function getAddEmployeeInfo() {
    const managers = await getManagerNames();
    const roles = await getRoles();
    return inquirer
        .prompt([
            {
                type: "input",
                name: "first_name",
                message: "What is the employee's first name?"
            },
            {
                type: "input",
                name: "last_name",
                message: "What is the employee's last name?"
            },
            {
                type: "list",
                message: "What is the employee's role?",
                name: "role",
                choices: [
                    ...roles
                ]
            },
            {
                type: "list",
                message: "Who is the employee's manager?",
                name: "manager",
                choices: [
                    ...managers
                ]
            }
        ]);
};

// delete employee
async function removeEmployee(employeeInfo) {
    const employeeName = getFirstAndLastName(employeeInfo.employeeName);
    // DELETE from employee WHERE first_name="Kylo" AND last_name="Ren";
    let query = "DELETE from employee WHERE first_name=? AND last_name=?";
    let args = [employeeName[0], employeeName[1]];
    const rows = await db.query(query, args);
    console.log(`Employee removed: ${employeeName[0]} ${employeeName[1]}`);
};

// get delete employeeInfo
async function getRemoveEmployeeInfo() {
    const employees = await getEmployeeNames();
    return inquirer
    .prompt([
        {
            type: "list",
            message: "Which employee do you want to remove?",
            name: "employeeName",
            choices: [
                // populate from db
                ...employees
            ]
        }
    ]);
};

// update employee role
async function updateEmployeeRole() {
    // UPDATE employee SET role_id=1 WHERE employee.first_name='Darth' AND employee.last_name='Maul';
    const roleId = await getRoleId(employeeInfo.role);
    const employee = getFirstAndLastName(employeeInfo.employeeName);

    let query = 'UPDATE employee SET role_id=? WHERE employee.first_name=? AND employee.last_name=?';
    let args=[roleId, employee[0], employee[1]];
    const rows = await db.query(query, args);
    console.log(`Updated employee ${employee[0]} ${employee[1]} with role ${employeeInfo.role}`);
};

// get update employee role info
async function getUpdateEmployeeRoleInfo() {
    const employees = await getEmployeeNames();
    const roles = await getRoles();
    return inquirer
        .prompt([
            {
                type: "list",
                message: "Which employee do you want to update?",
                name: "employeeName",
                choices: [
                    // populate from db
                    ...employees
                ]
            },
            {
                type: "list",
                message: "What is the employee's new role?",
                name: "role",
                choices: [
                    // populate from db
                    ...roles
                ]
            }
        ])
};

// view all employees
async function viewAllEmployees() {
    console.log("----------");
    // SELECT * FROM employee
    let query = "SELECT * FROM employee";
    const rows = await db.query(query);
    console.table(rows);
}

// view all roles
async function viewAllRoles() {
    console.log("----------");
    // SELECT * FROM role;
    let query = "SELECT * FROM role";
    const rows = await db.query(query);
    console.table(rows);
    return rows;
};

// view all departments
async function viewAllDepartments() {
    console.log("----------");
    // SELECT * from department;
    let query = "SELECT * FROM department";
    const rows = await db.query(query);
    console.table(rows);
};

// view all employees for each department
async function viewAllEmployeesByDepartment() {
    // console.log("----------");
    // SELECT first_name, last_name, department.name FROM ((employee INNER JOIN role ON role_id = role.id) INNER JOIN department ON department_id = department.id);
    console.log("----------");
    let query = "SELECT first_name, last_name, department.name FROM ((employee INNER JOIN role ON role_id = role.id) INNER JOIN department ON department_id = department.id);";
    const rows = await db.query(query);
    console.table(rows);
};

// main prompt
async function mainPrompt() {
    return inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "action",
                choices: [
                  "Add department",
                  "Add employee",
                  "Add role",
                  "Remove employee",
                  "Update employee role",
                  "View all departments",
                  "View all employees",
                  "View all employees by department",
                  "View all roles",
                  "Exit"
                ]
            }
        ])
};

// inquirer functions
async function getAddEmployeeInfo() {
    const managers = await getManagerNames();
    const roles = await getRoles();
    return inquirer
        .prompt([
            {
                type: "input",
                name: "first_name",
                message: "What is the employee's first name?"
            },
            {
                type: "input",
                name: "last_name",
                message: "What is the employee's last name?"
            },
            {
                type: "list",
                message: "What is the employee's role?",
                name: "role",
                choices: [
                    // populate from db
                    ...roles
                ]
            },
            {
                type: "list",
                message: "Who is the employee's manager?",
                name: "manager",
                choices: [
                    // populate from db
                    ...managers
                ]
            }
        ])
};

// main function
async function main() {
    let exitLoop = false;
    while(!exitLoop) {
        const prompt = await mainPrompt();

        switch(prompt.action) {
            case 'Add department': {
                const newDepartmentName = await getDepartmentInfo()
                await addDepartment(newDepartmentName)
                break
            }

            case 'Add employee': {
                const newEmployee = await getAddEmployeeInfo()
                console.log("add an employee")
                console.log(newEmployee)
                await addEmployee(newEmployee)
                break
            }

            case 'Add role': {
                const newRole = await getRoleInfo()
                console.log("add a role")
                await addRole(newRole)
                break
            }

            case 'Remove employee': {
                const employee = await getRemoveEmployeeInfo()
                await removeEmployee(employee)
                break
            }
            
            case 'Update employee role': {
                const employee = await getUpdateEmployeeRoleInfo()
                await updateEmployeeRole(employee)
                break
            }

            case 'View all departments': {
                await viewAllDepartments()
                break
            }

            case 'View all employees': {
                await viewAllEmployees()
                break
            }

            case 'View all employees by department': {
                await viewAllEmployeesByDepartment()
                break
            }

            case 'View all roles': {
                await viewAllRoles()
                break
            }

            case 'Exit': {
                exitLoop = true;
                // if exit
                process.exit(0) 
                return
            }

            default:
                console.log(`Internal warning. Shouldn't get here. action was ${prompt.action}`)
        }
    };
};

// Close db when Node exits
process.on("exit", async function(response) {
    await db.close();
    return console.log(`Exiting ${response}`);
});

main();