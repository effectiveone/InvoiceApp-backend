const mongoose = require("mongoose");

const kontrahentSchema = new mongoose.Schema({
  nazwa: {
    type: String,
    required: true,
  },
  lokalizacja: {
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

module.exports = mongoose.model("Kontrahent", kontrahentSchema);
