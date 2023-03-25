const express = require("express");
const router = express.Router();
const danefirmyControllers = require("../controllers/daneFirmy/daneFirmyController");
const fakturaControllers = require("../controllers/faktura/fakturaController");
const statsaControllers = require("../controllers/stats/statsController");

const kontrahenciControllers = require("../controllers/kontrahenci/kontrahenciController");
const productsControllers = require("../controllers/products/productsController");
const authControllers = require("../controllers/auth/authControllers");
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});
const auth = require("../middleware/auth");
const Setting = require("../models/settings");

router.put("/settings", async (req, res) => {
  console.log("zmiana danych", req.body);
  try {
    const setting = await Setting.findOneAndUpdate(
      { email: req.body.email },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(setting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/settings", async (req, res) => {
  try {
    const { email } = req.body;
    const settings = await Setting.findOne({ email });
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(12).required(),
  password: Joi.string().min(6).max(12).required(),
  mail: Joi.string().email().required(),
});

const loginSchema = Joi.object({
  password: Joi.string().min(6).max(12).required(),
  mail: Joi.string().email().required(),
});

router.post(
  "/register",
  validator.body(registerSchema),
  authControllers.controllers.postRegister
);
router.post(
  "/login",
  validator.body(loginSchema),
  authControllers.controllers.postLogin
);

router.post("/stats", statsaControllers.invoiceStats);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/products", auth, productsControllers.getProducts);

//Products
router.post("/product", productsControllers.createProduct);
router.post("/product", productsControllers.getProductById);
router.post("/product/:id", productsControllers.updateProduct);
router.delete("/product/:id", productsControllers.deleteProduct);

// Faktura
router.post("/invoiceAllNumber", fakturaControllers.checkAllNumber);

router.post("/invoiceNumber", fakturaControllers.checkNumber);
router.post("/faktury", fakturaControllers.create);
router.post("/get-faktury", fakturaControllers.readAll);
// router.get("/get-faktury/:id", fakturaControllers.readOne);
router.post("/edit-faktura", fakturaControllers.update);
router.delete("/faktury/:id", fakturaControllers.delete);

// dane firmy routes
router.put("/dane-firmy", danefirmyControllers.createOrUpdate);
router.post("/get-dane-firmy", danefirmyControllers.read);
router.patch("/dane-firmy", danefirmyControllers.update);
router.delete("/dane-firmy", danefirmyControllers.delete);

// kontrahent routes
router.post("/kontrahenci", kontrahenciControllers.create);
router.post("/get-kontrahenci", kontrahenciControllers.read);
router.patch("/kontrahenci/:id", kontrahenciControllers.update);
router.delete("/kontrahenci/:id", kontrahenciControllers.delete);

// test route to verify if our middleware is working
router.get("/test", auth, (req, res) => {
  res.send("request passed");
});

module.exports = router;
