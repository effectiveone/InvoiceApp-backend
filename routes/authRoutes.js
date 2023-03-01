const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth/authControllers");
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});
const auth = require("../middleware/auth");
const danefirmyControllers = require("../controllers/danefirmy").controllers;
const fakturaControllers = require("../controllers/faktura").controllers;
const kontrahenciControllers =
  require("../controllers/kontrahenci").controllers;

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

// Faktura
router.post("/faktury", fakturaControllers.create);
router.get("/faktury/:id", fakturaControllers.read);
router.patch("/faktury/:id", fakturaControllers.update);
router.delete("/faktury/:id", fakturaControllers.delete);

// dane firmy routes
router.post("/dane-firmy", danefirmyControllers.create);
router.get("/dane-firmy/:id", danefirmyControllers.read);
router.patch("/dane-firmy/:id", danefirmyControllers.update);
router.delete("/dane-firmy/:id", danefirmyControllers.delete);

// kontrahent routes
router.post("/kontrahenci", kontrahenciControllers.create);
router.get("/kontrahenci/:id", kontrahenciControllers.read);
router.patch("/kontrahenci/:id", kontrahenciControllers.update);
router.delete("/kontrahenci/:id", kontrahenciControllers.delete);

// test route to verify if our middleware is working
router.get("/test", auth, (req, res) => {
  res.send("request passed");
});

module.exports = router;
