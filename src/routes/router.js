const express = require("express");
const router = express.Router();

const userAPI = require("./api/user");
const productAPI = require("./api/product");
const authAPI = require("./api/auth");
const uploadAPI = require("./api/upload");

router.use("/upload", uploadAPI);
router.use("/auth", authAPI);
router.use("/users", userAPI);
router.use("/products", productAPI);

module.exports = router;
