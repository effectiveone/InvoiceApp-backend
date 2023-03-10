const Kontrahent = require("../../models/kontrahenci");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const sanitize = require("mongo-sanitize");
const xss = require("xss-filters");
const kontrahentController = {
  create: async (req, res) => {
    const sanitizedData = {
      nip: xss.inHTMLData(sanitize(req.body.nip)),
      regon: xss.inHTMLData(sanitize(req.body.regon)),
      street: xss.inHTMLData(sanitize(req.body.street)),
      city: xss.inHTMLData(sanitize(req.body.city)),
      zipCode: xss.inHTMLData(sanitize(req.body.zipCode)),
      companyName: xss.inHTMLData(sanitize(req.body.companyName)),
      legalForm: xss.inHTMLData(sanitize(req.body.legalForm)),
      userEmail: xss.inHTMLData(sanitize(req.body.userEmail)),
    };
    try {
      const kontrahent = new Kontrahent(sanitizedData);
      await kontrahent.save();
      res.status(201).send(kontrahent);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  read: async (req, res) => {
    try {
      const kontrahent = await Kontrahent.find({
        userEmail: req.body.userEmail,
      });
      if (!kontrahent) {
        return res.status(404).send("Kontrahent not found");
      }
      res.send(kontrahent);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  update: async (req, res) => {
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
      console.error(error);
      res.status(400).send(error.message);
    }
  },

  delete: async (req, res) => {
    console.log("delete", req.params.id);
    try {
      const kontrahent = await Kontrahent.findByIdAndDelete(req.params.id);
      if (!kontrahent) {
        return res.status(404).send("Kontrahent not found");
      }
      res.send(kontrahent);
    } catch (error) {
      console.error(error);
      res.status(400).send(error.message);
    }
  },
};

module.exports = kontrahentController;
