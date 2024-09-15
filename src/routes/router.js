const express = require("express");
const router = express.Router();

const userAPI = require("./api/user");
const productAPI = require("./api/product");

router.use("/users", userAPI);
router.use("/products", productAPI);

module.exports = router;
