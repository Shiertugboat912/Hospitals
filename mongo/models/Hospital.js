var mongoose = require("mongoose");

var schema = mongoose.Schema({
  name: {
    type: String,
    max: 255,
    min: 6,
    require: true,
  },
  code: {
    type: Number,
    max: 255,
    min: 6,
  },
  password: {
    type: String,
    max: 255,
    min: 6,
  },
  lat: {
    type: Number,
    max: 255,
    min: 6,
  },
  lon: {
    type: Number,
    max: 255,
    min: 6,
  },
  Total_Beds: {
    type: Number,
    max: 255,
    min: 6,
  },
  Available_Beds: {
    type: Number,
    max: 255,
    min: 6,
  },
});

const Hospital = mongoose.model("Hospitals", schema, "Hospitals");

module.exports = Hospital;
