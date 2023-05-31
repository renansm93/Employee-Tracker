INSERT INTO department (name)
VALUES
  ('Human Rerources'),
  ('Marketing'),
  ('Engineering'),
  ('Sales'),
  ('Finance'),
  ('Legal');
  
INSERT INTO role (title, salary, department_id)
VALUES
  ('HR Professional', 7000, 1),
  ('Recruiter', 5000, 1),
  ('Marketing Professional', 7000, 2),
  ('Engineer', 8000, 3),
  ('Software Engineer', 8000, 3),
  ('Lawyer', 8000, 6),
  ('Salesperson', 5000, 4),
  ('Accountant', 6000, 5),
  ('Sales Lead', 9000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Jerry', 'Underwood', 1, null),
  ('Bob', 'Sheldon', 2, 1),
  ('Alex', 'Jackson', 3, null),
  ('Peter', 'Makah', 4, null),
  ('Suzie', 'Alisson', 4, 4),
  ('Pete', 'McFall', 5, 4),
  ('Alexis', 'Caper', 6, null),
  ('Ronald', 'Firbank', 6, 7),
  ('Virginia', 'Woolf', 9, null),
  ('Octavia', 'Butler', 7, 9),
  ('John', 'Doe', 8, 3);
