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


//Constant to list all departments
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

//Constant to enter new departments
const addDep = () => {
    inquirer
        .prompt({
            type: 'text',
            name: 'dep_name',
            message: 'Please, enter the name of the department you would like to add: '
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
                    console.log();
                    console.log('The new department entered has been added successfully to the database!');
                    console.log();

                    promptUser();
                }
            )
        })
}

//Constant to delete departments
const deleteDepartment = () => {
    const departments = [];
    connection.query(
        "SELECT * FROM department",
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
                    message: "Which department do you want to delete?"
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

                        console.log();
                        console.log('The department selected has been deleted successfully from the database.');
                        console.log();

                        promptUser();
                    });
                })
        }
    );
};
    
module.exports = { viewDep, addDep, deleteDepartment }