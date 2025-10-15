//passage.tsx

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Volume2, CheckCircle, XCircle, Pause, Play } from 'lucide-react'; // Added Pause and Play
import { toast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/constants';

interface VocabularyItem {
  word: string;
  meaning: string;
  example: string;
}

interface Question {
  type: 'multiple_choice' | 'true_false' | 'fill_in_the_blank' | 'short_answer';
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
}

interface PassageData {
  _id: string;
  module: string;
  level: string;
  content: {
    passages: {
      sequence: number;
      title: string;
      passage: string;
      vocabulary: VocabularyItem[];
      questions: Question[];
      source: string;
    };
  };
}

const Passage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [passageData, setPassageData] = useState<PassageData | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- START: Edits for Text-to-Speech Control ---
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const toggleSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Speech Error",
        description: "Your browser does not support the Web Speech API.",
        variant: "destructive",
      });
      return;
    }

    if (isSpeaking) {
      // 1. If currently speaking (or paused), stop it
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeechUtterance(null);
    } else {
      // 2. Start new speech
      const newUtterance = new SpeechSynthesisUtterance(text);
      newUtterance.rate = 0.8;

      // Ensure it stops and resets state when done
      newUtterance.onend = () => {
        setIsSpeaking(false);
        setSpeechUtterance(null);
      };

      // Ensure state is reset if speech is stopped manually by the browser (e.g., closing the tab)
      newUtterance.onpause = () => {
        // We handle pause via cancel() which is treated as a stop for simplicity (stop/start from beginning)
        // If you want true pause/resume, you would use speechSynthesis.pause() and speechSynthesis.resume().
        // For the 'stop and restart from beginning' user request, we use cancel for the button click.
        setIsSpeaking(false);
        setSpeechUtterance(null);
      }
      
      window.speechSynthesis.speak(newUtterance);
      setIsSpeaking(true);
      setSpeechUtterance(newUtterance);
    }
  };

  // Clean up speech on component unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // --- END: Edits for Text-to-Speech Control ---


  const module = searchParams.get('module') || 'comprehension';
  const level = searchParams.get('level') || 'beginner';
  const sequence = searchParams.get('sequence') || '1';

  const fetchPassage = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE_URL}/lessons/passages/one?module=${module}&level=${level}&sequence=${sequence}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch passage');
      }

      const data = await response.json();
      if (data.passage && data.passage.length > 0) {
        setPassageData(data.passage[0]);
      } else {
        throw new Error('Passage not found');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load passage. Please try again.",
        variant: "destructive",
      });
      navigate('/passages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleSubmitAnswers = () => {
    setShowResults(true);
    // Here you could also save the quiz results to the backend
  };

  // Removed old speakText function as it is replaced by toggleSpeech

  const getScore = () => {
    if (!passageData?.content.passages.questions) return { correct: 0, total: 0 };
    
    const questions = passageData.content.passages.questions;
    const correct = questions.filter((q, index) => {
      const userAnswer = selectedAnswers[index];
      if (!userAnswer) return false;
      
      // Handle different question types
      if (q.type === 'fill_in_the_blank') {
        return userAnswer.toLowerCase().trim() === q.answer.toLowerCase().trim();
      }
      return userAnswer === q.answer;
    }).length;
    
    return { correct, total: questions.length };
  };

  useEffect(() => {
    fetchPassage();
  }, [module, level, sequence]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!passageData) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Passage not found</h2>
            <p className="text-muted-foreground mb-4">
              The requested passage could not be loaded.
            </p>
            <Button onClick={() => navigate('/passages')}>
              Back to Passages
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const passage = passageData.content.passages;
  const score = getScore();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(`/passages?module=${module}&level=${level}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Passages
            </Button>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize">
                {module}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {level}
              </Badge>
              <Badge variant="outline">#{passage.sequence}</Badge>
            </div>
          </div>

          {/* Passage Content */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-primary">
                  {passage.title}
                </CardTitle>
                {/* Text-to-Speech Button (Now using toggleSpeech) */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSpeech(passage.passage)} // Use the new function
                  className="p-2"
                >
                  {/* Change icon based on speaking state */}
                  {isSpeaking ? (
                    <>
                      <Pause className="w-5 h-5 mr-1" /> Stop Reading
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-5 h-5 mr-1" /> Read Passage
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-line">
                  {passage.passage}
                </p>
              </div>
              
              {passage.source && (
                <p className="text-sm text-muted-foreground mt-4 italic">
                  Source: {passage.source}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Vocabulary */}
          {passage.vocabulary && passage.vocabulary.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-secondary-foreground">
                  Key Vocabulary
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {passage.vocabulary.map((vocab, index) => (
                    <div key={index} className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold text-primary mb-1">{vocab.word}</h4>
                      <p className="text-sm text-foreground mb-2">{vocab.meaning}</p>
                      {vocab.example && (
                        <p className="text-xs text-muted-foreground italic">
                          Example: "{vocab.example}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Questions */}
          {passage.questions && passage.questions.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-secondary-foreground">
                    Comprehension Questions
                  </CardTitle>
                  {showResults && (
                    <Badge variant={score.correct === score.total ? "default" : "secondary"}>
                      Score: {score.correct}/{score.total}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                  {passage.questions.map((question, qIndex) => {
                    const renderQuestionInput = () => {
                      switch (question.type) {
                        case 'multiple_choice':
                          return (
                            <div className="space-y-2">
                              {question.options?.map((option, oIndex) => {
                                const isSelected = selectedAnswers[qIndex] === option;
                                const isCorrect = option === question.answer;
                                const isWrong = showResults && isSelected && !isCorrect;
                                
                                return (
                                  <label
                                    key={oIndex}
                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                      showResults
                                        ? isCorrect
                                          ? 'bg-green-50 border-green-200 text-green-800'
                                          : isWrong
                                          ? 'bg-red-50 border-red-200 text-red-800'
                                          : 'bg-muted/50 border-muted'
                                        : isSelected
                                        ? 'bg-primary/10 border-primary'
                                        : 'bg-muted/50 border-muted hover:bg-muted'
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name={`question-${qIndex}`}
                                      value={option}
                                      checked={isSelected}
                                      onChange={() => handleAnswerSelect(qIndex, option)}
                                      disabled={showResults}
                                      className="sr-only"
                                    />
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                      isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                                    }`}>
                                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                    <span className="flex-1">{option}</span>
                                    {showResults && isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                                    {showResults && isWrong && <XCircle className="w-5 h-5 text-red-600" />}
                                  </label>
                                );
                              })}
                            </div>
                          );

                        case 'true_false':
                          return (
                            <div className="space-y-2">
                              {['True', 'False'].map((option) => {
                                const isSelected = selectedAnswers[qIndex] === option;
                                const isCorrect = option === question.answer;
                                const isWrong = showResults && isSelected && !isCorrect;
                                
                                return (
                                  <label
                                    key={option}
                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                      showResults
                                        ? isCorrect
                                          ? 'bg-green-50 border-green-200 text-green-800'
                                          : isWrong
                                          ? 'bg-red-50 border-red-200 text-red-800'
                                          : 'bg-muted/50 border-muted'
                                        : isSelected
                                        ? 'bg-primary/10 border-primary'
                                        : 'bg-muted/50 border-muted hover:bg-muted'
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name={`question-${qIndex}`}
                                      value={option}
                                      checked={isSelected}
                                      onChange={() => handleAnswerSelect(qIndex, option)}
                                      disabled={showResults}
                                      className="sr-only"
                                    />
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                      isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                                    }`}>
                                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                    <span className="flex-1">{option}</span>
                                    {showResults && isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                                    {showResults && isWrong && <XCircle className="w-5 h-5 text-red-600" />}
                                  </label>
                                );
                              })}
                            </div>
                          );

                        case 'fill_in_the_blank':
                          const userAnswer = selectedAnswers[qIndex] || '';
                          const isCorrect = showResults && userAnswer.toLowerCase().trim() === question.answer.toLowerCase().trim();
                          const isWrong = showResults && userAnswer && !isCorrect;
                          
                          return (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={userAnswer}
                                onChange={(e) => handleAnswerSelect(qIndex, e.target.value)}
                                disabled={showResults}
                                placeholder="Type your answer here..."
                                className={`w-full p-3 border rounded-lg transition-colors ${
                                  showResults
                                    ? isCorrect
                                      ? 'bg-green-50 border-green-200 text-green-800'
                                      : isWrong
                                      ? 'bg-red-50 border-red-200 text-red-800'
                                      : 'bg-muted/50 border-muted'
                                    : 'border-muted focus:border-primary focus:outline-none'
                                }`}
                              />
                              {showResults && (
                                <div className="flex items-center gap-2 text-sm">
                                  {isCorrect ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-red-600" />
                                  )}
                                  <span className="text-muted-foreground">
                                    Correct answer: <strong>{question.answer}</strong>
                                  </span>
                                </div>
                              )}
                            </div>
                          );

                        case 'short_answer':
                          const shortAnswer = selectedAnswers[qIndex] || '';
                          
                          return (
                            <div className="space-y-2">
                              <textarea
                                value={shortAnswer}
                                onChange={(e) => handleAnswerSelect(qIndex, e.target.value)}
                                disabled={showResults}
                                placeholder="Write your answer here..."
                                rows={3}
                                className={`w-full p-3 border rounded-lg transition-colors resize-none ${
                                  showResults
                                    ? 'bg-muted/50 border-muted'
                                    : 'border-muted focus:border-primary focus:outline-none'
                                }`}
                              />
                              {showResults && (
                                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                                  <p className="text-sm text-blue-800">
                                    <strong>Sample answer:</strong> {question.answer}
                                  </p>
                                </div>
                              )}
                            </div>
                          );

                        default:
                          return null;
                      }
                    };

                    return (
                      <div key={qIndex} className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="text-xs mt-1">
                            {question.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                          <h4 className="font-medium text-foreground flex-1">
                            {qIndex + 1}. {question.question}
                          </h4>
                        </div>
                        
                        {renderQuestionInput()}
                        
                        {showResults && question.explanation && question.type !== 'short_answer' && (
                          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Explanation:</strong> {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                
                  {!showResults && (
                    <div className="flex justify-center pt-4">
                      <Button
                        onClick={handleSubmitAnswers}
                        disabled={Object.keys(selectedAnswers).length !== passage.questions.length}
                        className="px-8"
                      >
                        Submit Answers
                      </Button>
                    </div>
                  )}
                  
                  {showResults && (
                    <div className="flex justify-center pt-4">
                      <Button
                        onClick={() => {
                          setSelectedAnswers({});
                          setShowResults(false);
                        }}
                        variant="outline"
                        className="px-8"
                      >
                        Try Again
                      </Button>
                    </div>
                  )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Passage;