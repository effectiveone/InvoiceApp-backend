const mongoose = require("mongoose");

const companyDataSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
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
  bankName: {
    type: String,
    required: true,
  },
  bankAccount: {
    type: String,
    required: true,
  },
  legalForm: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("DaneFirmy", companyDataSchema);
