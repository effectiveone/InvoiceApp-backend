const Faktura = require("../../models/faktura");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const sanitize = require("mongo-sanitize");
const xss = require("xss-filters");

const { extractYearAndMonth } = require("../../service/listJPK");
const { sendEmailWithJpkXml } = require("../../service/sendJPK");
const { generateJpkXml } = require("../../service/generateXML-JPK");

const jpkController = {
  invoiceStatsForJPK: async (req, res) => {
    try {
      const userEmail = xss.inHTMLData(sanitize(req.body.userEmail));

      const allInvoices = await Faktura.find({
        userEmail: userEmail,
      }).exec();

      const prefixes = ["FV", "FZ", "FPS", "FPZ", "K-", "FZL"];

      const jpkCreator = extractYearAndMonth(allInvoices, prefixes);

      res.send({
        jpk: jpkCreator,
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  createJPK: async (req, res) => {
    const selectedYear = req.body.selectedYear;
    const selectedMonth = req.body.selectedMonth;

    try {
      const userEmail = xss.inHTMLData(sanitize(req.body.userEmail));

      const allInvoices = await Faktura.find({
        userEmail: userEmail,
      }).exec();

      const prefixes = ["FV", "FZ", "FPS", "FPZ", "K-", "FZL"];

      const jpkCreator = extractYearAndMonth(
        allInvoices,
        prefixes,
        selectedYear,
        selectedMonth
      );

      const jpkXml = generateJpkXml(jpkCreator.selectedYear);
      const emailSent = await sendEmailWithJpkXml(jpkXml, userEmail);
      if (emailSent) {
        res.status(200).send("E-mail sent successfully to client");
      } else {
        res.status(500).send("Error sending e-mail");
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};

module.exports = jpkController;
