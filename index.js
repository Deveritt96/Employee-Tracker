const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Jimin199',
    database: 'employees_db',
});

// Function to display the welcome message and prompt user to continue or exit
const welcomeMessage = () => {
    inquirer.prompt({
        name: 'continue',
        type: 'confirm',
        message: 'Welcome! Do you want to continue to the menu?',
        default: true
    }).then(answer => {
        if (answer.continue) {
            menu(); // If the user chooses to continue, show the menu
        } else {
            exit(); // If the user chooses to exit, end the program
        }
    });
};

const menu = () => {
    inquirer.prompt({
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
    }).then(answers => {
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
            action().then(() => {
                menu(); // After the action is complete, prompt the user again
            });
        } else {
            console.log('Invalid choice');
            menu(); // Restart the menu if choice is invalid
        }
    });
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
            menu();
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
            menu();
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
            menu();
        }
    )
};

// function to add department

const addDepartment = async () => {
    const departmentData = await inquirer.prompt({
        name: 'departmentName',
        type: 'input',
        message: 'Enter the name of the department:'
    });

    const { departmentName } = departmentData;

    connection.query(
        'INSERT INTO department (department_name) VALUES (?)',
        [departmentName],
        (err, result) => {
            if (err) {
                console.error('Error adding department: ' + err);
                return;
            }
            console.log(`\nDepartment ${departmentName} added successfully.`);
            menu(); // After adding the department, go back to the main menu
        }
    );
};

// function to add role

const addRole = async () => {
    const departments = await getDepartments(); // Assume you have a function to fetch departments

    const roleData = await inquirer.prompt([
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

    const { title, salary, departmentId } = roleData;

    connection.query(
        'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
        [title, salary, departmentId],
        (err, result) => {
            if (err) {
                console.error('Error adding role: ' + err);
                return;
            }
            console.log(`\nRole ${title} added successfully.`);
            menu();
        }
    );
};

// function to add employee

const addEmployee = async () => {
    const roles = await getRoles(); // Assume you have a function to fetch roles

    const employeeData = await inquirer.prompt([
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

    const { firstName, lastName, roleId, managerId } = employeeData;

    connection.query(
        'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
        [firstName, lastName, roleId, managerId || null],
        (err, result) => {
            if (err) {
                console.error('Error adding employee: ' + err);
                return;
            }
            console.log(`\nEmployee ${firstName} ${lastName} added successfully.`);
            menu(); // After adding the employee, go back to the main menu
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
            menu(); // After updating the employee role, go back to the main menu
        }
    );
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

// Function to exit the program
const exit = () => {
    console.log('Goodbye!');
    process.exit(0); // Exit with success status
};


welcomeMessage();