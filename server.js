const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const kontrahentRoutes = require('./routes/kontrahentRoutes');
const companyRoutes = require('./routes/companyRoutes');

const PORT = process.env.PORT || process.env.API_PORT;

const helmet = require('helmet');

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// register the routes
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'InvoiceApp',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'], // Ścieżka do wszystkich plików z routerami
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Endpoint dla Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Podłączenie routerów
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/kontrahent', kontrahentRoutes);
app.use('/api/company', companyRoutes);

const server = http.createServer(app);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('database connection failed. Server not started');
    console.error(err);
  });
