const { promptUser } = require('../server');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'senha',
    database: 'employee_tracker'
});


// View department
const viewDep = () => {
    connection.query(
        `SELECT * FROM department`,
        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }

            console.table(results);
            promptUser();
        }
    )
}

const addDep = () => {
    inquirer
        .prompt({
            type: 'text',
            name: 'dep_name',
            message: 'Please enter the name of the department you would like to add: '
        })
        .then((data) => {
            connection.query(
                `INSERT INTO department (name)
                VALUES(?)`,
                [data.dep_name],
                function (err, results, fields) {
                    if (err) {
                        console.log(err.message);
                        return;
                    }

                    console.log('Added department!');
                    promptUser();
                }
            )
        })
}

const deleteDepartment = () => {
    const departments = [];
    connection.query(
        "SELECT * FROM DEPARTMENT",
        function (err, res) {
            if (err) {
                console.log(err.message);
                return;
            }
  
            res.forEach(dep => {
                let qObj = {
                name: dep.name,
                value: dep.id
            }
            departments.push(qObj);
            });
  
            let questions = [
                {
                    type: "list",
                    name: "id",
                    choices: departments,
                    message: "which department do u want to delete?"
                }
            ];
  
            inquirer
                .prompt(questions)

                .then(data => {
                    const query = `DELETE FROM DEPARTMENT WHERE id = ?`;
                    connection.query(query, [data.id], (err, res) => {
                        if (err) {
                            console.log(err.message);
                            return;
                        }
                        console.log('The employee entered has been deleted successfully from the database.');
                        promptUser();
                    });
                })
        }
    );
};
    
module.exports = { viewDep, addDep, deleteDepartment }