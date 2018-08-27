# bamazon

# About: 
bamazon is a proof of concept Node.js command line warehouse/inventory app using MySQL, Inquirer, and Easy-Table npm packages

bamazon breaks down into 3 views:
 * bamazonCustomer.js
 * bamazonManager.js
 * bamazonSupervisor.js
 
 To use: 
  - Download
  - Type "npm i" in your command line
     - *this will install the dependencies - MySQL, Easy-Table, and Inquirer npm packages*
     
```javascript
  var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazonDB"
  })
```
 - Create a MySQL server with the above credentials or edit to match your own
 - run the SQL code in app.sql (I ran it in MySQL workbench)
 - `node bamazonCustomer.js` to run the views!
 # bamazonCustomer.js
 
 `node bamazonCustomer.js` 
 The customer view displays all of the products, their departments, prices and quantity
 
 Enter the item number of what you want to buy, and how many you're purchasing and the app will update the stock quantity, and tell you your total.
 
Behind the scenes this is updating the 'Product Sales' column in a department SQL table, for use in upper level views

![alt-text](https://github.com/mcintyrehh/bamazon/blob/master/demo_gifs/bamazoncCustomer.gif)

# bamazonManager.js

`node bamazonManager.js`
The manager view allows you to:
  * View Products for Sale
    * *Same as in customer view*
  * View Low Inventory
    * Shows any item with <5 in stock
    ![alt-text](https://github.com/mcintyrehh/bamazon/blob/master/demo_gifs/bamazonManager-lowinv.gif)
  * Add to Inventory
    * Displays everything, has you pick an item and quantity to restock
    ![alt-text](https://github.com/mcintyrehh/bamazon/blob/master/demo_gifs/bamazonManager-addinv.gif)
  * Add New Product
    * Requests: Product name, Appropriate Department, Retail Price, and # to Stock
    ![alt-text](https://github.com/mcintyrehh/bamazon/blob/master/demo_gifs/bamazonManager-addprod.gif)
  
  # bamazonSupervisor.js
  `node bamazonSupervisor.js`
  
  This allows the highest level of function, the supervisor can:  
  * View Sales by Department
    * The first four columns are the result of a sql join of two tables, the "Total Profit (USD)" column is created on the fly from (Overhead Costs - Product Sales (USD))
    ![alt-text](https://github.com/mcintyrehh/bamazon/blob/master/demo_gifs/bamazonSupervisor-viewsalesdept.gif)
  * Create New Department
    * Add a whole new department by inputting the name, and Overhead Cost of the dept
    * Once you add an item to the department under the manager options, departmental sales numbers will be available
    ![alt-text](https://github.com/mcintyrehh/bamazon/blob/master/demo_gifs/bamazonSupervisor-createdept.gif)
    
 
