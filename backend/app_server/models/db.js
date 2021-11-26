const mysql = require('mysql');

const database = (con) => {

    con.connect(function(err) {
      if(err) {
        console.log("Could not connect to mysql.",err)
        con.end()
        setTimeout(database, 5000)
      }
      else{
        console.log("Mysql connection successfull.")
        con.connect(function(err) {
            con.query("CREATE DATABASE wooztracker", function (err, result) {
              if(err ) {
                console.log(err.sqlMessage)
              }
              else{
                console.log("Database created")
              }      
            });

            con.changeUser({database : 'wooztracker'}, function(err) { 
              if (err) throw err; 
            });

            // con.query("CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))", function (err, result) {
            //   err ? console.log(err.sqlMessage):console.log("Created table.")
            // })
        })
      }
    })
   
  }

const con = mysql.createConnection({
    url: "192.168.0.24",
    user: "root",
    password: "",
    waitForConnections: true,
})

database(con)

module.exports = con