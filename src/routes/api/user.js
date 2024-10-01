const express = require("express");
const router = express.Router();

const {
  findUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../../controllers/user");
const { tokenValidation } = require("../../middlewares/auth.middleware");

router.get("/", tokenValidation, findUser);
router.get("/:id", tokenValidation, getUserById);
router.post("/", createUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
