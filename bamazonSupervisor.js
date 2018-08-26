//setting vars for mysql, inquirer and easy-table
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('easy-table')
//setting connection through mySQL, database created in mySQL workbench
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazonDB"
})
//establishing connection, confirming success/failure
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId + "\n");
    supervisorView();
});

function supervisorView() {
    inquirer.prompt([
        {
            message: "Supervisor options:",
            type: "list",
            choices: ["View Product Sales by Department", "Create New Department", "Exit \n"],
            name: "task"

        }
    ]).then(function (answer) {
        var task = answer.task;
        switch (task) {
            case "View Product Sales by Department":
                salesByDept()
                break;
            case "Create New Department":
                createDept()
                break;
            case "Exit \n":
                connection.end();
                break;
        };

    })
}

function salesByDept() {
    connection.query("SELECT departments.dept_id, departments.dept_name, departments.overhead_costs, SUM(products.product_sales) AS prod_sales, (SUM(products.product_sales) - departments.overhead_costs) AS total_profit FROM departments INNER JOIN products ON (departments.dept_id=products.department) GROUP BY departments.dept_id", function (err, data) {
        if (err) throw err;
        //using easy-table to display the joined data
        var t = new Table;
        data.forEach(function (department) {
            t.cell('Department ID', department.dept_id)
            t.cell('Department Name', department.dept_name)
            t.cell('Overhead Costs', department.overhead_costs)
            t.cell('Product Sales (USD)', department.prod_sales, Table.number(2))
            t.cell('Total Profit (USD)', department.total_profit, Table.number(2))
            t.newRow()
        })
        console.log(t.toString())
        supervisorView();
    })
}

function createDept() {
    inquirer.prompt([
        {
            message: "New department name:",
            type: "input",
            name: "dept"
        },
        {
            message: "Overhead cost of the new dept:",
            type: "input",
            name: "overhead"
        }
    ]).then(function (answer) {
        var newDept = answer.dept;
        var overhead = answer.overhead;
        connection.query("INSERT INTO departments (dept_name, overhead_costs) VALUES (?,?)",
            [
                newDept,
                overhead
            ], function (err) {
                if (err) throw err;
                supervisorView();
            })
    })
}