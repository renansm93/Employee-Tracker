const { promptUser } = require('../server')
const inquirer = require('inquirer');
const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_tracker'
});

// View all employees
const viewAllEmp = () => {

    // connect to db
    connection.query(
        // Manipulate tables to view all employees
        `SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title, role.salary AS salary,
        department.name AS department,
        CONCAT(manager.first_name, ' ' ,manager.last_name) AS manager 
        FROM employee
        LEFT JOIN role
        ON employee.role_id = role.id
        LEFT JOIN department
        ON role.department_id = department.id
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id
        ORDER By employee.id`,
        // Call back function to decide what to do with data
        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }

            // Show the results as a table to the user
            console.table(results);

            // Re-prompt the user
            promptUser();
        }
    );
};

// View Employees by Department
const viewEmpByDep = () => {

    // Connect to db
    connection.query(
        // Get the table contents from department table
        `SELECT * FROM department`,

        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }
            // Create empty array for storing info
            depArr = [];
            // for each item in the results array, push the name of the department to the department array
            results.forEach(item => {
                depArr.push(item.name)
            });
            inquirer
                .prompt({
                    type: 'list',
                    name: 'filter-emp-dep',
                    message: 'Choose a department to filter from:',
                    // Choices are from the department array, this will allow for the user to add departments in future
                    choices: depArr
                })
                .then((data) => {
                    // Take the data and filter based on what user chose
                    connection.query(
                        `SELECT employee.id, employee.first_name, employee.last_name, department.name AS department 
                            FROM employee
                            LEFT JOIN role
                            ON employee.role_id = role.id
                            LEFT JOIN department
                            ON role.department_id = department.id
                            WHERE department.name = ?`,
                        // Value user chose that will be replaced with question mark, this prevents SQL Injection attacks
                        [data['filter-emp-dep']],
                        function (err, results, fields) {
                            if (err) {
                                console.log(err.message);
                                return;
                            }

                            // Show results as table
                            console.table(results);
                            // Reprompt user
                            promptUser();
                        }
                    )
                });
        }
    );
};


// Add a new employee
const addEmp = () => {

    // Connect to DB
    connection.query(
        // Select all role from table for future ref
        `SELECT * FROM role`,
        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }

            // Create empty array for storing info
            let roleArr = [];

            // for each item in the results array, push the name of the role to the role array
            results.forEach(item => {
                roleArr.push(item.title)
            })
            // Connect to db again 
            connection.query(
                // Select all employees from the employees table for future reference against managers
                `SELECT * FROM employee`,
                function (err, results, fields) {
                    if (err) {
                        console.log(err.message);
                        return;
                    }

                    // Create empty array for employees
                    let empArr = [];

                    // For each item in results array, push the id
                    results.forEach(item => {
                        empArr.push(item.id)
                    });

                    // Prompt the user
                    inquirer
                        .prompt([
                            {
                                type: 'text',
                                name: 'first_name',
                                message: 'Please, enter the first name of the employee you want to add to the database.'
                            },
                            {
                                type: 'text',
                                name: 'last_name',
                                message: 'Please, enter the last name of the employee you want to add to the database.'
                            },
                            {
                                type: 'list',
                                name: 'role_pick',
                                message: 'Please, select the role associated with the employee you want to add to the database',
                                // use the names from the role array to get the role, this will allow us to add new role in the future
                                choices: roleArr
                            },
                            {
                                type: 'number',
                                name: 'mngt_pick',
                                message: 'Please enter the manager id, associated with the employee you want to add to the database. Enter ONLY numbers.',
                            }
                        ])
                        .then((data) => {
                            // Create a loop of the role arr in order to compare the users answer to the position it is in the array,
                            // this will provide us with a number that can be used as an id for the role_id section of our table
                            let role_id;
                            for (i = 0; i < roleArr.length; i++) {
                                if (data.role_pick === roleArr[i]) {
                                    role_id = i + 1
                                }
                            }

                            let manager_id = null;
                            // if the mngt_pick prompt was not run and returns nothing set the manager_id to null
                            for (i = 0; i < empArr.length; i++) {
                                if (data.mngt_pick === empArr[i]) {
                                    manager_id = data.mngt_pick
                                }
                            }
                            // Connect to db again
                            connection.query(
                                // Insert values from user into db, uses place holders to prevent SQL Injection attack
                                `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES (?, ?, ?, ?)`,
                                [data.first_name, data.last_name, role_id, manager_id],
                                function (err, results, fields) {
                                    if (err) {
                                        console.log(err.message);
                                        return;
                                    }
                                    console.log('Employee succesfully added!');
                                    // Reset to main screen
                                    promptUser();
                                }
                            );
                        });
                }
            );
        }
    );
};

const upEmp = () => {
    // Select all role from table for future ref
    connection.query(
        `SELECT * FROM role`,
        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }

            // Create empty array for storing info
            let roleArr = [];

            // for each item in the results array, push the name of the role to the role array
            results.forEach(item => {
                roleArr.push(item.title)
            })
            connection.query(
                `SELECT first_name, last_name FROM employee`,
                function (err, results, fields) {
                    if (err) {
                        console.log(err.message);
                    }

                    let nameArr = [];
                    results.forEach(item => {
                        nameArr.push(item.first_name);
                        nameArr.push(item.last_name);
                    })
                    let combinedNameArr = [];
                    for (let i = 0; i < nameArr.length; i += 2) {
                        if (!nameArr[i + 1])
                            break
                        combinedNameArr.push(`${nameArr[i]} ${nameArr[i + 1]}`)
                    }
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'name_select',
                                message: 'Please select an employee you would like to update',
                                choices: combinedNameArr
                            },
                            {
                                type: 'list',
                                name: 'role_select',
                                message: 'Please select a role you would like your employee to change to:',
                                choices: roleArr
                            }
                        ])
                        .then((data) => {
                            let role_id;
                            for (let i = 0; i < roleArr.length; i++) {
                                if (data.role_select === roleArr[i]) {
                                    role_id = i + 1;
                                }
                            };
                            let selectedNameArr = data.name_select.split(" ");
                            let last_name = selectedNameArr.pop();
                            let first_name = selectedNameArr[0];

                            connection.query(
                                `UPDATE employee 
                                        SET role_id = ?
                                        WHERE first_name = ? AND last_name = ?`,
                                [role_id, first_name, last_name],
                                function (err, results, fields) {
                                    if (err) {
                                        console.log(err.message);
                                        return;
                                    }
                                    console.log('Employee updated!');
                                    promptUser();
                                }
                            );
                        });
                }
            );

        }
    );
};

const deleteEmployee = () => {
    inquirer.prompt([
        {
            name: "employee_id",
            type: "number",
            message: "Please enter the id of the employee you want to delete from the database. Enter ONLY numbers."
        }
    ]).then(function (response) {
        db.query("DELETE FROM employee WHERE id = ?", [response.employee_id], function (err, data) {
            if (err) throw err;
            console.log("The employee entered has been deleted successfully from the database.");

            db.query(`SELECT * FROM employee`, (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message })
                    startPrompt();
                }
                console.table(result);
                startPrompt();
            });
        })
});
};

module.exports = { viewAllEmp, viewEmpByDep, addEmp, upEmp, deleteEmployee };
