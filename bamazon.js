var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "1Cerritos",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
    purchase();
});

function start() {
    connection.query('SELECT * FROM products', (function (err, results, fields) {
        if (err) throw err;

        for (var i = 0; i < results.length; i++) {
            console.log(
                'ID:' + results[i].id + '\n\Product:' + results[i].product_name + '\n\Price:' + results[i].price + '\n'
            );
        }
    }));


};

function purchase() {
    connection.query('SELECT * FROM products', (function (err, results, fields) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: 'choice',
                type: 'input',
                message: 'Enter the ID of the item you want to purchase.'
            },
            {
                name: 'qty',
                type: 'input',
                message: 'How many would you like to purchase?'
            }
        ]).then(function (answer) {
            var chosen = answer.choice;
            var total;

            for (var i = 0; i < results.length; i++) {
                if (chosen == results[i].id) {
                    console.log('You have chosen ' + results[i].product_name)

                    if (answer.qty > results[i].stock_quantity) {
                        console.log('Insufficient quantity! Please choose again.');
                        purchase();
                    } else {
                        results[i].stock_quantity = results[i].stock_quantity - answer.qty;
                        
                        total = answer.qty * results[i].price;

                        console.log('Your total is: ' + total)
                        console.log(results[i].stock_quantity)
                    }
                }
            }
        })
    }));
}
