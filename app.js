const port = 443;
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
var fs = require("fs");
var https = require("https");

dotenv.config();
var flash = require("connect-flash");
var cookieParser = require("cookie-parser");
app.use(cookieParser("keyboard cat")); //for flash messages
app.use(flash()); //for flash messages

app.use(favicon(__dirname + "/public/images/favicon.png"));
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
  password: "minifinal",
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
    password: "minifinal",
    database: "hospitals",
    port: 3308
  });
}
//sql initalization ends

app.set("view-engine", "ejs");

app.set("view engine", "php");

//routes

//about
app.get("/About", (req, res) => {
  if (req.session.username)
    res.render("about.ejs", { name: req.session.username, a: "True" });
  else res.render("about.ejs", { name: "Login", a: "False" });
});

//login authentication
app.get("/hospital_login", checkUsernot, (req, res) => {
  res.render("login.ejs", {
    name: "Login",
    a: "False",
    error: req.flash("error")
  });
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
            req.flash("error", "Wrong Password");
            res.redirect("/hospital_login");
          }
        });
      } catch {
        req.flash("error", "Wrong Name or Code");
        res.redirect("/hospital_login");
      }
    }
  );
});

app.post("/logout", checkUser, (req, res) => {
  req.session.username = "";
  req.session.destroy();
  res.redirect("/");
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
      res.render("Admin.ejs", {
        name: rows[0].Name,
        code: rows[0].Code,
        total: rows[0].Total_Beds,
        avail: rows[0].Avaiable_Beds,
        name: req.session.username,
        error: req.flash("error"),
        success: req.flash("success"),
        a: "True"
      });
    } catch {
      res.redirect("/");
    }
  });
});

app.post("/update", checkUser, (req, res) => {
  const conn = createConn();
  var a = req.body.new_ava;
  var b = req.session.username;
  var c = req.body.new_total;

  if (a === "" || b === "") {
    req.flash("error", "Enter both values");
    res.redirect("/authenticated_user");
  }

  var sql =
    "UPDATE hospitals SET Avaiable_Beds = ?, Total_Beds = ? WHERE Name = ?";
  conn.query(sql, [a, c, b], (err, rows) => {
    try {
      if (err) {
        return;
      }
      req.flash("success", "Success");
      res.redirect("/authenticated_user");
    } catch {
      res.redirect("/authenticated_user");
    }
  });
});

app.get("/search", (req, res) => {
  const conn = createConn();
  var a = req.query;
  var sql =
    "SELECT Name, Total_Beds, Avaiable_Beds, Latitude, Longitude " +
    "FROM hospitals WHERE Name LIKE ? ";
  conn.query(sql, ["%" + a.searchhosp + "%"], (err, rows) => {
    try {
      if (err) {
        throw err;
      }
      if (req.session.username)
        res.render("search.ejs", {
          name: req.session.username,
          a: "True",
          result: rows
        });
      else {
        res.render("search.ejs", {
          name: "Login",
          a: "False",
          result: rows
        });
      }
    } catch {
      throw err;
      res.send("error");
    }
  });
});

//list of hospitals

app.get("/hospital_list", (req, res) => {
  var conn = createConn();
  var sql = "SELECT Name FROM hospitals";
  conn.query(sql, (err, rows) => {
    try {
      if (err) return;
      if (req.session.username)
        res.render("List.ejs", {
          name: req.session.username,
          a: "True",
          list: rows
        });
      else {
        res.render("List.ejs", {
          name: "Login",
          a: "False",
          list: rows
        });
      }
    } catch {
      res.send("error");
    }
  });
});

//first link
app.get("/", (req, res) => {
  const conn = createConn();
  var sql = "SELECT * FROM hospitals";
  conn.query(sql, (err, rows) => {
    try {
      if (err) {
        return;
      }
      if (req.session.username)
        res.render("index.ejs", {
          name: req.session.username,
          a: "True",
          result: rows
        });
      else {
        res.render("index.ejs", {
          name: "Login",
          a: "False",
          result: rows
        });
      }
    } catch {
      res.send("error");
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

var privateKey = fs.readFileSync(
  "C:/Program Files/OpenSSL-Win64/bin/hospitals.key",
  "utf8"
);
var certificate = fs.readFileSync(
  "C:/Program Files/OpenSSL-Win64/bin/hospitals.crt",
  "utf8"
);

//start server
/* app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
); */

https
  .createServer(
    {
      key: privateKey,
      cert: certificate
    },
    app
  )
  .listen(port, () =>
    console.log(`Example app listening at https://localhost:${port}`)
  );
