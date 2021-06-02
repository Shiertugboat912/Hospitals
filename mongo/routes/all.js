var router = require("express").Router();
var auth = require("../controllers/auth");
var Hospital = require("../models/Hospital");

module.exports = router;

/*
app.post("/authenticate", checkUsernot, (req, res) => {
  const conn = createConn();

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
        a: "True",
      });
    } catch {
      res.redirect("/");
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
          list: rows,
        });
      else {
        res.render("List.ejs", {
          name: "Login",
          a: "False",
          list: rows,
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
          result: rows,
        });
      else {
        res.render("index.ejs", {
          name: "Login",
          a: "False",
          result: rows,
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
 */
