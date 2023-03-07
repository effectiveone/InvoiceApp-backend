const Faktura = require("../../models/faktura");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const sanitize = require("mongo-sanitize");
const xss = require("xss-filters");

const fakturaController = {
  create: async (req, res) => {
    console.log("body", req.body);

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
      } = req.body;
      const invoiceNumber = await generateInvoiceNumber(); // assuming you have a function to generate invoice number
      console.log("invoiceNumber", req.body);

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

      console.log("faktura", faktura);
      await faktura.save();
      res.status(201).send(faktura);
    } catch (error) {
      console.error(error);
      res.status(400).send(error.message);
    }
  },
  readAll: async (req, res) => {
    console.log("GET Faktura request received:", req.body);

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
      console.log("req.body", req.body);
      const existingFaktura = await Faktura.findOne({
        userEmail: userEmail,
        invoiceNumber: invoiceNumber,
      });

      console.log("existingFaktura", existingFaktura);

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

const generateInvoiceNumber = async () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().slice(-2);
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");

  const latestInvoice = await Faktura.findOne({
    invoiceNumber: { $regex: `^${year}${month}` },
  })
    .sort({ invoiceNumber: -1 })
    .exec();

  if (!latestInvoice) {
    return `${year}${month}-001`;
  }

  const latestNumber = parseInt(latestInvoice.invoiceNumber.slice(-3));
  const nextNumber = (latestNumber + 1).toString().padStart(3, "0");

  return `${year}${month}-${nextNumber}`;
};
