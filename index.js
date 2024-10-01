const express = require("express");
const rateLimit = require("express-rate-limit");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const { port } = require("./config");
const bodyParser = require("body-parser");
const routes = require("./src/routes/router");

// Define the rate limiting rule
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/uploads", express.static("uploads"));
app.use("/api", routes);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Online Store API",
      version: "1.0.0",
      description: "API Documentation",
      contact: {
        name: "Lulu",
        email: "lulu@store.online",
      },
      servers: [
        {
          url: "http://localhost:5001",
        },
      ],
    },
  },
  apis: ["./index.js"], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Register API route with Swagger documentation
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user with email, password, name, and role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: "yourpassword123"
 *               name:
 *                 type: string
 *                 description: The user's name.
 *                 example: "John Doe"
 *               role:
 *                 type: string
 *                 description: The user's role, either buyer or seller.
 *                 enum:
 *                   - buyer
 *                   - seller
 *                 example: "buyer"
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Invalid input data.
 */

// Login API route with Swagger documentation
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticate a user using their email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: "yourpassword123"
 *     responses:
 *       200:
 *         description: User authenticated successfully.
 *       401:
 *         description: Invalid credentials.
 *       400:
 *         description: Missing email or password.
 */

app.listen(port, () => {
  console.log(`Backend run port ${port}`);
});
