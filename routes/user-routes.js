const express = require("express");
const {
  allUsers,
  idUser,
  createUser,
  editUser,
  deleteUser,
} = require("../controllers/user-controller");
const validate = require("../middlewares/validator");
const userSchema = require("../schemas/userSchema");
const checkUserId = require("../middlewares/checkUserId");

const router = express.Router();

router.get("", allUsers);

router.get("/:id", checkUserId, idUser);

router.post("", validate(userSchema), createUser);

router.put("/:id", checkUserId, editUser);

router.delete("/:id", checkUserId, deleteUser);

module.exports = router;
