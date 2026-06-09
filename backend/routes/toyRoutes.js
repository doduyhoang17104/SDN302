const express = require("express");
const router = express.Router();

const toyController = require("../controllers/toyController");
const verifyToken = require("../middleware/verifyToken");

router.post("/", verifyToken, toyController.createToy);

router.get("/my", verifyToken, toyController.getMyToys);

router.delete("/:id", verifyToken, toyController.deleteToy);

router.put("/:id", verifyToken, toyController.editToy);

router.get("/getAll", toyController.getAllToys);

router.get("/:toyId/owner", toyController.getOwnerByToyId);

router.get("/owner/:ownerId", toyController.getToyByOwnerId);
module.exports = router;