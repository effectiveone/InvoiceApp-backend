const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const authRoutes = require("./routes/authRoutes");
const PORT = process.env.PORT || process.env.API_PORT;

const helmet = require("helmet");

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// register the routes
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "InvoiceApp",
      version: "1.0.0",
    },
  },
  apis: ["./routes/authRoutes.js"], // Ścieżka do twojego pliku z routerami
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Endpoint dla Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Podłączenie routerów
app.use("/api/auth", authRoutes);

const server = http.createServer(app);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("database connection failed. Server not started");
    console.error(err);
  });
