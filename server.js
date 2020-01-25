// requirements
const inquirer = require("inquirer")
var mysql = require("mysql")
const { sqlPassword } = require("./config.json") 
const connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: { sqlPassword },
    database: "cms"
})

// connection.connect(function(err) {
//     if (err) throw err;
//     runSearch();
// });



// call to connection

// get first and last name
async function getFirstAndLastName() {
    let employee = fullName.split(" ");
    if(employee.length == 2) {
        return employee;
    }

    const last_name = employee[employee.length-1];
    let first_name = " ";
    for(let i=0; i < employee.length-1; i++) {
        first_name = first_name + employee[i] + " ";
    }
    return [first_name.trim(), last_name];
}

// get manager names
async function getManagerNames() {
    let query = "SELECT * FROM employee WHERE manager_id IS NULL"
    const rows = await connection.query(query)
    console.log("row.length " + rows.length)

    let employeeNames = []
    for(const employee of rows) {
        employeeNames.push(employee.first_name + " " + employee.last_name)
    }
    return employeeNames
}

// get employee names
async function getEmployeeNames() {
    let query = "SELECT * FROM employee";

    const rows = await db.query(query);
    let employeeNames = [];
    for(const employee of rows) {
        employeeNames.push(employee.first_name + " " + employee.last_name);
    }
    return employeeNames;
}
// get employee id
async function getEmployeeId(fullName) {
    // parse name into first and last name
    let employee = getFirstAndLastName(fullName);

    let query = 'SELECT id FROM employee WHERE employee.first_name=? AND employee.last_name=?';
    let args=[employee[0], employee[1]];
    const rows = await db.query(query, args);
    return rows[0].id;
}
// get roles
async function getRoles() {
    let query = "SELECT title FROM role"
    const rows = await connection.query(query)
    //console.log("Number of rows returned: " + rows.length);

    let roles = [];
    for(const row of rows) {
        roles.push(row.title)
    }

    return roles
}
// get role id
async function getRoleId(roleName) {
    let query = "SELECT * FROM role WHERE role.title=?";
    let args = [roleName];
    const rows = await db.query(query, args);
    return rows[0].id;
}
// get department names
async function getDepartmentNames() {
    let query = "SELECT name FROM department";
    const rows = await db.query(query);
    //console.log("Number of rows returned: " + rows.length);

    let departments = [];
    for(const row of rows) {
        departments.push(row.name);
    }

    return departments;
}
// get department id
async function getDepartmentId(departmentName) {
    let query = "SELECT * FROM department WHERE department.name=?";
    let args = [departmentName];
    const rows = await db.query(query, args);
    return rows[0].id;
}

// add department
async function addDepartment(departmentInfo) {
    const departmentName = departmentInfo.departmentName;
    let query = 'INSERT into department (name) VALUES (?)';
    let args = [departmentName];
    const rows = await db.query(query, args);
    console.log(`Added department named ${departmentName}`);
}
// get departmentInfo
async function getDepartmentInfo() {
    return inquirer
    .prompt([
        {
            type: "input",
            message: "What is the name of the new department?",
            name: "departmentName"
        }
    ])
}
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
}
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
                // populate from db
                ...departments
            ]
        }
    ])
}
// add employee
async function addEmployee() {

}
// delete employee
async function deleteEmployee() {

}
// update employee role
async function updateEmployeeRole() {

}

// view all employees
async function viewAllEmployees() {

}
// view all roles
async function viewAllRoles() {

}
// view all departments
async function viewAllDepartments() {

}
// view all employees for each department
async function viewAllEmployeesForEachDepartment() {

}



// inquirer prompts
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
}

// inquirer functions
async function getAddEmployeeInfo() {
    const managers = await getManagerNames()
    const roles = await getRoles()
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
                    // populate from connection
                    ...roles
                ]
            },
            {
                type: "list",
                message: "Who is the employee's manager?",
                name: "manager",
                choices: [
                    // populate from connection
                    ...managers
                ]
            }
        ])
}1

// main function
async function main() {
    let exitLoop = false;
    while(!exitLoop) {
        const prompt = await mainPrompt();

        switch () {
            case '': {

            }
            case '': {
                
            }
            case '': {
                
            }
            case '': {
                
            }
            case '': {
                
            }
            case '': {
                
            }
            case '': {
                
            }
            case '': {
                
            }
            case '': {
                
            }

        }

}

// Close your database connection when Node exits
process.on("exit", async function(response) {
    await connection.close();
    return console.log(`Exiting ${response}`);
});

main();