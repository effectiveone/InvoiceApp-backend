const Kontrahent = require("../../models/kontrahenci");

const kontrahentController = {
  create: async (req, res) => {
    try {
      const kontrahent = new Kontrahent(req.body);
      await kontrahent.save();
      res.status(201).send(kontrahent);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  read: async (req, res) => {
    try {
      const kontrahent = await Kontrahent.findById(req.params.id);
      if (!kontrahent) {
        return res.status(404).send("Kontrahent not found");
      }
      res.send(kontrahent);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  update: async (req, res) => {
    const allowedUpdates = ["nazwa", "lokalizacja", "nip", "konto"];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).send("Invalid updates");
    }

    try {
      const kontrahent = await Kontrahent.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!kontrahent) {
        return res.status(404).send("Kontrahent not found");
      }
      res.send(kontrahent);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  delete: async (req, res) => {
    try {
      const kontrahent = await Kontrahent.findByIdAndDelete(req.params.id);
      if (!kontrahent) {
        return res.status(404).send("Kontrahent not found");
      }
      res.send(kontrahent);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};

module.exports = kontrahentController;
