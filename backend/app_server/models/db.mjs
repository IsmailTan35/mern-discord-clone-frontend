import mysql  from 'mysql'

const database = (con) => {

    con.connect((err) =>{
      if(err) {
        console.error("Could not connect to mysql.",err)
        con.end()
        setTimeout(database, 5000)
      }
      else{
        console.info("Mysql connection successfull.")
        con.connect((err) =>{
            con.query("CREATE DATABASE wooztracker", (err, result) =>{
              if(err ) {
                console.error(err.sqlMessage)
              }
              else{
                console.info("Database created")
              }      
            });

            con.changeUser({database : 'wooztracker'}, function(err) { 
              if (err) throw err; 
            });
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

export default con