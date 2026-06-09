const express = require("express");
const router = express.Router();

const uploadController = require("../controllers/uploadImageController");
const upload = require("../middleware/upload");

router.post("/", upload.single("image"), uploadController.upload);

module.exports = router;