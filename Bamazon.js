// mySQL database entries

// CREATE TABLE Products(
// ItemID int AUTO_INCREMENT,
// ProductName varchar(30) NOT NULL,
// DepartmentName varchar(30) NOT NULL,
// Price int NOT NULL,
// StockQuantity int NOT NULL,
// PRIMARY KEY (ItemID)
// );

//INSERT INTO Products(ProductName, DepartmentName, Price, StockQuantity) VALUES('Playstation 4', 'Games', 149.00, 500), ('Xbox One', 'Games', 199.00,600), ('Wii U', 'Videogames', 199.00, 15), ('Nonstick Frying Pan', 'Kitchen', 25.45, 45), ('Kindle', 'Digital Books', 49.99, 499), ('Kindle Oasis', 'Digital Books', 189.99, 500), ('Amazon Echo', 'Home Automation Controller', 179.99, 500), ('Macbook Pro', 'Computer', 199.99, 20), ('Playstation Vita', 'Games', 59.99, 1100), ('New Nintendo 3DS', 'Games', 65.00, 135);


var mysql = require("mysql");
var prompt = require("prompt");

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Bamazon'
});



var execute = function() {

    connection.query("SELECT * FROM Products", function(err, result) {
        return (itemTable(result));

    });

    setTimeout(function() {
        prompt.get(['ItemID', 'Quantity'], function(err, result) {
            var shopperItem = result.ItemID;
            var shopperQuantity = result.Quantity;

            inventoryCheck(shopperItem, shopperQuantity);
            setTimeout(function() {
                execute();
            }, 3500);

        });
    }, );
}


var inventoryCheck = function(id, quantity) {
    connection.query('SELECT * FROM Products WHERE ItemID = ' + id, function(err, result) {
        if (err) throw err;
        var total = result[0].Price * quantity;
        var inventory = result[0].StockQuantity - quantity;
        if (inventory < 0) {
            console.log('Insufficient stock. There are only ' + result[0].StockQuantity + 'item(s) left.');
        } else {
            console.log('User has bought ' + quantity + ' ' + result[0].ProductName + ' for $' + total);
            console.log('There are ' + inventory + ' ' + result[0].ProductName + ' remaining.')
            databaseUpdate(id, inventory)
        }
    });
}

var databaseUpdate = function(id, quantity) {
    connection.query('update products set StockQuantity = ' + quantity + ' where ItemID = ' + id, function(err, result) {
        if (err) throw err;
    });
}

function itemTable(items) {
    for (var i = 0; i < items.length; i++) {
        console.log('------------------------');
        console.log('ItemID: ' + items[i].ItemID);
        console.log('Item: ' + items[i].ProductName);
        console.log('Department: ' + items[i].DepartmentName);
        console.log('Price: $' + items[i].Price);
    }
    console.log('------------------------');
}

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err);
        return;
    }
});

execute();
