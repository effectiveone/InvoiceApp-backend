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
  invoiceStats: async (req, res) => {
    try {
      const userEmail = xss.inHTMLData(sanitize(req.body.userEmail));

      const salesInvoices = await Faktura.find({
        userEmail: userEmail,
        invoiceType: { $in: ["sprzedazowa", "zaliczkowa"] },
      }).exec();
      const purchaseInvoices = await Faktura.find({
        userEmail: userEmail,
        invoiceType: "zakupowa",
      }).exec();

      const correctionInvoices = await Faktura.find({
        userEmail: userEmail,
        invoiceType: "koregujaca",
      }).exec();

      const proformaSalesInvoices = await Faktura.find({
        userEmail: userEmail,
        invoiceType: "proformaSprzedazowa",
      }).exec();

      const proformaPurchaseInvoices = await Faktura.find({
        userEmail: userEmail,
        invoiceType: "proformaZakupowa",
      }).exec();

      const monthlySales = {
        sprzedazowa: {},
        zaliczkowa: {},
        zakupowa: {},
        koregujaca: {},
        proformaSprzedazowa: {},
        proformaZakupowa: {},
      };

      const yearlySales = {
        sprzedazowa: {} ?? 0,
        zaliczkowa: {} ?? 0,
        zakupowa: {} ?? 0,
        koregujaca: {} ?? 0,
        proformaSprzedazowa: {} ?? 0,
        proformaZakupowa: {} ?? 0,
      };

      const invoicesArray = [
        salesInvoices,
        purchaseInvoices,
        correctionInvoices,
        proformaSalesInvoices,
        proformaPurchaseInvoices,
      ];

      const prefixes = ["FV", "FZ", "FPS", "FPZ", "K-", "FZL"];

      function extractYearAndMonth(input, prefixes) {
        const regex = new RegExp(
          `(${prefixes.join("|")})(\\d{2})(\\d{2})`,
          "g"
        );
        let match;
        const results = [];

        while ((match = regex.exec(input)) !== null) {
          results.push({ year: match[2], month: match[3] });
        }

        return results;
      }

      function processInvoices(invoices) {
        invoices.forEach((invoice) => {
          const invoiceNumber = invoice.invoiceNumber;
          const extractedData = extractYearAndMonth(invoiceNumber, prefixes);
          const year = extractedData[0].year;
          const month = extractedData[0].month;

          // Oblicz sumę sprzedaży dla każdego miesiąca
          if (!monthlySales[invoice.invoiceType][year]) {
            monthlySales[invoice.invoiceType][year] = {};
          }

          // Iteruj przez wszystkie miesiące w roku i u

          for (let monthNumber = 1; monthNumber <= 12; monthNumber++) {
            const monthString = monthNumber.toString().padStart(2, "0");
            if (!monthlySales[invoice.invoiceType][year][monthString]) {
              monthlySales[invoice.invoiceType][year][monthString] = 0;
            }
          }

          // Dodaj kwotę faktury do sumy sprzedaży miesiąca
          monthlySales[invoice.invoiceType][year][month] +=
            invoice.totalGrossValue;

          // Oblicz sumę sprzedaży dla każdego typu faktury w danym roku

          if (!yearlySales[invoice.invoiceType][year]) {
            yearlySales[invoice.invoiceType][year] = 0;
          }
          yearlySales[invoice.invoiceType][year] += invoice.totalGrossValue;

          // Oblicz sumę sprzedaży dla każdego roku
          if (!yearlySales[year]) {
            yearlySales[year] = 0;
          }
          yearlySales[year] += invoice.totalGrossValue;
        });
      }

      // Teraz możemy zastosować funkcję processInvoices do każdej tablicy
      invoicesArray.forEach((invoices) => {
        processInvoices(invoices);
      });

      const years = Object.keys(yearlySales).filter(
        (key) => Number.isInteger(Number(key)) && Number(key) > 0
      );

      const total = Object.keys(yearlySales).filter(
        (key) => !years.includes(key)
      );

      const chartData = years.map((year) => {
        const chart = {};
        total.forEach((category) => {
          chart[category] = yearlySales[category][year] ?? 0;
        });
        return {
          [year]: Object.assign({}, chart),
        };
      });

      res.send({
        monthlySales: monthlySales,
        yearlySales: yearlySales,
        chartData: chartData,
        years,
        total,
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
};

module.exports = statsController;
