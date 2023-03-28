INSERT INTO department (id, name)
VALUES (1, 'Sales'),
       (2, 'Marketing'),
       (3, 'Engineering'),
       (4, 'Accounting');

INSERT INTO role (id, title, salary, department_id)
VALUES (1, 'Salesperson', 50000, 1),
       (2, 'Sales Manager', 70000, 1),
       (3, 'Marketing coordinator', 40000, 2),
       (4, 'Marketing Manager', 60000, 2),
       (5, 'Software Engineer', 80000, 3), 
       (6, 'Senior Software Engineer', 120000, 3), 
       (7, 'Junior Accountant', 65000, 4),
       (8, 'Senior Accountant', 85000, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, 'John', 'Doe', 1, NULL),
       (2, 'Jane', 'Doe', 2, 1),
       (3, 'Trey', 'Turner', 3, NULL),
       (4, 'Joe', 'Williams', 4, 3),
       (5, 'Maddie', 'Hultz', 5, NULL),
       (6, 'Natalie', 'Shepherd', 6, 5),
       (7, 'Jenny', 'Bradford', 7, NULL),
       (8, 'Nick', 'Sanders', 8, 7);