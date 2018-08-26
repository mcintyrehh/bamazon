DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;
USE bamazonDB;

CREATE TABLE products (
	item_id int AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100),
    department int,
    price NUMERIC(10, 2),
    stock_quantity int,
    product_sales NUMERIC(10,2),
    primary key (item_id)
);
CREATE TABLE departments (
	dept_id INT AUTO_INCREMENT NOT NULL,
    dept_name VARCHAR(100),
    overhead_costs NUMERIC(10,2),
    primary key (dept_id)
);
INSERT INTO departments (dept_name, overhead_costs)
values ("Electronics", 12000);
INSERT INTO departments (dept_name, overhead_costs)
values ("Outdoors", 8000);
INSERT INTO departments (dept_name, overhead_costs)
values ("Clothing", 15000);
INSERT INTO departments (dept_name, overhead_costs)
values ("Pets", 6000);
insert into products (product_name, department, price, stock_quantity, product_sales)
values ('Gameboy', 1, 49.99, 99, 0);
insert into products (product_name, department, price, stock_quantity, product_sales)
values ('Versace Sleeping Bag', 2, 549.99, 3, 0);
insert into products (product_name, department, price, stock_quantity, product_sales)
values ('Gucci Flip Flops', 3, 149.99, 20, 0);
insert into products (product_name, department, price, stock_quantity, product_sales)
values ('Microwave', 1, 99.99, 30, 0);
insert into products (product_name, department, price, stock_quantity, product_sales)
values ('Fedora', 3, 29.99, 200, 0);
insert into products (product_name, department, price, stock_quantity, product_sales)
values ('Dog Bed', 4, 89.99, 80, 0);
insert into products (product_name, department, price, stock_quantity, product_sales)
values ('Tent', 2, 249.99, 10, 0);
insert into products (product_name, department, price, stock_quantity, product_sales)
values ('Hammock', 2, 79.99, 120, 0);
insert into products (product_name, department, price, stock_quantity, product_sales)
values ('Tacticile Turtleneck', 3, 179.99, 25, 0);
insert into products (product_name, department, price, stock_quantity, product_sales)
values ('Frog Toy', 4, 15.99, 10, 0);
insert into products (product_name, department, price, stock_quantity, product_sales)
values ('Bully Stick', 4, 9.99, 99, 0);
select * from products;
select * from departments;
SELECT departments.dept_id, departments.dept_name, departments.overhead_costs, SUM(products.product_sales) AS total_sales, (SUM(products.product_sales) - departments.overhead_costs) AS total_profit FROM departments INNER JOIN products ON (departments.dept_id=products.department) GROUP BY departments.dept_id;

