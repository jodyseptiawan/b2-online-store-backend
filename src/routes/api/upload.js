const express = require("express");
const { upload } = require("../../../helpers/uploadFile");
const { uploadFile } = require("../../controllers/upload");
const router = express.Router();

router.post("/", upload.single("file"), uploadFile);

module.exports = router;
