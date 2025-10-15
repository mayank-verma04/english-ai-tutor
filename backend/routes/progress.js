// routes/progress.js
const express = require("express");
const { updateProgress } = require("../controllers/progressController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/:step", auth, updateProgress);

module.exports = router;
