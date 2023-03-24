const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  designName: {
    type: String,
    default: "basicInput",
  },
  lang: {
    type: String,
    default: "pl",
  },
  templateInvoice: {
    type: String,
    default: "basicInput",
  },
});

module.exports = mongoose.model("Setting", settingSchema);
