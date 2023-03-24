const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  netPrice: { type: Number, required: true },
  vat: { type: Number, required: true },
  grossPrice: { type: Number, required: true },
  currency: { type: String, required: true },
  description: { type: String },
  tags: { type: [String] },
  quantity: { type: Number, required: true },
  service: { type: Boolean, required: true },
  purchaseNetPrice: { type: Number, required: true },
  purchaseVat: { type: Number, required: true },
  purchaseGrossPrice: { type: Number, required: true },
  unit: { type: String, required: true },
  defaultQuantity: { type: Number, required: true },
  pkwiu: { type: String },
  supplierCode: { type: String },
  accountingCode: { type: String },
  userEmail: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
