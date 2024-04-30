const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Jimin199',
    database: 'employees_db',
});

const menu = () => {
    inquirer.prompt({
        type: 'list',
        message: 'Welcome',
        choices: ['Display Departments',
        'Display Roles', 
        'Display Employees',
        'Add Department',
        'Add Role',
        'Add Employee',
        'Update Employee Role',
        'Exit']
    })
}
