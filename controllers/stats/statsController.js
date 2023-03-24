const Faktura = require("../../models/faktura");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const sanitize = require("mongo-sanitize");
const xss = require("xss-filters");

const statsController = {
  salesStats: async (req, res) => {
    try {
      const invoices = await Faktura.find({
        userEmail: xss.inHTMLData(sanitize(req.body.userEmail)),
      }).exec();

      // Utwórz obiekt z rocznymi i miesięcznymi sumami sprzedaży
      const monthlySales = {};
      const yearlySales = {};

      // Iteruj przez wszystkie faktury
      invoices.forEach((invoice) => {
        const invoiceDate = new Date(invoice.invoiceDate);
        const invoiceYear = invoiceDate.getFullYear().toString();
        const invoiceMonth = (invoiceDate.getMonth() + 1)
          .toString()
          .padStart(2, "0");

        // Oblicz sumę sprzedaży dla każdego miesiąca
        if (!monthlySales[invoiceYear]) {
          monthlySales[invoiceYear] = {};
        }

        // Iteruj przez wszystkie miesiące w roku i ustaw początkową wartość 0, jeśli nie ma faktury
        for (let month = 1; month <= 12; month++) {
          const monthString = month.toString().padStart(2, "0");
          if (!monthlySales[invoiceYear][monthString]) {
            monthlySales[invoiceYear][monthString] = 0;
          }
        }

        // Dodaj kwotę faktury do sumy sprzedaży miesiąca
        monthlySales[invoiceYear][invoiceMonth] += invoice.totalGrossValue;

        // Oblicz sumę sprzedaży dla każdego roku
        if (!yearlySales[invoiceYear]) {
          yearlySales[invoiceYear] = 0;
        }
        yearlySales[invoiceYear] += invoice.totalGrossValue;
      });

      res.send({
        monthlySales: monthlySales,
        yearlySales: yearlySales,
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};

module.exports = statsController;
