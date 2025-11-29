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
import { Rocket, Wand2, Sparkles, Loader2, Bot, CheckCircle, XCircle, ChevronRight, Repeat, FileText, Check } from 'lucide-react';
import { Header } from '@/components/header';
import { Badge } from '@/components/ui/badge';
const testTopics = [
  { value: "Main Idea and Key Details", label: "Main Idea & Key Details" },
  { value: "Making Inferences", label: "Making Inferences" },
  { value: "Understanding Author's Tone", label: "Understanding Author's Tone" },
  { value: "Paragraph Structuring", label: "Paragraph Structuring" },
  { value: "Formal Email Writing", label: "Formal Email Writing" },
  { value: "Persuasive Writing", label: "Persuasive Writing" },
  { value: "Descriptive Writing", label: "Descriptive Writing" },
];

const OnDemandTestPage = () => {
  const [viewState, setViewState] = useState('CONFIGURATION'); 
  const [config, setConfig] = useState({ level: '', topic: '', questionType: '' });
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const apiRequest = async (endpoint, method, body) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'An API error occurred');
      return data;
    } catch (error) {
      throw error;
    }
  };

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
      if (data.questions) setQuestions(data.questions);
      else if (data.question) setQuestions([data.question]);
      setViewState('TAKING_TEST');
    } catch (err) {
      toast({ variant: "destructive", title: "Failed", description: err.message });
      setViewState('CONFIGURATION');
    }
  };

  const handleSubmitTest = async () => {
    setViewState('EVALUATING');
    try {
      let evaluationResult;
      if (config.questionType === 'mcq') {
        const payload = questions.map((q, index) => ({ userAnswer: answers[index] || '', correctAnswer: q.correctAnswer }));
        evaluationResult = await apiRequest('/tests/evaluate-objective', 'POST', { questions: payload });
      } else {
        const payload = { question: questions[0].questionText, answer: answers[0] || '', level: config.level };
        evaluationResult = await apiRequest('/tests/evaluate-answer', 'POST', payload);
      }
      setResults(evaluationResult);
      setViewState('SHOWING_RESULTS');
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: err.message });
      setViewState('TAKING_TEST');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft transition-colors duration-300">
      <Header 
        title="On Demand Test" 
        subtitle="AI-Powered Skill Assessment"
        icon={Rocket}
        iconColor="text-red-500"
        iconBgColor="bg-red-100 dark:bg-red-900/30"
        backTo="/dashboard"
      />

      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in flex flex-col items-center">
        
        {/* CONFIGURATION STEP */}
        {viewState === 'CONFIGURATION' && (
          <Card className="w-full max-w-2xl shadow-strong border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Configure Your Test</CardTitle>
              <CardDescription>Customize the topic and difficulty to challenge yourself.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label>Difficulty Level</Label>
                <Select onValueChange={(v) => handleConfigChange('level', v)} value={config.level}>
                  <SelectTrigger className="bg-background"><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Topic</Label>
                <Select onValueChange={(v) => handleConfigChange('topic', v)} value={config.topic}>
                  <SelectTrigger className="bg-background"><SelectValue placeholder="Select topic" /></SelectTrigger>
                  <SelectContent>
                    {testTopics.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label>Question Type</Label>
                <RadioGroup value={config.questionType} onValueChange={(v) => handleConfigChange('questionType', v)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'mcq', label: 'Multiple Choice', icon: Check },
                    { id: 'short-answer', label: 'Short Answer', icon: FileText },
                    { id: 'essay', label: 'Essay', icon: FileText }
                  ].map((type) => (
                    <div key={type.id}>
                      <RadioGroupItem value={type.id} id={type.id} className="peer sr-only" />
                      <Label htmlFor={type.id} className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all">
                        <type.icon className="mb-2 h-6 w-6 text-muted-foreground peer-data-[state=checked]:text-primary" />
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg" onClick={handleGenerateTest} disabled={!config.level || !config.topic || !config.questionType} className="w-full text-base">
                <Wand2 className="mr-2 h-5 w-5" /> Generate My Test
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* LOADING STATES */}
        {(viewState === 'GENERATING' || viewState === 'EVALUATING') && (
          <div className="flex flex-col items-center gap-6 text-center py-20">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-card p-4 rounded-full shadow-lg border border-border">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">{viewState === 'GENERATING' ? 'Crafting Questions...' : 'Analyzing Responses...'}</h3>
              <p className="text-muted-foreground">Our AI is working its magic.</p>
            </div>
          </div>
        )}

        {/* TEST TAKING */}
        {viewState === 'TAKING_TEST' && (
          <Card className="w-full shadow-medium border-border/50">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <div className="flex justify-between items-center">
                 <div>
                    <CardTitle>Assessment in Progress</CardTitle>
                    <CardDescription className="mt-1">{config.topic} • {config.level}</CardDescription>
                 </div>
                 <Badge variant="outline" className="px-3 py-1 bg-background">
                    {questions.length} Question{questions.length > 1 ? 's' : ''}
                 </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 p-6">
              {questions.map((q, index) => (
                <div key={index} className="space-y-4 animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                  <div className="flex gap-4">
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {index + 1}
                    </span>
                    <div className="space-y-3 w-full">
                      <p className="font-medium text-lg">{q.questionText}</p>
                      {q.questionType === 'mcq' ? (
                        <RadioGroup onValueChange={(v) => handleAnswerChange(index, v)} className="space-y-2">
                          {q.options.map((option, i) => (
                            <div key={i} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                              <RadioGroupItem value={option} id={`q${index}-opt${i}`} />
                              <Label htmlFor={`q${index}-opt${i}`} className="flex-1 cursor-pointer font-normal text-base">{option}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      ) : (
                        <Textarea 
                          placeholder="Type your detailed answer here..." 
                          onChange={(e) => handleAnswerChange(index, e.target.value)} 
                          rows={q.questionType === 'essay' ? 8 : 4} 
                          className="text-base resize-y"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="bg-muted/20 p-6">
              <Button size="lg" onClick={handleSubmitTest} className="w-full">
                Submit Assessment <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* RESULTS */}
        {viewState === 'SHOWING_RESULTS' && results && (
          <div className="w-full space-y-6">
            <Card className="shadow-lg border-t-4 border-t-primary">
              <CardContent className="p-8 text-center space-y-6">
                 <div>
                    <p className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-2">Assessment Score</p>
                    <div className="flex items-baseline justify-center gap-2">
                       <span className="text-6xl font-extrabold text-primary">
                         {config.questionType === 'mcq' ? results.score : results.evaluation?.score}
                       </span>
                       <span className="text-2xl text-muted-foreground font-medium">
                         / {config.questionType === 'mcq' ? results.totalQuestions : 10}
                       </span>
                    </div>
                 </div>
                 
                 <Progress 
                    value={config.questionType === 'mcq' ? (results.score/results.totalQuestions)*100 : (results.evaluation?.score/10)*100} 
                    className="h-3 w-full max-w-md mx-auto" 
                 />

                 {results.evaluation?.feedback && (
                   <div className="bg-muted/30 p-6 rounded-xl text-left border border-border mt-4">
                      <h4 className="flex items-center gap-2 font-bold mb-2 text-foreground">
                        <Bot className="w-5 h-5 text-primary" /> AI Analysis
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">{results.evaluation.feedback}</p>
                   </div>
                 )}
              </CardContent>
            </Card>

            <Accordion type="single" collapsible className="w-full bg-card rounded-lg border border-border shadow-sm">
              {questions.map((q, index) => {
                const userAnswer = answers[index] || "No answer provided";
                const isCorrect = config.questionType === 'mcq' ? userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase() : null;
                return (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b last:border-0 px-4">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3 w-full text-left">
                        {config.questionType === 'mcq' && (
                          isCorrect 
                            ? <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" /> 
                            : <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        )}
                        <span className="font-medium truncate flex-1">{q.questionText}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-3">
                       <div className="grid gap-2">
                          <div className="p-3 bg-muted/50 rounded-md border border-border">
                             <span className="text-xs font-bold text-muted-foreground uppercase block mb-1">Your Answer</span>
                             <p>{userAnswer}</p>
                          </div>
                          {config.questionType === 'mcq' && !isCorrect && (
                             <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-md border border-green-200 dark:border-green-800">
                                <span className="text-xs font-bold text-green-700 dark:text-green-400 uppercase block mb-1">Correct Answer</span>
                                <p className="text-green-800 dark:text-green-300">{q.correctAnswer}</p>
                             </div>
                          )}
                       </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
            
            <div className="flex justify-center pt-4">
              <Button variant="outline" size="lg" onClick={resetTest} className="min-w-[200px]">
                <Repeat className="mr-2 h-4 w-4" /> Start New Test
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnDemandTestPage;