const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const { Schema } = mongoose;

const companySchema = new Schema({
  id: {
    type: String,
    default: uuidv4,
  },

  nip: {
    type: String,
    required: true,
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
  },
});

const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  vat: {
    type: Number,
    required: true,
  },
  netPrice: {
    type: Number,
    required: true,
  },
  netValue: {
    type: Number,
    required: true,
  },
  grossValue: {
    type: Number,
    required: true,
  },
});

const invoiceSchema = new Schema({
  companyData: {
    type: companySchema,
    required: true,
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  invoiceType: {
    type: String,
    required: true,
  },
  selectedKontrahent: {
    type: companySchema,
    required: true,
  },
  invoiceSaleDate: {
    type: Date,
    required: true,
  },
  invoiceDate: {
    type: Date,
    required: true,
  },
  invoicePaymentDate: {
    type: Date,
    required: true,
  },
  items: {
    type: [itemSchema],
    required: true,
  },
  totalNetValue: {
    type: Number,
    required: true,
  },
  totalGrossValue: {
    type: Number,
    required: true,
  },

  userEmail: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
