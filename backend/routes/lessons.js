// routes/lessons.js
const express = require("express");
const { getLessons, getNextVocab, getNextSentences, getPassages, getPassageBySequence, getNextSentenceFormation, getShortParagraphs, getShortParagraphBySequence, getTonePractice, getTonePracticeBySequence, getLetters, getLetterBySequence, getEssays, getEssayBySequence, getReports, getReportBySequence, getPersuasiveWritings, getPersuasiveWritingBySequence } = require("../controllers/lessonController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, getLessons);

router.get("/vocab", auth, getNextVocab);

router.get("/sentence", auth, getNextSentences);

router.get("/passages", auth, getPassages);
router.get("/passages/one", auth, getPassageBySequence);

router.get("/sentence-formation", auth, getNextSentenceFormation );

router.get("/short-paragraphs", auth, getShortParagraphs);
router.get("/short-paragraphs/one", auth, getShortParagraphBySequence);

router.get("/tone-practice", auth, getTonePractice);
router.get("/tone-practice/one", auth, getTonePracticeBySequence);

router.get("/letters", auth, getLetters);
router.get("/letters/one", auth, getLetterBySequence);

router.get("/essays", auth, getEssays);
router.get("/essays/one", auth, getEssayBySequence);

router.get("/reports", auth, getReports);
router.get("/reports/one", auth, getReportBySequence);

router.get("/persuasive-writing", auth, getPersuasiveWritings);
router.get("/persuasive-writing/one", auth, getPersuasiveWritingBySequence);

module.exports = router;
