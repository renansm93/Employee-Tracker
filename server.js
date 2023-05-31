const inquirer = require('inquirer');
const cTable = require('console.table');


// Start the prompt
const promptUser = () => {
    inquirer

        .prompt({
            type: 'list',
            name: 'begin choices',
            message: 'What would you like to do? (Select on of the following)',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'View Employees by department', 'View totalized budget', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Delete departments', 'Delete Roles', 'Delete Employees']
        })

        //Lists options for the user to choose from
        .then((data) => {
            switch (data['begin choices']) {
                case 'View All Departments':
                    console.log();
                    viewDep();
                    break;
                case 'View All Roles':
                    console.log();
                    viewRole();
                    break; 
                case 'View All Employees':
                    console.log();
                    viewAllEmp();
                    break;
                case 'View Employees by department':
                    console.log();
                    viewEmpByDep();
                    break;
                case 'View totalized budget':
                    console.log();
                    addTotalByDep();
                    break;           
                case 'Add a Department':
                    console.log();
                    addDep();
                    break;
                case 'Add a Role':
                    console.log();
                    addRole();
                    break;
                case 'Add an Employee':
                    console.log();
                    addEmp();
                    break;
                case 'Update an Employee Role':
                    console.log();
                    upEmp();
                    break;    
                case 'Delete departments':
                    console.log();
                    deleteDepartment();
                    break;
                case 'Delete Roles':
                    console.log();
                    deleteRole();
                    break;
                case 'Delete Employees':
                    console.log();
                    deleteEmployee();
                    break;
            }
        })
};

// Export modules 
module.exports = { promptUser }
const { viewAllEmp, addEmp, viewEmpByDep, upEmp, deleteEmployee } = require('./lib/employee');
const { viewDep, addDep, deleteDepartment } = require('./lib/department');
const { viewRole, addRole,deleteRole } = require('./lib/role');
const { addTotalByDep } = require('./lib/budget');

promptUser()