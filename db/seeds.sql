-- Populate department table
INSERT INTO department (id, department_name) VALUES
(1, 'Sales'),
(2, 'Marketing'),
(3, 'Human Resources'),
(4, 'Finance'),
(5, 'Engineering'),
(6, 'Customer Service'),
(7, 'Research and Development'),
(8, 'Operations'),
(9, 'IT'),
(10, 'Administration');

-- Populate role table
INSERT INTO role (id, title, salary, department_id) VALUES
(1, 'Sales Manager', 70000, 1),
(2, 'Marketing Coordinator', 55000, 2),
(3, 'HR Specialist', 60000, 3),
(4, 'Financial Analyst', 65000, 4),
(5, 'Software Engineer', 80000, 5),
(6, 'CSR', 45000, 6),
(7, 'Research Scientist', 75000, 7),
(8, 'Operations Manager', 70000, 8),
(9, 'IT Administrator', 65000, 9),
(10, 'Administrative Assistant', 50000, 10);

-- Populate employee table
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES
(1, 'John', 'Doe', 1, NULL),
(2, 'Jane', 'Smith', 2, 1),
(3, 'Michael', 'Johnson', 3, 1),
(4, 'Emily', 'Brown', 4, 3),
(5, 'David', 'Wilson', 5, NULL),
(6, 'Sarah', 'Taylor', 6, 5),
(7, 'Daniel', 'Anderson', 7, NULL),
(8, 'Olivia', 'Martinez', 8, 7),
(9, 'Matthew', 'Thomas', 9, NULL),
(10, 'Sophia', 'Roberts', 10, 9);