const { promptUser } = require('../server');
const inquirer = require('inquirer');
const mysql = require('mysql2');

// Connect to the DB
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_tracker'
});

// Constant to list all roles
const viewRole = () => {
    connection.query(
        `SELECT role.id, role.title, role.salary, department.name AS department
            FROM role
            LEFT JOIN department
            ON role.department_id = department.id `,
        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }

            console.table(results);
            promptUser();
        }
    );
};

//Constant to enter new roles
const addRole = () => {
    connection.query(
        `SELECT * FROM department`,
        function (err, results, fields) {
            if (err) {
                console.log(err);
                return;
            }

            let depArr = [];
            results.forEach(item => {
                depArr.push(item.name)
            })

            inquirer
                .prompt([
                    {
                        type: 'text',
                        name: 'role_title',
                        message: 'Please, enter the name of the role you would like to add: '
                    },
                    {
                        type: 'number',
                        name: 'salary',
                        message: 'Please, enter the salary of this role: '
                    },
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Please, select the department you role will be a part of: ',
                        choices: depArr
                    }
                ])
                .then((data) => {
                    let department_id;

                    for (let i = 0; i < depArr.length; i++) {
                        if (depArr[i] === data.department) {
                            department_id = i + 1;
                        };
                    };

                    connection.query(
                        `INSERT INTO role (title, salary, department_id)
                            VALUES(?,?,?)`,
                        [data.role_title, data.salary, department_id],
                        function (err, results, fields) {
                            if (err) {
                                console.log(err.message);
                                return;
                            }

                            console.log();
                            console.log('The new role entered has been added successfully to the database!')
                            console.log();


                            promptUser();
                        }
                    );
                });
        }
    );
};

//Constant to delete roles
const deleteRole = () => {
    connection.query(
        "SELECT * FROM role",
        function (err, res) {
            if (err) {
                console.log(err.message);
                return;
            }
  
            const roleChoice = [];
            res.forEach(({ title, id }) => {
              roleChoice.push({
                name: title,
                value: id
              });
            });
          
            let questions = [
                {
                    type: "list",
                    name: "id",
                    choices: roleChoice,
                    message: "Which role do you want to delete?"
                }
            ];
  
            inquirer
                .prompt(questions)

                .then(data => {
                    const query = `DELETE FROM role WHERE id = ?`;
                    connection.query(query, [data.id], (err, res) => {
                        if (err) {
                            console.log(err.message);
                            return;
                        }

                        console.log();
                        console.log('The role entered has been deleted successfully from the database.');
                        console.log();

                        promptUser();
                    });
                })
        }
    );
};


module.exports = { viewRole, addRole, deleteRole };