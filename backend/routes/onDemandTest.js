// routes/onDemandTest.js
const express = require('express');
const {
  generateQuestion,
  evaluateAnswer,
  evaluateObjective,
} = require('../controllers/onDemandTestController');

const auth = require('../middleware/auth');

const router = express.Router();

router.post('/generate-question', auth, generateQuestion);

router.post('/evaluate-answer', auth, evaluateAnswer);

router.post('/evaluate-objective', auth, evaluateObjective);

module.exports = router;
