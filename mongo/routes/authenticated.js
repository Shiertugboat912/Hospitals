var router = require("express").Router();
var Hospital = require("../models/Hospital");
var auth = require("../controllers/auth");

router.get("/", auth.isauth, (req, res) => {
  const user = req.session.username;
  Hospital.findOne({ name: user })
    .then((hospital) => {
      res.render("Admin.ejs", {
        name: hospital.name,
        code: hospital.code,
        total: hospital.Total_Beds,
        avail: hospital.Available_Beds,
        name: req.session.username,
        error: req.flash("error"),
        success: req.flash("success"),
        a: "True",
      });
    })
    .catch((err) => {
      res.status(400).res.send("not found");
    });
});

router.post("/update", auth.isauth, (req, res) => {
  var a = req.body.new_ava;
  var b = req.session.username;
  var c = req.body.new_total;

  if (a === "" || c === "") {
    req.flash("error", "Enter both values");
    return res.redirect("/authenticated_user");
  }

  Hospital.updateOne(
    { name: b },
    {
      $set: {
        Total_Beds: c,
        Available_Beds: a,
      },
    }
  ).then(() => {
    req.flash("success", "Updated Successfully");
    res.redirect("/authenticated_user");
  });
});

module.exports = router;
