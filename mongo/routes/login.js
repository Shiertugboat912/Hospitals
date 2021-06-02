var router = require("express").Router();
var Hospital = require("../models/Hospital");
var auth = require("../controllers/auth");

router.get("/", auth.isnotauth, (req, res) => {
  res.render("login.ejs", {
    name: "Login",
    a: "False",
    error: req.flash("error"),
  });
});

router.post("/authenticate", auth.isnotauth, auth.Login);

router.post("/logout", auth.isauth, (req, res) => {
  req.session.username = "";
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
