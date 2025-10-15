// config/scoringConfig.js
module.exports = {
  levelWeights: {
    beginner: 1.0,
    intermediate: 1.1,
    advanced: 1.2,
  },

  comprehension: {
    vocabulary: {
      maxScore: 10,
      evaluationCriteria: {
        contextual_appropriateness: 0.6,
        grammar: 0.4,
      },
    },
    sentence: {
      maxScore: 15,
      evaluationCriteria: {
        accuracy_of_interpretation: 0.7,
        clarity_of_explanation: 0.3,
      },
    },
    passage: {
      maxScore: 25,
      evaluationCriteria: {
        accuracy_of_summary: 0.5,
        clarity_of_expression: 0.3,
        grammar: 0.2,
      },
    },
  },

  composition: {
    sentenceFormation: {
      maxScore: 15,
      evaluationCriteria: {
        grammatical_correctness: 0.6,
        clarity_and_logic: 0.4,
      },
    },
    shortParagraphs: {
      maxScore: 25,
      evaluationCriteria: {
        topic_and_structure: 0.4,
        cohesion_and_flow: 0.3,
        grammar: 0.3,
      },
    },
    tonePractice: {
      maxScore: 25,
      evaluationCriteria: {
        tone_appropriateness: 0.5,
        vocabulary_choice: 0.3,
        clarity: 0.2,
      },
    },
    letters: {
      maxScore: 30,
      evaluationCriteria: {
        purpose_and_clarity: 0.4,
        format_and_convention: 0.3,
        tone_and_vocabulary: 0.3,
      },
    },
    essays: {
      maxScore: 50,
      evaluationCriteria: {
        thesis_and_argument: 0.3,
        structure_and_organization: 0.3,
        vocabulary_and_tone: 0.2,
        grammar_and_mechanics: 0.2,
      },
    },
    reports: {
      maxScore: 40,
      evaluationCriteria: {
        clarity_and_conciseness: 0.4,
        structure_and_formatting: 0.3,
        grammar_and_professionalism: 0.3,
      },
    },
    persuasiveWriting: {
      maxScore: 35,
      evaluationCriteria: {
        strength_of_argument: 0.5,
        evidence_and_support: 0.3,
        persuasive_tone_and_style: 0.2,
      },
    },
  },
};
