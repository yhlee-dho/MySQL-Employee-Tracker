// requirements
const inquirer = require("inquirer");
var mysql = require("mysql");

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
});

connection.connect(function(err) {
    if (err) throw err;
    runSearch();
});