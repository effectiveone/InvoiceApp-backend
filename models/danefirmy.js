const mongoose = require("mongoose");

const daneFirmySchema = new mongoose.Schema({
  nazwa: {
    type: String,
    required: true,
  },
  adres: {
    type: String,
    required: true,
  },
  nip: {
    type: String,
    required: true,
    unique: true,
  },
  konto: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("DaneFirmy", daneFirmySchema);
