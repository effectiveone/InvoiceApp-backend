const express = require("express");
const router = express.Router();
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tytuł twojego API",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"], // Plik zawiera Twoje ścieżki do plików z API
};

const specs = swaggerJsDoc(options);

router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(specs));

module.exports = router;
