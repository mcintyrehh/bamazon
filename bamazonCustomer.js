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
    printTable();
})

function printTable() {
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
        //inquirer prompts to set user actions
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
            //database is 1 indexed, and array 0 indexed, setting product to the JSON object pulled from our SQL db
            var product = data[(answer.product - 1)];
            var num = answer.number;
            //if stock lvls are insufficient, displays message and reprompts
            if (num > product.stock_quantity) {
                console.log(
                    `You want to buy ${num} ${product.product_name}s but we only have ${product.stock_quantity}`);
                printTable();
            }
            else {
                //if there is enough stock, subtract the amount desired from total amount and update the database with the new total
                var newNum = parseInt((product.stock_quantity - num));
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
                        var total = (num * product.price);
                        console.log("Purchase successful!");
                        console.log(`The total of your purchase is: $${total}.`)
                        printTable();
                    }
                );
                var prodSales = product.product_sales;
                prodSales += (num * product.price);
                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            product_sales: prodSales
                        },
                        {
                            item_id: product.item_id
                        }
                    ],function(err) {
                        if(err) throw err;
                    })
            }
        })
    })
    // connection.end()

}