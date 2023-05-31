const { promptUser } = require('../server')
const inquirer = require('inquirer');
const mysql = require('mysql2');

// Connect to the DB
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_tracker'
});

// Constant to list all employees
const viewAllEmp = () => {

    connection.query(
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

// Constant to list Employees by Department
const viewEmpByDep = () => {

    // Connect to db
    connection.query(
        `SELECT * FROM department`,

        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }
            depArr = [];
            results.forEach(item => {
                depArr.push(item.name)
            });
            inquirer
                .prompt({
                    type: 'list',
                    name: 'filter-emp-dep',
                    message: 'Choose a department to filter from:',
                    choices: depArr
                })
                .then((data) => {
                    connection.query(
                        `SELECT employee.id, employee.first_name, employee.last_name, department.name AS department 
                            FROM employee
                            LEFT JOIN role
                            ON employee.role_id = role.id
                            LEFT JOIN department
                            ON role.department_id = department.id
                            WHERE department.name = ?`,
                        [data['filter-emp-dep']],
                        function (err, results, fields) {
                            if (err) {
                                console.log(err.message);
                                return;
                            }

                            console.table(results);
                            promptUser();
                        }
                    )
                });
        }
    );
};


//Constant to enter new emplyees
const addEmp = () => {

    connection.query(
        `SELECT * FROM role`,
        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }

            let roleArr = [];

            results.forEach(item => {
                roleArr.push(item.title)
            })
            connection.query(
                `SELECT * FROM employee`,
                function (err, results, fields) {
                    if (err) {
                        console.log(err.message);
                        return;
                    }

                    let empArr = [];

                    results.forEach(item => {
                        empArr.push(item.id)
                    });

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
                                choices: roleArr
                            },
                            {
                                type: 'number',
                                name: 'mngt_pick',
                                message: 'Please, enter the manager id, associated with the employee you want to add to the database. Enter ONLY numbers.',
                            }
                        ])
                        .then((data) => {
                            let role_id;
                            for (i = 0; i < roleArr.length; i++) {
                                if (data.role_pick === roleArr[i]) {
                                    role_id = i + 1
                                }
                            }

                            let manager_id = null;
                            for (i = 0; i < empArr.length; i++) {
                                if (data.mngt_pick === empArr[i]) {
                                    manager_id = data.mngt_pick
                                }
                            }
                            connection.query(
                                `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES (?, ?, ?, ?)`,
                                [data.first_name, data.last_name, role_id, manager_id],
                                function (err, results, fields) {
                                    if (err) {
                                        console.log(err.message);
                                        return;
                                    }

                                    console.log();
                                    console.log('Employee succesfully added!');
                                    console.log();

                                    promptUser();
                                }
                            );
                        });
                }
            );
        }
    );
};

//Constant to update the employee's role
const upEmp = () => {
    //get all the employee list 
    connection.query("SELECT * FROM EMPLOYEE", (err, emplRes) => {
      if (err) throw err;
      const employeeChoice = [];
      emplRes.forEach(({ first_name, last_name, id }) => {
        employeeChoice.push({
          name: first_name + " " + last_name,
          value: id
        });
      });
      
      //get all the role list to make choice of employee's role
      connection.query("SELECT * FROM ROLE", (err, rolRes) => {
        if (err) throw err;
        const roleChoice = [];
        rolRes.forEach(({ title, id }) => {
          roleChoice.push({
            name: title,
            value: id
            });
          });
       
        let questions = [
          {
            type: "list",
            name: "id",
            choices: employeeChoice,
            message: "Wich employeee do you want to update?"
          },
          {
            type: "list",
            name: "role_id",
            choices: roleChoice,
            message: "what is the employee's new role?"
          }
        ]
    
        inquirer.prompt(questions)
          .then(response => {
            const query = `UPDATE EMPLOYEE SET ? WHERE ?? = ?;`;
            connection.query(query, [
              {role_id: response.role_id},
              "id",
              response.id
            ], (err, res) => {
              if (err) throw err;
              console.log();
              console.log("Employee role has been properly updated!");
              console.log();

              promptUser();
            });
          })
          .catch(err => {
            console.error(err);
          });
        })
    });
  }
  
//Constant to delete employees
const deleteEmployee = () => {
    connection.query(
        "SELECT * FROM employee",
        function (err, res) {
            if (err) {
                console.log(err.message);
                return;
            }
  
            const employeeChoice = [];
            res.forEach(({ first_name, last_name, id }) => {
                employeeChoice.push({
                  name: first_name + " " + last_name,
                  value: id
                });
              });
            
            let questions = [
                {
                    type: "list",
                    name: "id",
                    choices: employeeChoice,
                    message: "Which employee do you want to delete?"
                }
            ];
  
            inquirer
                .prompt(questions)

                .then(data => {
                    const query = `DELETE FROM employee WHERE id = ?`;
                    connection.query(query, [data.id], (err, res) => {
                        if (err) {
                            console.log(err.message);
                            return;
                        }

                        console.log();
                        console.log('The employee selected has been deleted successfully from the database.');
                        console.log();

                        promptUser();
                    });
                })
        }
    );
};
    
module.exports = { viewAllEmp, viewEmpByDep, addEmp, upEmp, deleteEmployee };
