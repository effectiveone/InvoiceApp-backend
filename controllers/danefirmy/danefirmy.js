const DaneFirmy = require("../models/daneFirmy");

const daneFirmyController = {
  create: async (req, res) => {
    try {
      const daneFirmy = new DaneFirmy(req.body);
      await daneFirmy.save();
      res.status(201).send(daneFirmy);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  read: async (req, res) => {
    try {
      const daneFirmy = await DaneFirmy.findById(req.params.id);
      if (!daneFirmy) {
        return res.status(404).send("Dane firmy not found");
      }
      res.send(daneFirmy);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  update: async (req, res) => {
    const allowedUpdates = ["nazwa", "adres", "nip", "konto"];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).send("Invalid updates");
    }

    try {
      const daneFirmy = await DaneFirmy.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!daneFirmy) {
        return res.status(404).send("Dane firmy not found");
      }
      res.send(daneFirmy);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  delete: async (req, res) => {
    try {
      const daneFirmy = await DaneFirmy.findByIdAndDelete(req.params.id);
      if (!daneFirmy) {
        return res.status(404).send("Dane firmy not found");
      }
      res.send(daneFirmy);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};

module.exports = daneFirmyController;
