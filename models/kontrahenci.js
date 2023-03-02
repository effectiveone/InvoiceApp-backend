const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const kontrahentSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  nip: {
    type: String,
    required: true,
    unique: true,
  },
  regon: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  legalForm: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
    // unique: false,
  },
});

module.exports = mongoose.model("Kontrahent", kontrahentSchema);
