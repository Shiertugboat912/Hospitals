var Hospital = require("../models/Hospital");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.Login = (req, res) => {
  const { username, code, password } = req.body;
  Hospital.findOne({ code: code, name: username })
    .then((hospital) => {
      bcrypt.compare(password, hospital.password).then((answer) => {
        if (answer == true) {
          req.session.username = hospital.name;
          res.redirect("/authenticated_user");
        } else {
          req.flash("error", "Wrong Password or Name or code");
          res.redirect("/hospital_login");
        }
      });
    })
    .catch((err) => {
      req.flash("error", "Wrong Password or Name or code");
      res.redirect("/hospital_login");
    });
};

exports.isauth = (req, res, next) => {
  if (!req.session.username) {
    res.redirect("/hospital_login");
    console.log("not auth");
    return;
  }
  return next();
};

exports.isnotauth = (req, res, next) => {
  if (req.session.username) {
    res.redirect("/authenticated_user");
    return;
  }
  return next();
};
