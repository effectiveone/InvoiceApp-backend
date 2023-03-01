const Faktura = require("../models/faktura");

const fakturaController = {
  create: async (req, res) => {
    try {
      const faktura = new Faktura(req.body);
      await faktura.save();
      res.status(201).send(faktura);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  read: async (req, res) => {
    try {
      const faktura = await Faktura.findById(req.params.id);
      if (!faktura) {
        return res.status(404).send("Faktura not found");
      }
      res.send(faktura);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  update: async (req, res) => {
    const allowedUpdates = [
      "numerFaktury",
      "dataWystawienia",
      "kontrahent",
      "daneFirmy",
      "pozycje",
    ];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).send("Invalid updates");
    }

    try {
      const faktura = await Faktura.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!faktura) {
        return res.status(404).send("Faktura not found");
      }
      res.send(faktura);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  delete: async (req, res) => {
    try {
      const faktura = await Faktura.findByIdAndDelete(req.params.id);
      if (!faktura) {
        return res.status(404).send("Faktura not found");
      }
      res.send(faktura);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};

module.exports = fakturaController;
