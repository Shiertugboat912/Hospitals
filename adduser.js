var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

const dotenv = require("dotenv");
dotenv.config();

var data = process.env.DATA;

bcrypt.genSalt(10, function (err, salt) {
  bcrypt.hash(data, salt, function (err, hash) {
    if (err) throw err;
    console.log(hash);
  });
});

/*
bcrypt.compare(data, hash, function(err, res) {
    if(err)
        throw err
    console.log(hash)
});
// As of bcryptjs 2.4.0, compare returns a promise if callback is omitted:
bcrypt.compare(data, hash).then((res) => {
    // res === true
});*/
