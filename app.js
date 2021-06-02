const port = 3000;
const express = require("express");
const app = express();
const favicon = require("express-favicon");
const bodyparser = require("body-parser");
//var flash = require("express-flash");
const session = require("express-session");
//const mysql = require("mysql");
//var MySQLStore = require("express-mysql-session")(session);
//var cookieParser = require("cookie-parser");
//app.use(cookieParser(process.env.SECRET)); //for flash messages
const dotenv = require("dotenv");
//var bcrypt = require("bcryptjs");
var fs = require("fs");
var https = require("https");

var Hospital = require("./mongo/models/Hospital");

var about = require("./mongo/routes/about");
var list = require("./mongo/routes/list");
var login = require("./mongo/routes/login");
var search = require("./mongo/routes/search");
var authenticated = require("./mongo/routes/authenticated");

//mongo connections
//importing db config
var db = require("./mongo/config");

//connectinfg to the database
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

//middleware
dotenv.config();
var flash = require("connect-flash");

app.use(
  session({
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET,
  })
);
app.use(flash()); //for flash messages

app.use(favicon(__dirname + "/public/images/favicon.png"));
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());

app.use(function (req, res, next) {
  if (!req.user)
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  next();
}); // prevent login using back after logout

//sql initialization
/* var options = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "hospitals",
};
var sessionStore = new MySQLStore(options);
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: 600000 },
  })
);
function createConn() {
  // create a connection
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "hospitals",
    port: 3306,
  });
} */
//sql initalization ends

app.set("view-engine", "ejs");

//routes

app.get("/", (req, res) => {
  Hospital.find({})
    .then((hospital) => {
      if (req.session.username) {
        res.render("index.ejs", {
          name: req.session.username,
          a: "True",
          result: hospital,
        });
      } else {
        res.render("index.ejs", {
          name: "Login",
          a: "False",
          result: hospital,
        });
      }
    })
    .catch((err) => {
      res.status(400).res.send("not found");
    });
});

app.use("/about", about);
app.use("/hospital_login", login);
app.use("/hospital_list", list);
app.use("/search", search);
app.use("/authenticated_user", authenticated);

//login

/* var privateKey = fs.readFileSync(
  "C:/Program Files/OpenSSL-Win64/bin/hospitals.key",
  "utf8"
);
var certificate = fs.readFileSync(
  "C:/Program Files/OpenSSL-Win64/bin/hospitals.crt",
  "utf8"
); */

//start server
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

/* https
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
 */
