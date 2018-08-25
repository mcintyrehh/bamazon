var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('easy-table')

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazonDB"
})

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId + "\n");
    printTable();
})

function printTable() {
    connection.query("SELECT * FROM products", function (err, data) {
        if (err) throw err;
        var t = new Table;
        data.forEach(function (product) {
            t.cell('Item ID', product.item_id)
            t.cell('Product Name', product.product_name)
            t.cell('Department', product.department_name)
            t.cell('Price, USD', product.price, Table.number(2))
            t.cell('Quantity', product.stock_quantity)

            t.newRow()
        })
        console.log(t.toString())
        inquirer.prompt([
            {
                message: "Please enter the ID of the product you would like to buy",
                type: "input",
                name: "product"
            },
            {
                message: "How many would you like to buy?",
                type: "input",
                name: "number"
            }

        ]).then(function (answer) {
            var product = data[(answer.product - 1)];
            var num = answer.number;
            if (num > product.stock_quantity) {
                console.log(
                    `You want to buy ${num} ${product.product_name}s but we only have ${product.stock_quantity}`)
            }
            else {
                var newNum = parseInt((product.stock_quantity - num));
                console.log(newNum);
                console.log(product.item_id);
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
                    function (error) {
                        if (error) throw error;
                        var total = (num * product.price);
                        console.log("Purchase successful!");
                        console.log(`The total of your purchase is: $${total}.`)
                        printTable();
                    }
                )
            }
        })
    })
    // connection.end()

}