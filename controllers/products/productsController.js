const Product = require("../../models/products");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

exports.createProduct = async (req, res) => {
  console.log("createProduct_req", req.body);
  try {
    const product = new Product(req.body);
    product.allowedUsers = [req.body.userEmail]; // dodaj adres e-mail użytkownika
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd serwera." });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const userProducts = await Product.find({ allowedUsers: req.body.mail }); // tylko produkty, do których użytkownik ma dostęp
    res.json(userProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd serwera." });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Nie znaleziono produktu." });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd serwera." });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      userEmail: req.body.userEmail,
    });
    if (!product) {
      return res.status(404).json({ message: "Nie znaleziono produktu." });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd serwera." });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Nie znaleziono produktu." });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Produkt usunięty." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd serwera." });
  }
};
