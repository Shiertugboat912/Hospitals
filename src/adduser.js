var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
var mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

var data = process.env.DATA;

function createConn() {
  // create a connection
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "minifinal",
    database: "hospitals",
    port: 3308
  });
}

bcrypt.genSalt(10, function(err, salt) {
  bcrypt.hash(data, salt, function(err, hash) {
    if (err) throw err;
    console.log(hash);
    const conn = createConn();

    conn.query("select * from hospitals", (err, rows) => {
      console.log(rows[0].Password);
    });

    const statement =
      "update hospitals set password = ? where Name = 'First hospital'";
    try {
      conn.query(statement, [hash], (err, rows) => {
        if (err) throw err;
        return;
        console.log("success");
        console.log(hash);
        console.log(hash.length);
      });
    } catch {
      console.log("caught");
    }
  });
});

/*
bcrypt.compare(data, hash, function(err, res) {
    if(err)
        throw err
    console.log(hash)
});
// As of bcryptjs 2.4.0, compare returns a promise if callback is omitted:
bcrypt.compare(data, hash).then((res) => {
    // res === true
});*/
