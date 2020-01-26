USE cms;

INSERT into department (name) VALUES ("Sales");
INSERT into department (name) VALUES ("R&D");
INSERT into department (name) VALUES ("Accounting");
INSERT into department (name) VALUES ("HR");

INSERT into role (title, salary, department_id) VALUES ("Sales Manager", 1000000, 1);
INSERT into role (title, salary, department_id) VALUES ("Sales person", 50000, 1);

INSERT into role (title, salary, department_id) VALUES ("Researcher", 300000, 2);
INSERT into role (title, salary, department_id) VALUES ("Developer", 700000, 2);

INSERT into role (title, salary, department_id) VALUES ("Accountant", 200000, 3);
INSERT into role (title, salary, department_id) VALUES ("Intern", 30000, 3);

INSERT into role (title, salary, department_id) VALUES ("Counselor", 80000, 4);


INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Yoda", "Minch", 1, null);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Obiwan", "Kenobi", 2, 1);

INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Han", "Solo", 3, 1);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Padme", "Amidala", 4, 1);

INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Lando", "Calrissian", 5, null);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Kylo", "ren", 6, 2);

INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Darth", "Vader", 7, null);
