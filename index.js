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
        name: 'menu',
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
    }).then((answers) => {
        switch(answers.choice) {
            case 'Display Departments':
                // Call function to display departments
                break;
            case 'Display Roles':
                // Call function to display roles
                break;
            // Add cases for other choices
            case 'Exit':
                connection.end(); // Close the connection to MySQL
                console.log('Goodbye!');
                break;
            default:
                console.log('Invalid choice');
        }
    });
}


// function to show department

// function to show role

// function to show employee

// function to add department

// function to add role

// function to add employee

// function to update an employee's role


menu();