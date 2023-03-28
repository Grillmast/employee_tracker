const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");
require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "employee_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the employee database");
});

async function runPrompt() {
  let keepPrompting = true;
  while (keepPrompting) {
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Exit",
        ],
      },
    ]);

    switch (answer.action) {
      case "Add a department":
        const departmentAnswer = await inquirer.prompt([
          {
            type: "input",
            name: "name",
            message: "What is the name of the new department?",
            validate: (input) => {
              if (input.trim() === "") {
                return "Please enter a valid department name";
              }
              return true;
            },
          },
        ]);
        const name = departmentAnswer.name;
        addDepartment(name);
        break;

        function addDepartment(name) {
          db.query(`INSERT INTO department (name) VALUES (?)`,
          name, 
          (err, res) => {
            if (err) throw err;
            console.log(`Added department ${name} to the database.`);
            db.query(`SELECT * FROM department`, (err, res) => {
              console.log("Displaying departments");
              console.log(res);
            })
          })
        };

      case "View all departments":
        db.query(`SELECT * FROM department`, (err, res) => {
          if (err) throw err;
          console.log("Displaying departments");
          console.table(res);
        });
        break;

      case "View all roles":
        db.query(`SELECT * FROM role`, (err, res) => {
          if (err) throw err;
          console.log("Should show roles");
          console.table(res);
        });
        break;

      case "View all employees":
        db.query(`SELECT * FROM employee`, (err, res) => {
          if (err) throw err;
          console.log("Showing employees")
          console.table(res);
        });
        break;

      case "Add a role":
        const roleAnswer = await inquirer.prompt([
          {
            type: "input",
            name: "title",
            message: "What is the title of the new role?",
            validate: (input) => {
              if (input.trim() === "") {
                return "Please enter a valid role title.";
              }
              return true;
            },
          },
          {
            type: "input",
            name: "salary",
            message: "What is the salary for the new role?",
            validate: (input) => {
              if (isNaN(input) || parseInt(input) <= 0) {
                return "Please enter a valid salary.";
              }
              return true;
            },
          },
          {
            type: "input",
            name: "departmentId",
            message: "What is the ID of the department for the new role?",
            validate: (input) => {
              if (isNaN(input) || parseInt(input) <= 0) {
                return "Please enter a valid department ID.";
              }
              return true;
            },
          },
        ]);
        const { title, salary, departmentId } = roleAnswer;
        addRole(title, salary, departmentId);
        break;

        function addRole(title, salary, departmentId) {
          db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
          [title, salary, departmentId],
          (err, res) => {
            if (err) throw err;
            console.log(`Added role ${title} to the database.`);
            db.query(`SELECT * FROM role`, (err, res) => {
              if (err) throw err;
              console.log("Displaying roles");
              console.log(res);
            })
          })
        }

        case "Add an employee":
          const employeeAnswer = await inquirer.prompt([
            {
              type: "input",
              name: "firstName",
              message: "What is the employee's first name?",
              validate: (input) => {
                if (input.trim() === "") {
                  return "Please enter a valid first name";
                }
                return true;
              },
            },
            {
              type: "input",
              name: "lastName",
              message: "What is the employee's last name?",
              validate: (input) => {
                if (input.trim() === "") {
                  return "Please enter a valid last name";
                }
                return true;
              },
            },
            {
              type: "input",
              name: "roleId",
              message: "What is the ID of the employee's role?",
              validate: (input) => {
                if (isNaN(input) || parseInt(input) <= 0) {
                  return "Please enter a valid role ID";
                }
                return true;
              },
            },
          ]);
          const { firstName, lastName, roleId } = employeeAnswer;
          addEmployee(firstName, lastName, roleId);
          break;
        
          function addEmployee(firstName, lastName, roleId) {
            db.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)`,
            [firstName, lastName, roleId],
            (err, res) => {
              if (err) throw err;
              console.log(`Added employee ${firstName} ${lastName} to the database.`);
              db.query(`SELECT * FROM employee`, (err, res) => {
                if (err) throw err;
                console.log("Displaying Employees");
                console.log(res);
              })
            })
          }

          case "Update an employee role":
            const updateEmployee = await inquirer.prompt([
              {
                type: "input",
                name: "employeeId",
                message: "What is the ID of the employee you want to update?",
                validate: (input) => {
                  if (isNaN(input) || parseInt(input) <= 0) {
                    return "Please enter a valid role ID";
                  }
                  return true;
                },
              },
              {
                type: "input",
                name: "newRoleId",
                message: "What is the new role ID for the employee?",
                validate: (input) => {
                  if (isNaN(input) || parseInt(input) <= 0) {
                    return "Please enter a valid role ID";
                  }
                  return true;
                },
              },
            ])
            .then((updateEmployee) => {
              const { employeeId, newRoleId } = updateEmployee;
              db.query(
                "UPDATE employee SET role_id = ? WHERE id = ?",
                [newRoleId, employeeId],
                (err, res) => {
                  console.log(`Employee with ID ${employeeId} role updated successfully`);
                }
              );
            });
            break;
          default:
            console.log("Invalid action. Please try again");
            break;
      };
    };
};

runPrompt()
