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
    managerView();
})

function managerView() {
    inquirer.prompt([
        {
            message: "Manager options:",
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit \n"],
            name: "task"

        }
    ]).then(function (answer) {
        var task = answer.task;
        switch (task) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLow();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
            case "Exit \n":
                exit();
                break;
        }

    })
};
function viewProducts() {
    //left join to pull dept name from dept id
    connection.query("SELECT * FROM products LEFT JOIN departments on products.department = departments.dept_id GROUP BY item_id", function (err, data) {
        if (err) throw err;
        //using easy-table to display the joined data
        var t = new Table;
        data.forEach(function (product) {
            t.cell('Item ID', product.item_id)
            t.cell('Product Name', product.product_name)
            t.cell('Department', product.dept_name)
            t.cell('Price, USD', product.price, Table.number(2))
            t.cell('Quantity', product.stock_quantity)
            t.newRow()
        })
        console.log(t.toString())
        managerView();
    })
}
function viewLow() {
    connection.query("SELECT * FROM products LEFT JOIN departments on products.department = departments.dept_id WHERE products.stock_quantity <5", function (err, data) {
        if (err) throw err;
        //using easy-table to display the joined data
        var t = new Table;
        data.forEach(function (product) {
            t.cell('Item ID', product.item_id)
            t.cell('Product Name', product.product_name)
            t.cell('Department', product.dept_name)
            t.cell('Price, USD', product.price, Table.number(2))
            t.cell('Quantity', product.stock_quantity)
            t.newRow()
        })
        console.log(t.toString())
        managerView();
    })

}
function addInventory() {
    //left join to pull dept name from dept id
    connection.query("SELECT * FROM products LEFT JOIN departments on products.department = departments.dept_id GROUP BY item_id", function (err, data) {
        if (err) throw err;
        //using easy-table to display the joined data
        var t = new Table;
        data.forEach(function (product) {
            t.cell('Item ID', product.item_id)
            t.cell('Product Name', product.product_name)
            t.cell('Department', product.dept_name)
            t.cell('Price, USD', product.price, Table.number(2))
            t.cell('Quantity', product.stock_quantity)
            t.newRow()
        })
        console.log("\n" + t.toString())
        //inquirer prompts to set user actions
        inquirer.prompt([
            {
                message: "Please enter the ID of the product you would like to restock",
                type: "input",
                name: "product"
            },
            {
                message: "How many would you like to add?",
                type: "input",
                name: "number"
            }

        ]).then(function (answer) {
            //database is 1 indexed, and array 0 indexed, setting product to the JSON object pulled from our SQL db
            var product = data[(answer.product - 1)];
            var num = parseInt(answer.number);
            //sets stock quantity to current + amt added
            var newNum = parseInt((product.stock_quantity + num));
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: newNum
                    },
                    {
                        item_id: product.item_id
                    }
                ],
                //logs success/failure and the total for the transaction (num desired*price of prod)
                function (error) {
                    if (error) throw error;
                    var stock = product.stock_quantity;
                    console.log("Restock successful!");
                    viewProducts();
                    managerView();
                }
            )

        })
    })
}
function addNewProduct() {
    //empty array to dynamically populate current departments
    var deptChoices = [];
    //selects all departments, pushes the id and name for each into the array
    connection.query("SELECT * FROM departments", function (err, data) {
        if (err) throw err;
        for (i = 0; i < data.length; i++) {
            deptChoices.push(data[i].dept_id + " - " + data[i].dept_name)
        }
    })
    inquirer.prompt([
        {
            message: "What product would you like to add?",
            type: "input",
            name: "product"
        },
        {
            message: "What department does it belong in?",
            type: "list",
            //inquirer choices accept arrays, using the one created above
            choices: deptChoices,
            name: "dept"
        },
        {
            message: "Retail price of product?",
            type: "input",
            name: "price"
        },
        {
            message: "How many to add?",
            type: "input",
            name: "count"
        }
    ]).then(function (answer) {
        var newProduct = answer.product;
        console.log(newProduct);
        //sets dept equal to the first index of the string chosen from our array 'deptChoices
        //since the array is created as "dept_id + ..." this will always be our id
        var dept = parseInt(answer.dept[0]);
        var price = parseFloat(answer.price);
        var quant = parseInt(answer.count);
        connection.query(
            "INSERT INTO products (product_name, department, price, stock_quantity, product_sales) VALUES(?,?,?,?,0.00)",
            [
                newProduct,
                dept,
                price,
                quant
            ],
            function (err) {
               if (err) throw err;
               viewProducts();
            })
    })
}
function exit() {
    connection.end();
}