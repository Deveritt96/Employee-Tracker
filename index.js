const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Jimin199',
    database: 'employees_db',
});

let displayMenu = true;

const menu = async () => {
    while (true) {
        if (displayMenu) {
            const answers = await inquirer.prompt({
                name: 'choice',
                type: 'list',
                message: 'Welcome!',
                choices: [
                    'Display Departments',
                    'Display Roles',
                    'Display Employees',
                    'Add Department',
                    'Add Role',
                    'Add Employee',
                    'Update Employee Role',
                    'Exit'
                ]
            });

            const choice = answers.choice;
            const actions = {
                'Display Departments': showDepartments,
                'Display Roles': showRoles,
                'Display Employees': showEmployees,
                'Add Department': addDepartment,
                'Add Role': addRole,
                'Add Employee': addEmployee,
                'Update Employee Role': updateEmployeeRole,
                'Exit': exit
            };

            const action = actions[choice];
            if (action) {
                await action();
            } else {
                console.log('Invalid choice');
            }
        }
        displayMenu = true;
    }
};



// function to show department
const showDepartments = () => {
    connection.query(
        'SELECT * FROM department',
        (err, results) => {
            if (err) {
                console.error('Error displaying departments: ' + err);
                return;
            }
            console.log('\nDepartments:');
            results.forEach(department => {
                console.log(`ID: ${department.id} | Name: ${department.department_name}`);
            });
            displayMenu = true; // Set displayMenu to true to display the menu again
        }
    );
};

// function to show role
const showRoles = () => {
    connection.query(
        'SELECT * FROM role',
        (err, results) => {
            if (err) {
                console.error('Error displaying roles: ' + err);
                return;
            }
            console.log('\nRoles:');
            results.forEach(role => {
                console.log(`ID: ${role.id} | Name: ${role.title} | Salary: ${role.salary} | Department ID: ${role.department_id}`)
            });
            displayMenu = true; // Set displayMenu to true to display the menu again
        }
    );
};

// function to show employee
const showEmployees = () => {
    connection.query(
        'SELECT * FROM employee',
        (err, results) => {
            if(err) {
                console.error('Error displaying employees: ' + err);
                return;
            }
            console.log('\nEmployees: ');
            results.forEach(employee => {
                console.log(`ID: ${employee.id} | Name: ${employee.first_name} ${employee.last_name} | Role ID: ${employee.role_id} | Manager ID: ${employee.manager_id}`)
            });
            displayMenu = true; // Set displayMenu to true to display the menu again
        }
    )
};

// function to add department
const addDepartment = async () => {
    const departmentData = await inquirer.prompt([
        {
            name: 'id',
            type: 'input',
            message: 'Enter the ID of the department:'
        },
        {
            name: 'departmentName',
            type: 'input',
            message: 'Enter the name of the department:'
        }
    ]);

    const { id, departmentName } = departmentData;

    connection.query(
        'INSERT INTO department (id, department_name) VALUES (?, ?)',
        [id, departmentName],
        (err, result) => {
            if (err) {
                console.error('Error adding department: ' + err);
                return;
            }
            console.log(`\nDepartment ${departmentName} added successfully.`);
            displayMenu = true; // After adding the department, go back to the main menu
        }
    );
};


// function to add role
const addRole = async () => {
    const departments = await getDepartments(); // Assume you have a function to fetch departments

    const roleData = await inquirer.prompt([
        {
            name: 'id',
            type: 'input',
            message: 'Enter the ID of the role:'
        },
        {
            name: 'title',
            type: 'input',
            message: 'Enter the title of the role:'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'Enter the salary for the role:'
        },
        {
            name: 'departmentId',
            type: 'list',
            message: 'Select the department for the role:',
            choices: departments.map(department => ({
                name: department.department_name,
                value: department.id
            }))
        }
    ]);

    const { id, title, salary, departmentId } = roleData;

    connection.query(
        'INSERT INTO role (id, title, salary, department_id) VALUES (?, ?, ?, ?)',
        [id, title, salary, departmentId],
        (err, result) => {
            if (err) {
                console.error('Error adding role: ' + err);
                return;
            }
            console.log(`\nRole ${title} added successfully.`);
            displayMenu = true; // Set displayMenu to true to display the menu again
        }
    );
};

const addEmployee = async () => {
    const roles = await getRoles(); 

    const employeeData = await inquirer.prompt([
        {
            name: 'id',
            type: 'number',
            message: 'Enter the ID for the employee:'
        },
        {
            name: 'firstName',
            type: 'input',
            message: 'Enter the first name of the employee:'
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'Enter the last name of the employee:'
        },
        {
            name: 'roleId',
            type: 'list',
            message: 'Select the role for the employee:',
            choices: roles.map(role => ({
                name: role.title,
                value: role.id
            }))
        },
        {
            name: 'managerId',
            type: 'input',
            message: 'Enter the manager ID for the employee (optional):'
        }
    ]);

    const { id, firstName, lastName, roleId, managerId } = employeeData;

    connection.query(
        'INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?, ?)',
        [id, firstName, lastName, roleId, managerId || null],
        (err, result) => {
            if (err) {
                console.error('Error adding employee: ' + err);
                return;
            }
            console.log(`\nEmployee ${firstName} ${lastName} added successfully.`);
            displayMenu = true; // After adding the employee, go back to the main menu
        }
    );
};


// function to update an employee's role

const updateEmployeeRole = async () => {
    const employees = await getEmployees();
    const roles = await getRoles(); 

    const updateData = await inquirer.prompt([
        {
            name: 'employeeId',
            type: 'list',
            message: 'Select the employee you want to update:',
            choices: employees.map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }))
        },
        {
            name: 'roleId',
            type: 'list',
            message: 'Select the new role for the employee:',
            choices: roles.map(role => ({
                name: role.title,
                value: role.id
            }))
        }
    ]);

    const { employeeId, roleId } = updateData;

    connection.query(
        'UPDATE employee SET role_id = ? WHERE id = ?',
        [roleId, employeeId],
        (err, result) => {
            if (err) {
                console.error('Error updating employee role: ' + err);
                return;
            }
            console.log(`\nEmployee role updated successfully.`);
            displayMenu = true; // After updating the employee role, go back to the main menu
        }
    );
};

// function to fetch departments from the database
const getDepartments = () => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM department',
            (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            }
        );
    });
};

// Function to fetch roles from the database
const getRoles = () => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM role',
            (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            }
        );
    });
};

// Function to fetch employees from the database
const getEmployees = () => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM employee',
            (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            }
        );
    });
};

// Function to exit the program
const exit = () => {
    console.log('Goodbye!');
    process.exit(0); // Exit with success status
};


menu();