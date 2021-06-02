var router = require("express").Router();
var Hospital = require("../models/Hospital");

router.get("/", (req, res) => {
  var a = req.query.searchhosp;
  Hospital.find({ name: { $regex: a, $options: "i" } })
    .then((docs) => {
      console.log(docs);
      if (req.session.username)
        res.render("search.ejs", {
          name: req.session.username,
          a: "True",
          result: docs,
        });
      else {
        res.render("search.ejs", {
          name: "Login",
          a: "False",
          result: docs,
        });
      }
    })
    .catch((err) => {
      return res.status(400).redirect("/");
    });
});

module.exports = router;
