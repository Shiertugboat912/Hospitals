var router = require("express").Router();
var Hospital = require("../models/Hospital");

router.get("/", (req, res) => {
  Hospital.find({})
    .then((hospital) => {
      if (req.session.username) {
        res.render("List.ejs", {
          name: req.session.username,
          a: "True",
          list: hospital,
        });
      } else {
        res.render("List.ejs", {
          name: "Login",
          a: "False",
          list: hospital,
        });
      }
    })
    .catch((err) => {
      res.status(400).res.send("not found");
    });
});

module.exports = router;
