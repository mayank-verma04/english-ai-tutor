// routes/composition.js
const express = require("express");
const { submitComposition } = require("../controllers/compositionController");
const auth = require("../middleware/auth");

const router = express.Router();

// POST /api/composition/:step/submit
router.post("/:step/submit", auth, submitComposition);

module.exports = router;
