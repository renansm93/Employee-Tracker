const { promptUser } = require('../server');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'senha',
    database: 'employee_tracker'
});

const viewRole = () => {
    connection.query(
        `SELECT role.id, role.title, role.salary, department.name
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
                        message: 'Please enter the name of the role you would like to add: '
                    },
                    {
                        type: 'number',
                        name: 'salary',
                        message: 'Please enter the salary of this role: '
                    },
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Please select the department you role will be a part of: ',
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

                            console.log('Role added!')
                            promptUser();
                        }
                    );
                });
        }
    );
};


const deleteRole = () => {
    inquirer
        .prompt({
            name: "role_id",
            type: "number",
            message: "Please enter the id of the role you want to delete from the database. Enter ONLY numbers."
        })
        .then(function (response) {
            db.query("DELETE FROM role WHERE id = ?", [response.role_id], function (err, data) {
            if (err) throw err;
            console.log("The role entered has been deleted successfully from the database.");

            db.query(`SELECT * FROM role`, (err, result) => {
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


module.exports = { viewRole, addRole, deleteRole };