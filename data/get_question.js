const mysql = require("mysql2");

const config = require("../config");

let connection = mysql.createConnection(config.db);

connection.connect(function(err){
    if(err){
        console.log(err);
    }
    else {
        console.log("baglanti basarili");
    }
});

module.exports = connection.promise();