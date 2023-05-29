INSERT INTO `department` (name)
VALUES ('HR'),
  ('Marketing'),
  ('Engineering'),
  ('Sales');

INSERT INTO `role` (title, salary, department_id)
VALUES 
('Recruiter',5000.00,1),
('Engineer',6000.00,3),
('Salesperson',3000.00,2),
('Software Engineer',7000.00,3);


INSERT INTO `employee`(first_name, last_name, role_id, manager_id) 
VALUES 
('John','Doe',1,null),
('Tom','Jerry',2,1),
('Ronald', 'Firbank', 1, 1),
('Virginia', 'Woolf', 2, null),
('Unica', 'Zurn', 3, 4),
('Tom','Jerry',2,4);
