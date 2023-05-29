const inquirer = require('inquirer');

// Inital Prompt - Main Menu
const promptUser = () => {
    inquirer

        // Prompt the user
        .prompt({
            type: 'list',
            name: 'begin choices',
            message: 'What would you like to do? (Select on of the following)',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'View Employees by department', 'Delete departments', 'Delete Roles', 'Delete Employees', 'View totalized budget']
        })
        // Take the data and use switch statements to decide what to do per option
        .then((data) => {
            switch (data['begin choices']) {
                case 'View All Departments':
                    viewDep();
                    break;
                case 'View All Roles':
                    viewRole();
                    break; 
                case 'View All Employees':
                    viewAllEmp();
                    break;
                case 'Add a Department':
                    addDep();
                    break;
                case 'Add a Role':
                    addRole();
                    break;
                case 'Add an Employee':
                    addEmp();
                    break;
                case 'Update an Employee Role':
                    upEmp();
                    break;    
                case 'View Employees by department':
                    viewEmpByDep();
                    break;
                case 'Delete departments':
                    deleteDepartment();
                    break;
                case 'Delete Roles':
                    deleteRole();
                    break;
                case 'Delete Employees':
                    deleteEmployee();
                    break;
                case 'View totalized budget':
                    addTotalByDep();
                    break;           
            }
        })
};

// You must export your module before you require module for circular page being required
module.exports = { promptUser }
const { viewAllEmp, addEmp, viewEmpByDep, upEmp, deleteEmployee } = require('./lib/employee');
const { viewDep, addDep, deleteDepartment } = require('./lib/department');
const { viewRole, addRole,deleteRole } = require('./lib/role');
const { addTotalByDep } = require('./lib/budget');

promptUser()