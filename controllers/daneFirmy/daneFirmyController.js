const DaneFirmy = require("../../models/daneFirmy");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const sanitize = require("mongo-sanitize");
const xss = require("xss-filters");
const daneFirmyController = {
  createOrUpdate: async (req, res) => {
    console.log(req.body);
    const sanitizedData = {
      nip: xss.inHTMLData(sanitize(req.body.nip)),
      regon: xss.inHTMLData(sanitize(req.body.regon)),
      street: xss.inHTMLData(sanitize(req.body.street)),
      city: xss.inHTMLData(sanitize(req.body.city)),
      zipCode: xss.inHTMLData(sanitize(req.body.zipCode)),
      companyName: xss.inHTMLData(sanitize(req.body.companyName)),
      legalForm: xss.inHTMLData(sanitize(req.body.legalForm)),
      userEmail: xss.inHTMLData(sanitize(req.body.userEmail)),
      bankAccount: xss.inHTMLData(sanitize(req.body.bankAccount)),
      bankName: xss.inHTMLData(sanitize(req.body.bankName)),
    };

    try {
      let daneFirmy;
      const existingDaneFirmy = await DaneFirmy.findOne({
        userEmail: sanitizedData.userEmail,
      });
      if (existingDaneFirmy) {
        // Aktualizuj dane firmy
        daneFirmy = await DaneFirmy.findByIdAndUpdate(
          existingDaneFirmy._id,
          sanitizedData,
          { new: true }
        );
      } else {
        // Utwórz nową firmę
        daneFirmy = new DaneFirmy(sanitizedData);
        await daneFirmy.save();
      }
      res.status(200).send(daneFirmy);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  read: async (req, res) => {
    try {
      const daneFirmy = await DaneFirmy.findOne({
        userEmail: req.body.userEmail,
      });

      if (!daneFirmy) {
        const defaultDaneFirmy = {
          nip: "",
          regon: "",
          street: "",
          city: "",
          zipCode: "",
          companyName: "",
          legalForm: "",
          bankName: "",
          bankAccount: "",
        };
        return res.status(200).send(defaultDaneFirmy);
      }

      res.status(200).send(daneFirmy);
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
      const daneFirmy = await DaneFirmy.findOneAndUpdate(
        { mail: req.body.mail },
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
      const daneFirmy = await DaneFirmy.findOneAndDelete({
        mail: req.body.mail,
      });
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
