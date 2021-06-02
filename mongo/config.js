var mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.Promise = global.Promise;
let url =
  "mongodb+srv://admin:admin_password@cluster0.t9arp.mongodb.net/Hospital?retryWrites=true&w=majority";

const db = {};
db.mongoose = mongoose;
db.url = url;

module.exports = db;
