import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Award, TrendingUp, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/constants';
import { Header } from '@/components/header';

const formatCriterionName = (name: string) => {
  return name.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const Letter = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const module = searchParams.get('module') || 'composition';
  const level = searchParams.get('level') || 'advanced';
  const sequence = searchParams.get('sequence') || '1';

  const [letter, setLetter] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);

  useEffect(() => {
    const fetchLetter = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/lessons/letters/one?module=${module}&level=${level}&sequence=${sequence}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.letter && data.letter.length > 0) {
          setLetter(data.letter[0].content.letters);
        }
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load letter', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchLetter();
  }, [module, level, sequence, toast]);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/composition/letters/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ module, level, sequence: parseInt(sequence), question: letter.prompt, answer }),
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

  return (
    <div className="min-h-screen bg-gradient-soft transition-colors duration-300">
      <Header 
        title="Letter Writing" 
        subtitle={`Exercise #${sequence}`}
        icon={Mail}
        iconColor="text-blue-500"
        iconBgColor="bg-blue-100 dark:bg-blue-900/30"
        backTo={`/letters?module=${module}&level=${level}`}
      />

      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        {loading || !letter ? (
           <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
        ) : (
          <div className="grid gap-6">
            <Card className="shadow-medium border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                     <Badge variant="outline" className="w-fit">{letter.type || 'General Letter'}</Badge>
                  </div>
                  <CardTitle className="text-xl">{letter.title}</CardTitle>
                  <CardDescription className="text-base text-foreground/90 mt-2 bg-muted/30 p-4 rounded-md border border-border/50">
                    {letter.prompt}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Dear Sir/Madam..."
                  rows={12}
                  disabled={!!evaluation}
                  className="resize-none text-base bg-background/50 focus:bg-background font-serif"
                />
                
                {!evaluation && (
                  <div className="flex justify-end">
                    <Button onClick={handleSubmit} disabled={submitting || !answer.trim()} className="min-w-[140px]">
                      <Send className="w-4 h-4 mr-2" /> {submitting ? 'Evaluating...' : 'Submit Letter'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {evaluation && (
              <Card className="shadow-strong border-blue-500/20 bg-blue-50/10 dark:bg-blue-900/10 animate-scale-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                    <Award className="w-6 h-6" /> Evaluation Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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

                  <div className="bg-card p-6 rounded-xl border border-border/50">
                    <h3 className="flex items-center gap-2 font-semibold mb-3">
                      <TrendingUp className="w-4 h-4" /> Feedback
                    </h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{evaluation.feedback}</ReactMarkdown>
                    </div>
                  </div>

                  <Button onClick={() => navigate(`/letters?module=${module}&level=${level}`)} className="w-full" variant="secondary">
                    Back to Letters List
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Letter;