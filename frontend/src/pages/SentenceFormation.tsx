import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Lightbulb, Award, TrendingUp, PenTool, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/constants';
import { Header } from '@/components/header';
import { cn } from '@/lib/utils';

const formatCriterionName = (name: string) => {
  return name.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const SentenceFormation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const module = searchParams.get('module') || 'composition';
  const level = searchParams.get('level') || 'beginner';

  const [exercise, setExercise] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);

  useEffect(() => {
    fetchExercise();
  }, [module, level]);

  const fetchExercise = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/lessons/sentence-formation?module=${module}&level=${level}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.sentences && data.sentences.length > 0) {
        setExercise(data.sentences[0]);
        setAnswer('');
        setShowHint(false);
        setEvaluation(null);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load exercise', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/composition/sentenceFormation/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ module, level, sequence: exercise.sequence, question: exercise.prompt, answer }),
      });
      const data = await res.json();
      setEvaluation(data.evaluation);
      toast({ title: 'Submitted!', description: `You earned ${data.points.pointsAwarded} points!` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to submit answer', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/progress/sentenceFormation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ module, level, lastSeenSequence: exercise.sequence }),
      });
      fetchExercise();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update progress', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft transition-colors duration-300">
      <Header 
        title="Sentence Formation" 
        subtitle={`${level.charAt(0).toUpperCase() + level.slice(1)} • Exercise #${exercise?.sequence || 1}`}
        icon={PenTool}
        iconColor="text-orange-500"
        iconBgColor="bg-orange-100 dark:bg-orange-900/30"
        backTo="/composition"
      />

      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        {loading || !exercise ? (
           <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
        ) : (
          <div className="grid gap-6">
            {/* Question Card */}
            <Card className="shadow-medium border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                 <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-foreground">Write a sentence based on:</h2>
                      <p className="text-lg text-primary font-medium">{exercise.prompt}</p>
                    </div>
                    {exercise.hint && (
                      <Button variant="ghost" size="sm" onClick={() => setShowHint(!showHint)} className="text-muted-foreground hover:text-primary">
                        <Lightbulb className={cn("w-4 h-4 mr-2", showHint && "fill-yellow-400 text-yellow-400")} />
                        Hint
                      </Button>
                    )}
                 </div>
                 
                 {showHint && exercise.hint && (
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md text-sm text-yellow-800 dark:text-yellow-200 animate-slide-up">
                      {exercise.hint}
                    </div>
                  )}

                  {exercise.grammar && exercise.grammar.length > 0 && (
                    <div className="flex gap-2 mt-4">
                      {exercise.grammar.map((item: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="px-2 py-0.5 text-xs">{item}</Badge>
                      ))}
                    </div>
                  )}
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your sentence here..."
                    rows={4}
                    disabled={!!evaluation}
                    className="resize-none text-base bg-background/50 focus:bg-background transition-colors border-border/50 focus:border-primary"
                  />
                  {!evaluation && (
                    <Button onClick={handleSubmit} disabled={submitting || !answer.trim()} className="w-full md:w-auto min-w-[150px]">
                      {submitting ? 'Evaluating...' : <><Send className="w-4 h-4 mr-2" /> Submit</>}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Evaluation Result */}
            {evaluation && (
              <Card className="shadow-strong border-green-500/20 bg-green-50/10 dark:bg-green-900/10 animate-scale-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle2 className="w-6 h-6" /> Evaluation Complete
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Score Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-card p-4 rounded-xl shadow-sm text-center border border-border/50">
                       <span className="text-xs text-muted-foreground uppercase font-bold">Total Score</span>
                       <div className="text-3xl font-bold text-primary mt-1">{evaluation.score}/{evaluation.maxScore}</div>
                    </div>
                    {Object.entries(evaluation.rubric).map(([criterion, score]: [string, any]) => (
                      <div key={criterion} className="bg-card p-4 rounded-xl shadow-sm text-center border border-border/50">
                         <span className="text-xs text-muted-foreground uppercase font-bold truncate block">{formatCriterionName(criterion)}</span>
                         <div className="text-xl font-semibold mt-1">{score}/10</div>
                      </div>
                    ))}
                  </div>

                  {/* Feedback */}
                  <div className="bg-card p-6 rounded-xl border border-border/50">
                    <h3 className="flex items-center gap-2 font-semibold mb-3 text-foreground">
                      <TrendingUp className="w-4 h-4" /> AI Feedback
                    </h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{evaluation.feedback}</ReactMarkdown>
                    </div>
                  </div>

                  <Button onClick={handleNext} size="lg" className="w-full">Next Exercise <ArrowRight className="w-4 h-4 ml-2" /></Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SentenceFormation;