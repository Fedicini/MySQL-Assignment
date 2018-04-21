var inquirer = require("inquirer");
var mysql = require('mysql');

var connection = mysql.createConnection({
    host:'localhost',
    port:3306,

    user:'root',

    password:"root",
    database: "bamazon",

    socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
});

function readingdata(){
    connection.query("SELECT item_id, product_name, department_name, price FROM products", function(err,data){
        if(err){
            throw err;
        }
        for(var i=0; i<data.length; i++){
                    console.log("\nID: "+data[i].item_id+ " Product: "+data[i].product_name+ " Type: "+ data[i].department_name+ " Price: "+data[i].price);

        }
        
    })
}
function updatedata(id, val){
    connection.query("UPDATE products SET ? WHERE ?",[{stock_quantity: val}, {item_id: id}],function(err,res){
        if(err){
            console.error(err)
        }
        
    })
}

function shop(){
    readingdata()
    inquirer.prompt([
        {
        type: "input",
        message: "type id of preferred item",
        name: "id"
        },
        {
            type: "input",
            message: "how much do you wish to buy?",
            name: "quantity",
            validate: function(value){
                return !isNaN(value);
            }
        }
    ]).then(function(ans){
        connection.query("SELECT price, stock_quantity FROM products WHERE ?", {item_id: parseInt(ans.id) },function(err, res){
            if(err){
                console.error(err);
            }
            
            if(res[0].stock_quantity<parseInt(ans.quantity)){
                console.log("Insufficient Quantity!");
                shop()
            }
            else{
                updatedata(ans.id,res[0].stock_quantity-parseInt(ans.quantity));
                console.log("Total price is: "+ res[0].price*parseInt(ans.quantity))
                shop() 
            }
            
        })
    })
}
shop()
