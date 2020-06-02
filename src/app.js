if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const port = 8000;
const express = require("express");
const app = express();
const favicon = require("express-favicon");
const bodyparser = require("body-parser");
var flash = require("express-flash");
const session = require("express-session");
const mysql = require("mysql");
var MySQLStore = require("express-mysql-session")(session);
const dotenv = require("dotenv");
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
dotenv.config();

app.use(favicon(__dirname + "/public/favicon.png"));
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  if (!req.user)
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  next();
}); // prevent login using back after logout

//sql initialization
var options = {
  host: "localhost",
  port: 3308,
  user: "root",
  password: "password",
  database: "hospitals"
};
var sessionStore = new MySQLStore(options);
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: 600000 }
  })
);
function createConn() {
  // create a connection
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "hospitals",
    port: 3308
  });
}
//sql initalization ends

app.set("view-engine", "ejs");

//routes

//about
app.use("/About", (req, res) => {
  if (req.session.username)
    res.render("about.ejs", { name: req.session.username, a: "True" });
  else res.render("about.ejs", { name: "Login", a: "False" });
});

//login authentication
app.use("/hospital_login", checkUsernot, (req, res) => {
  res.render("login.ejs", { name: "Login", a: "False" });
});

app.post("/authenticate", checkUsernot, (req, res) => {
  const conn = createConn();
  var username = req.body.username;
  var code = req.body.code;
  var password = req.body.password;

  conn.query(
    "SELECT * FROM hospitals where Name = ? and Code = ?",
    [username, code],
    (err, result) => {
      try {
        if (err) {
          res.sendStatus(500);
          return;
        }
        var hash = result[0].Password;
        bcrypt.compare(password, hash, (err, yy) => {
          if (err) {
            throw err;
          } else if (yy == true) {
            req.session.username = result[0].Name;
            res.redirect("/authenticated_user");
          } else {
            console.log("bcrypterr");
            res.redirect("/hospital_login");
          }
        });
      } catch {
        console.log("bcrypterr2");
        res.redirect("/hospital_login");
      }
    }
  );
});

app.post("/logout", checkUser, (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
app.get("/", (req, res) => {
  if (req.session.usesrname)
    res.render("index.ejs", { name: req.session.username, a: "False" });
  else res.render("index.ejs", { name: "Login", a: "False" });
});

//login authentication ends

//update the data
app.use("/authenticated_user", checkUser, (req, res) => {
  const conn = createConn();
  var sql = "SELECT * FROM hospitals WHERE Name = ?";
  conn.query(sql, [req.session.username], (err, rows) => {
    try {
      if (err) {
        return;
      }
      res.render("update_data.ejs", {
        name: rows[0].Name,
        code: rows[0].Code,
        total: rows[0].Total_Beds,
        avail: rows[0].Avaiable_Beds,
        name: req.session.username,
        a: "True"
      });
    } catch {
      console.log("error");
    }
  });
});

app.post("/update", checkUser, (req, res) => {
  const conn = createConn();
  var a = req.body.updated_value;
  var b = req.session.username;

  if (a === "") {
    res.redirect("/authenticated_user");
  }

  var sql = "UPDATE hospitals SET Avaiable_Beds = ? WHERE Name = ?";
  conn.query(sql, [a, b], (err, rows) => {
    try {
      if (err) {
        return;
      }
      console.log("success");
      res.redirect("/authenticated_user");
    } catch {
      console.log("error");
      res.redirect("/authenticated_user");
    }
  });
});

//check user is admin or not
function checkUser(req, res, next) {
  if (!req.session.username) {
    res.redirect("/hospital_login");
    return;
  }
  return next();
}
//check user is logged in
function checkUsernot(req, res, next) {
  if (req.session.username) {
    res.redirect("/authenticated_user");
    return;
  }
  return next();
}

//start server
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
