const mongoose = require("mongoose");

const fakturaSchema = new mongoose.Schema({
  numerFaktury: {
    type: String,
    required: true,
  },
  dataWystawienia: {
    type: Date,
    required: true,
  },
  kontrahent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Kontrahent",
    required: true,
  },
  daneFirmy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DaneFirmy",
    required: true,
  },
  pozycje: [
    {
      nazwaProduktu: {
        type: String,
        required: true,
      },
      ilosc: {
        type: Number,
        required: true,
      },
      cenaJednostkowa: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Faktura", fakturaSchema);
