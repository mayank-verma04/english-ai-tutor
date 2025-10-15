// controllers/lessonController.js
const Lesson = require("../models/Lesson");
const Progress = require("../models/Progress");

// GET all lessons with optional filters
exports.getLessons = async (req, res) => {
  try {
    const { module, level, unitNo, step } = req.query;
    const filter = {};
    if (module) filter.module = module;
    if (level) filter.level = level;
    if (unitNo) filter.unitNo = unitNo;
    if (step) filter.step = step;

    const lessons = await Lesson.find(filter);
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET Vocabulary based on user progress
exports.getNextVocab = async (req, res) => {
  try {
    const userId = req.user.id;
    const { module = "comprehension", level, limit = 1 } = req.query;

    // Find existing progress
    let progress = await Progress.findOne({ userId, module, level, step: "vocabulary" });
    let lastSeen = 0;
    if (progress) lastSeen = progress.lastSeenSequence;

    console.log(`User ${userId} last seen sequence: ${lastSeen}`);

    // Fetch next vocabulary
    const vocabList = await Lesson.aggregate([
      { $match: { module, level, step: "vocabulary" } },
      { $unwind: "$content.vocabulary" },
      { $match: { "content.vocabulary.sequence": { $gt: lastSeen } } },
      { $sort: { "content.vocabulary.sequence": 1 } },
      { $limit: parseInt(limit, 10) },
      {
        $project: {_id: 0, word: "$content.vocabulary.word", sequence: "$content.vocabulary.sequence", meanings: "$content.vocabulary.meanings", examples: { $ifNull: ["$content.vocabulary.examples", []] }
        }
      }
    ]);

    if (!vocabList || vocabList.length === 0) {
      return res.json({ msg: "No new vocabulary available", vocabulary: [] });
    }

    res.json({ vocabulary: vocabList });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET Sentences based on user progress
exports.getNextSentences = async (req, res) => {
  try {
    const userId = req.user.id;
    const { module = "comprehension", level, limit = 1 } = req.query;
    // Find existing progress
    let progress = await Progress.findOne({ userId, module, level, step: "sentence" });
    let lastSeen = 0;
    if (progress) lastSeen = progress.lastSeenSequence;
    console.log(`User ${userId} last seen sequence: ${lastSeen}`);
    // Fetch next sentences
    const sentenceList = await Lesson.aggregate([
      { $match: { module, level, step: "sentence" } },
      { $unwind: "$content.sentences" },
      { $match: { "content.sentences.sequence": { $gt: lastSeen } } },
      { $sort: { "content.sentences.sequence": 1 } },
      { $limit: parseInt(limit, 10) },
      { $project: {_id: 0, sentence: "$content.sentences.sentence", sequence: "$content.sentences.sequence", answer: "$content.sentences.answer", grammar: { $ifNull: ["$content.sentences.grammar", []] }
      } }
    ]);
    res.json({ sentences: sentenceList });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET All Passages
exports.getPassages = async (req, res) => {
  try {
    const { module = "comprehension", level } = req.query;
    const passages = await Lesson.aggregate([ 
      { $match: { module, level, step: "passage" } },
      { $unwind: "$content.passages" },
      { $project: { _id: 0, sequence: "$content.passages.sequence", title: "$content.passages.title" } },
      { $sort: { sequence: 1 } }
    ]);
    res.json({ passages });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET Passage by sequence number
exports.getPassageBySequence = async (req, res) => {
  try {
    const { module, level, sequence } = req.query;
    const passage = await Lesson.aggregate([
      { $match: { module, level, step: "passage" } },
      { $unwind: "$content.passages" },
      { $match: { "content.passages.sequence": parseInt(sequence, 10) } },
    ]);
    res.json({ passage });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET Sentences Formation
exports.getNextSentenceFormation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { module, level, limit = 1 } = req.query;
    // Find existing progress
    let progress = await Progress.findOne({ userId, module, level, step: "sentenceFormation" });
    let lastSeen = 0;
    if (progress) lastSeen = progress.lastSeenSequence;
    // Fetch next sentences
    const sentenceList = await Lesson.aggregate([
      { $match: { module, level, step: "sentenceFormation" } },
      { $unwind: "$content.sentences" },
      { $match: { "content.sentences.sequence": { $gt: lastSeen } } },
      { $sort: { "content.sentences.sequence": 1 } },
      { $limit: parseInt(limit, 10) },
      { $project: { prompt: "$content.sentences.prompt", sequence: "$content.sentences.sequence", hint: "$content.sentences.answer", grammar: { $ifNull: ["$content.sentences.grammar", []] }
      } }      
    ]);
    res.json({ sentences: sentenceList });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET All Short Paragraphs
exports.getShortParagraphs = async (req, res) => {
  try {
    const { module, level } = req.query;
    const paragraphs = await Lesson.aggregate([
      { $match: { module, level, step: "shortParagraphs" } },
      { $unwind: "$content.paragraphs" },
      { $project: { _id: 0, sequence: "$content.paragraphs.sequence", title: "$content.paragraphs.prompt", focus: { $ifNull: ["$content.paragraphs.grammar", []] } } },
      { $sort: { sequence: 1 } }
    ]);
    res.json({ paragraphs });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET Short Paragraph by sequence number
exports.getShortParagraphBySequence = async (req, res) => {
  try {
    const { module, level, sequence } = req.query;
    const paragraph = await Lesson.aggregate([
      { $match: { module, level, step: "shortParagraphs" } },
      { $unwind: "$content.paragraphs" },
      { $match: { "content.paragraphs.sequence": parseInt(sequence, 10) } },
    ]);
    res.json({ paragraph });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET All Tone Practice
exports.getTonePractice = async (req, res) => {
  try {
    const { module, level } = req.query;
    const tones = await Lesson.aggregate([
      { $match: { module, level, step: "tonePractice" } },
      { $unwind: "$content.tones" },
      { $project: { _id: 0, sequence: "$content.tones.sequence", title: "$content.tones.prompt", tone: { $ifNull: ["$content.tones.tone", []] } } },
      { $sort: { sequence: 1 } }
    ]);
    res.json({ tones });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
// GET Tone Practice by sequence number
exports.getTonePracticeBySequence = async (req, res) => {
  try {
    const { module, level, sequence } = req.query;
    const tone = await Lesson.aggregate([
      { $match: { module, level, step: "tonePractice" } },
      { $unwind: "$content.tones" },
      { $match: { "content.tones.sequence": parseInt(sequence, 10) } },
    ]);
    res.json({ tone });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET All Letters
exports.getLetters = async (req, res) => {
  try {
    const { module, level } = req.query;
    const letters = await Lesson.aggregate([
      { $match: { module, level, step: "letters" } },
      { $unwind: "$content.letters" },
      { $project: { _id: 0, sequence: "$content.letters.sequence", title: "$content.letters.prompt", type: "$content.letters.type", focus: { $ifNull: ["$content.letters.focus", []] } } },
      { $sort: { sequence: 1 } }
    ]);
    res.json({ letters });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET Letter by sequence number
exports.getLetterBySequence = async (req, res) => {
  try {
    const { module, level, sequence } = req.query;
    const letter = await Lesson.aggregate([
      { $match: { module, level, step: "letters" } },
      { $unwind: "$content.letters" },
      { $match: { "content.letters.sequence": parseInt(sequence, 10) } },
    ]);
    res.json({ letter });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET All Essays
exports.getEssays = async (req, res) => {
  try {
    const { module, level } = req.query;
    const essays = await Lesson.aggregate([
      { $match: { module, level, step: "essays" } },
      { $unwind: "$content.essays" },
      { $project: { _id: 0, sequence: "$content.essays.sequence", title: "$content.essays.prompt", focus: { $ifNull: ["$content.essays.focus", []] } } },
      { $sort: { sequence: 1 } }
    ]);
    res.json({ essays });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET Essay by sequence number
exports.getEssayBySequence = async (req, res) => {
  try {
    const { module, level, sequence } = req.query;
    const essay = await Lesson.aggregate([
      { $match: { module, level, step: "essays" } },
      { $unwind: "$content.essays" },
      { $match: { "content.essays.sequence": parseInt(sequence, 10) } },
    ]);
    res.json({ essay });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET All Reports
exports.getReports = async (req, res) => {
  try {
    const { module, level } = req.query;
    const reports = await Lesson.aggregate([
      { $match: { module, level, step: "reports" } },
      { $unwind: "$content.reports" },
      { $project: { _id: 0, sequence: "$content.reports.sequence", title: "$content.reports.prompt", focus: { $ifNull: ["$content.reports.focus", []] } } },
      { $sort: { sequence: 1 } }
    ]);
    res.json({ reports });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET Report by sequence number
exports.getReportBySequence = async (req, res) => {
  try {
    const { module, level, sequence } = req.query;
    const report = await Lesson.aggregate([
      { $match: { module, level, step: "reports" } },
      { $unwind: "$content.reports" },
      { $match: { "content.reports.sequence": parseInt(sequence, 10) } },
    ]);
    res.json({ report });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET All persuasiveWriting
exports.getPersuasiveWritings = async (req, res) => {
  try {
    const { module, level } = req.query;
    const persuasiveWritings = await Lesson.aggregate([
      { $match: { module, level, step: "persuasiveWriting" } },
      { $unwind: "$content.persuasiveWriting" },
      { $project: { _id: 0, sequence: "$content.persuasiveWriting.sequence", title: "$content.persuasiveWriting.prompt", focus: { $ifNull: ["$content.persuasiveWriting.focus", []] } } },
      { $sort: { sequence: 1 } }
    ]);
    res.json({ persuasiveWritings });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET persuasiveWriting by sequence number
exports.getPersuasiveWritingBySequence = async (req, res) => {
  try {
    const { module, level, sequence } = req.query;
    const persuasiveWriting = await Lesson.aggregate([
      { $match: { module, level, step: "persuasiveWriting" } },
      { $unwind: "$content.persuasiveWriting" },
      { $match: { "content.persuasiveWriting.sequence": parseInt(sequence, 10) } },
    ]);
    res.json({ persuasiveWriting });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};