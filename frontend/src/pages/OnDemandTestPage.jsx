import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/constants';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Rocket, Wand2, Sparkles, Loader2, Bot, CheckCircle, XCircle, ChevronRight, Repeat } from 'lucide-react';

// --- Data for the forms ---
const testTopics = [
  { value: "Main Idea and Key Details", label: "Main Idea & Key Details (Comprehension)" },
  { value: "Making Inferences", label: "Making Inferences (Comprehension)" },
  { value: "Understanding Author's Tone", label: "Understanding Author's Tone (Comprehension)" },
  { value: "Paragraph Structuring", label: "Paragraph Structuring (Composition)" },
  { value: "Formal Email Writing", label: "Formal Email Writing (Composition)" },
  { value: "Persuasive Writing", label: "Persuasive Writing (Composition)" },
  { value: "Descriptive Writing", label: "Descriptive Writing (Composition)" },
];

const OnDemandTestPage = () => {
  // --- State Management ---
  const [viewState, setViewState] = useState('CONFIGURATION'); // CONFIGURATION, GENERATING, TAKING_TEST, EVALUATING, SHOWING_RESULTS
  const [config, setConfig] = useState({ level: '', topic: '', questionType: '' });
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const { toast } = useToast();

  const navigate = useNavigate();

  // --- API Call Helper ---
  const apiRequest = async (endpoint, method, body) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'An API error occurred');
      }
      return data;
    } catch (error) {
      console.error("API Request Error:", error);
      throw error; // Re-throw to be caught by the calling function
    }
  };

  // --- Core Logic Functions ---
  const handleConfigChange = (field, value) => setConfig(prev => ({ ...prev, [field]: value }));
  const handleAnswerChange = (index, value) => setAnswers(prev => ({ ...prev, [index]: value }));

  const resetTest = () => {
    setViewState('CONFIGURATION');
    setConfig({ level: '', topic: '', questionType: '' });
    setQuestions([]);
    setAnswers({});
    setResults(null);
  };

  const handleGenerateTest = async () => {
    setViewState('GENERATING');
    try {
      const data = await apiRequest('/tests/generate-question', 'POST', config);
      if (data.questions) {
        setQuestions(data.questions);
      } else if (data.question) {
        setQuestions([data.question]);
      }
      setViewState('TAKING_TEST');
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Test Generation Failed",
        description: err.message,
      });
      setViewState('CONFIGURATION');
    }
  };

  const handleSubmitTest = async () => {
    setViewState('EVALUATING');
    try {
      let evaluationResult;
      const { questionType } = config;

      if (questionType === 'mcq') {
        const payload = questions.map((q, index) => ({
          userAnswer: answers[index] || '',
          correctAnswer: q.correctAnswer,
        }));
        evaluationResult = await apiRequest('/tests/evaluate-objective', 'POST', { questions: payload });
      } else {
        const payload = {
          question: questions[0].questionText,
          answer: answers[0] || '',
          level: config.level,
        };
        evaluationResult = await apiRequest('/tests/evaluate-answer', 'POST', payload);
      }
      setResults(evaluationResult);
      setViewState('SHOWING_RESULTS');
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Evaluation Failed",
        description: err.message,
      });
      setViewState('TAKING_TEST');
    }
  };

  // --- Render Functions for UI ---
  const renderConfiguration = () => (
    <Card className="w-full max-w-2xl animate-in fade-in-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary" /> Create Your On-Demand Test</CardTitle>
        <CardDescription>Select your preferences and let our AI generate a custom test for you.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Difficulty Level</Label>
          <Select onValueChange={(value) => handleConfigChange('level', value)} value={config.level}>
            <SelectTrigger><SelectValue placeholder="Select a level" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Topic</Label>
          <Select onValueChange={(value) => handleConfigChange('topic', value)} value={config.topic}>
            <SelectTrigger><SelectValue placeholder="Select a topic" /></SelectTrigger>
            <SelectContent>
              {testTopics.map(topic => <SelectItem key={topic.value} value={topic.value}>{topic.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Question Type</Label>
          <RadioGroup value={config.questionType} onValueChange={(value) => handleConfigChange('questionType', value)} className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2"><RadioGroupItem value="mcq" id="mcq" /><Label htmlFor="mcq">Multiple Choice</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="short-answer" id="short" /><Label htmlFor="short">Short Answer</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="essay" id="essay" /><Label htmlFor="essay">Essay</Label></div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateTest} disabled={!config.level || !config.topic || !config.questionType} className="w-full">
          <Wand2 className="mr-2 h-4 w-4" /> Generate Test
        </Button>
      </CardFooter>
    </Card>
  );

  const renderLoading = (text) => (
    <div className="flex flex-col items-center gap-4 text-center animate-in fade-in-50">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-lg font-semibold text-muted-foreground">{text}</p>
    </div>
  );
  
  const renderTestTaking = () => (
    <Card className="w-full max-w-3xl animate-in fade-in-50">
      <CardHeader>
        <CardTitle>On-Demand Test</CardTitle>
        <CardDescription>Answer the questions below to the best of your ability.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {questions.map((q, index) => (
          <div key={index} className="space-y-3">
            <p className="font-semibold">{index + 1}. {q.questionText}</p>
            {q.questionType === 'mcq' && (
              <RadioGroup onValueChange={(value) => handleAnswerChange(index, value)}>
                {q.options.map((option, i) => (
                  <div key={i} className="flex items-center space-x-2"><RadioGroupItem value={option} id={`q${index}-opt${i}`} /><Label htmlFor={`q${index}-opt${i}`}>{option}</Label></div>
                ))}
              </RadioGroup>
            )}
            {(q.questionType === 'short-answer' || q.questionType === 'essay') && <Textarea placeholder="Type your answer here..." onChange={(e) => handleAnswerChange(index, e.target.value)} rows={q.questionType === 'essay' ? 10 : 3} />}
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmitTest} className="w-full"><ChevronRight className="mr-2 h-4 w-4" /> Submit for Evaluation</Button>
      </CardFooter>
    </Card>
  );

  const renderResults = () => {
    const isObjective = config.questionType === 'mcq';
    const score = isObjective ? results.score : results.evaluation?.score;
    const total = isObjective ? results.totalQuestions : 10;
    const percentage = total > 0 ? (score / total) * 100 : 0;
    
    return (
      <div className="w-full max-w-3xl space-y-6 animate-in fade-in-50">
        <Card>
          <CardHeader><CardTitle>Test Results</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">YOUR SCORE</p>
              <p className="text-6xl font-bold text-primary">{score}<span className="text-3xl text-muted-foreground">/{total}</span></p>
            </div>
            <Progress value={percentage} className="w-full" />
          </CardContent>
        </Card>

        {results.evaluation?.feedback && (
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Bot /> AI Feedback</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">{results.evaluation.feedback}</p></CardContent></Card>
        )}

        <Card><CardHeader><CardTitle>Question Breakdown</CardTitle></CardHeader><CardContent><Accordion type="single" collapsible>
          {questions.map((q, index) => {
            const userAnswer = answers[index] || "No answer provided";
            const isCorrect = isObjective ? userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase() : null;
            return (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger><div className="flex items-center gap-3 w-full">
                  {isObjective && (isCorrect ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />)}
                  <span className="flex-1 text-left">Question {index + 1}</span>
                </div></AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p className="font-semibold">{q.questionText}</p>
                  <div><p className="text-sm font-bold">Your Answer:</p><p className="text-muted-foreground p-2 bg-muted rounded-md">{userAnswer}</p></div>
                  {isObjective && !isCorrect && <div><p className="text-sm font-bold text-green-600">Correct Answer:</p><p className="text-muted-foreground p-2 bg-muted rounded-md">{q.correctAnswer}</p></div>}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion></CardContent></Card>
        
        <Button onClick={resetTest} className="w-full"><Repeat className="mr-2 h-4 w-4" /> Take Another Test</Button>
      </div>
    );
  };
  
  return (
    <>
    {/* Header */}
          <header className="bg-white shadow-soft border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                  </Button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 border-2 rounded-xl flex items-center justify-center">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-foreground">On Demand Test</h1>
                  </div>
                </div>
              </div>
            </div>
          </header>    
    <main className="bg-background flex flex-col items-center p-4">
      {viewState === 'CONFIGURATION' && renderConfiguration()}
      {viewState === 'GENERATING' && renderLoading('AI is crafting your personalized test...')}
      {viewState === 'TAKING_TEST' && renderTestTaking()}
      {viewState === 'EVALUATING' && renderLoading('Evaluating your answers...')}
      {viewState === 'SHOWING_RESULTS' && renderResults()}
    </main>
    </>
  );
};

export default OnDemandTestPage;