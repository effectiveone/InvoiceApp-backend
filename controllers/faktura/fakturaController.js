const Faktura = require("../../models/faktura");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const sanitize = require("mongo-sanitize");
const xss = require("xss-filters");

const fakturaController = {
  checkNumber: async (req, res) => {
    try {
      const { userEmail } = req.body;
      const currentDate = new Date();
      const year = currentDate.getFullYear().toString().slice(-2);
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");

      const latestInvoice = await Faktura.findOne({
        userEmail: userEmail,
        invoiceNumber: { $regex: `^${year}${month}` },
      })
        .sort({ invoiceNumber: -1 })
        .exec();

      if (!latestInvoice) {
        return `${year}${month}-001`;
      }

      const latestNumber = parseInt(latestInvoice.invoiceNumber.slice(-3));
      const nextNumber = (latestNumber + 1).toString().padStart(3, "0");

      const currentInvoiceNumber = `${year}${month}-${nextNumber}`;

      res.send(currentInvoiceNumber);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  checkAllNumber: async (req, res) => {
    try {
      const { userEmail } = req.body;
      const currentDate = new Date();
      const year = currentDate.getFullYear().toString().slice(-2);
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");

      const latestInvoices = await Faktura.find({
        userEmail: userEmail,
        invoiceNumber: { $regex: `^${year}${month}` },
      })
        .sort({ invoiceNumber: -1 })
        .exec();

      let latestNumbers = {
        korygujaca: 0,
        sprzedazowa: 0,
        zakupowa: 0,
        zaliczkowa: 0,
        proformaSprzedazowa: 0,
        proformaZakupowa: 0,
      };

      latestInvoices.forEach((invoice) => {
        const prefix = invoice.invoiceNumber.slice(0, 2);
        const number = parseInt(invoice.invoiceNumber.slice(-3));
        switch (prefix) {
          case "K-":
            latestNumbers.korygujaca = Math.max(
              latestNumbers.korygujaca,
              number
            );
            break;
          case "FV":
            latestNumbers.sprzedazowa = Math.max(
              latestNumbers.sprzedazowa,
              number
            );
            break;
          case "FZ":
            latestNumbers.zakupowa = Math.max(latestNumbers.zakupowa, number);
            break;
          case "FZL":
            latestNumbers.zaliczkowa = Math.max(
              latestNumbers.zaliczkowa,
              number
            );
            break;
          case "FPS":
            latestNumbers.proformaSprzedazowa = Math.max(
              latestNumbers.proformaSprzedazowa,
              number
            );
            break;
          case "FPZ":
            latestNumbers.proformaZakupowa = Math.max(
              latestNumbers.proformaZakupowa,
              number
            );
            break;
        }
      });

      const nextNumbers = {
        korygujaca: (latestNumbers.korygujaca + 1).toString().padStart(3, "0"),
        sprzedazowa: (latestNumbers.sprzedazowa + 1)
          .toString()
          .padStart(3, "0"),
        zakupowa: (latestNumbers.zakupowa + 1).toString().padStart(3, "0"),
        zaliczkowa: (latestNumbers.zaliczkowa + 1).toString().padStart(3, "0"),
        proformaSprzedazowa: (latestNumbers.proformaSprzedazowa + 1)
          .toString()
          .padStart(3, "0"),
        proformaZakupowa: (latestNumbers.proformaZakupowa + 1)
          .toString()
          .padStart(3, "0"),
      };

      const currentInvoiceNumbers = {
        korygujaca: `K-${year}${month}-${nextNumbers.korygujaca}`,
        sprzedazowa: `FV${year}${month}-${nextNumbers.sprzedazowa}`,
        zakupowa: `FZ${year}${month}-${nextNumbers.zakupowa}`,
        zaliczkowa: `FZ${year}${month}-Z${nextNumbers.zaliczkowa}`,
        proformaSprzedazowa: `FPS${year}${month}-${nextNumbers.proformaSprzedazowa}, proformaZakupowa: FPZ${year}${month}-${nextNumbers.proformaZakupowa}`,
      };

      res.json(currentInvoiceNumbers);
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

  create: async (req, res) => {
    console.log("reqreq", req.body);
    try {
      const {
        companyData,
        selectedKontrahent,
        invoiceSaleDate,
        invoiceDate,
        invoicePaymentDate,
        items,
        totalNetValue,
        totalGrossValue,
        notes,
        userEmail,
        invoiceNumber,
        invoiceType,
      } = req.body;

      const faktura = new Faktura({
        companyData: {
          nip: xss.inHTMLData(sanitize(companyData.nip)),
          regon: xss.inHTMLData(sanitize(companyData.regon)),
          street: xss.inHTMLData(sanitize(companyData.street)),
          city: xss.inHTMLData(sanitize(companyData.city)),
          zipCode: xss.inHTMLData(sanitize(companyData.zipCode)),
          companyName: xss.inHTMLData(sanitize(companyData.companyName)),
          legalForm: xss.inHTMLData(sanitize(companyData.legalForm)),
          userEmail: xss.inHTMLData(sanitize(companyData.userEmail)),
        },
        selectedKontrahent: {
          nip: xss.inHTMLData(sanitize(selectedKontrahent.kontrahent_nip)),
          regon: xss.inHTMLData(sanitize(selectedKontrahent.kontrahent_regon)),
          street: xss.inHTMLData(
            sanitize(selectedKontrahent.kontrahent_street)
          ),
          city: xss.inHTMLData(sanitize(selectedKontrahent.kontrahent_city)),
          zipCode: xss.inHTMLData(
            sanitize(selectedKontrahent.kontrahent_zipCode)
          ),
          companyName: xss.inHTMLData(
            sanitize(selectedKontrahent.kontrahent_companyName)
          ),
          legalForm: xss.inHTMLData(
            sanitize(selectedKontrahent.kontrahent_legalForm)
          ),
          userEmail: xss.inHTMLData(
            sanitize(selectedKontrahent.kontrahent_userEmail)
          ),
        },
        invoiceSaleDate,
        invoiceDate,
        invoiceType: xss.inHTMLData(sanitize(invoiceType)),
        invoicePaymentDate,
        items: items.map((item) => ({
          name: xss.inHTMLData(sanitize(item.name)),
          quantity: parseFloat(item.quantity),
          unit: xss.inHTMLData(sanitize(item.unit)),
          vat: parseFloat(item.vat),
          netPrice: parseFloat(item.netPrice),
          netValue: parseFloat(item.netValue),
          grossValue: parseFloat(item.grossValue),
        })),
        totalNetValue,
        totalGrossValue,
        userEmail: xss.inHTMLData(sanitize(userEmail)),
        notes: xss.inHTMLData(sanitize(notes)),
        invoiceNumber,
      });

      await faktura.save();
      res.status(201).send(faktura);
    } catch (error) {
      console.error(error);
      res.status(400).send(error.message);
    }
  },
  readAll: async (req, res) => {
    console.log("czy tu cos sie wydarzylo readAll", req.body);

    try {
      const faktura = await Faktura.find({
        userEmail: req.body.userEmail,
      });
      if (!faktura) {
        return res.status(404).send("faktura not found");
      }
      res.status(201).send(faktura);
    } catch (error) {
      console.error(error);
      res.status(400).send(error.message);
    }
  },
  update: async (req, res) => {
    try {
      const {
        companyData,
        selectedKontrahent,
        items,
        totalNetValue,
        totalGrossValue,
        notes,
        userEmail,
        invoiceSaleDate,
        invoiceDate,
        invoicePaymentDate,
        invoiceNumber,
      } = req.body;

      const existingFaktura = await Faktura.findOne({
        userEmail: userEmail,
        invoiceNumber: invoiceNumber,
      });

      existingFaktura.companyData = {
        nip: xss.inHTMLData(sanitize(companyData.nip)),
        regon: xss.inHTMLData(sanitize(companyData.regon)),
        street: xss.inHTMLData(sanitize(companyData.street)),
        city: xss.inHTMLData(sanitize(companyData.city)),
        zipCode: xss.inHTMLData(sanitize(companyData.zipCode)),
        companyName: xss.inHTMLData(sanitize(companyData.companyName)),
        legalForm: xss.inHTMLData(sanitize(companyData.legalForm)),
        userEmail: xss.inHTMLData(sanitize(companyData.userEmail)),
      };

      existingFaktura.selectedKontrahent = {
        nip: xss.inHTMLData(sanitize(selectedKontrahent.kontrahent_nip)),
        regon: xss.inHTMLData(sanitize(selectedKontrahent.kontrahent_regon)),
        street: xss.inHTMLData(sanitize(selectedKontrahent.kontrahent_street)),
        city: xss.inHTMLData(sanitize(selectedKontrahent.kontrahent_city)),
        zipCode: xss.inHTMLData(
          sanitize(selectedKontrahent.kontrahent_zipCode)
        ),
        companyName: xss.inHTMLData(
          sanitize(selectedKontrahent.kontrahent_companyName)
        ),
        legalForm: xss.inHTMLData(
          sanitize(selectedKontrahent.kontrahent_legalForm)
        ),
        userEmail: xss.inHTMLData(
          sanitize(selectedKontrahent.kontrahent_userEmail)
        ),
      };

      existingFaktura.invoiceSaleDate = invoiceSaleDate;
      existingFaktura.invoiceDate = invoiceDate;
      existingFaktura.invoicePaymentDate = invoicePaymentDate;
      existingFaktura.items = items.map((item) => ({
        name: xss.inHTMLData(sanitize(item.name)),
        quantity: parseFloat(item.quantity),
        unit: xss.inHTMLData(sanitize(item.unit)),
        vat: parseFloat(item.vat),
        netPrice: parseFloat(item.netPrice),
        netValue: parseFloat(item.netValue),
        grossValue: parseFloat(item.grossValue),
      }));
      existingFaktura.totalNetValue = totalNetValue;
      existingFaktura.totalGrossValue = totalGrossValue;
      existingFaktura.userEmail = xss.inHTMLData(sanitize(userEmail));
      existingFaktura.notes = xss.inHTMLData(sanitize(notes));
      const updatedFaktura = await existingFaktura.save();
      res.send(updatedFaktura);
    } catch (error) {
      console.error(error);
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
