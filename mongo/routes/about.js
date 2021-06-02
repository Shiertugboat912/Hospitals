var router = require("express").Router();
var Hospital = require("../models/Hospital");

router.get("/", (req, res) => {
  if (req.session.username)
    res.render("about.ejs", { name: req.session.username, a: "True" });
  else res.render("about.ejs", { name: "Login", a: "False" });
});

module.exports = router;
