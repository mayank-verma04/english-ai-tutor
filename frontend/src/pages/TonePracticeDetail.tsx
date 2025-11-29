import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Award, TrendingUp, Mic2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/constants';
import { Header } from '@/components/header';

const formatCriterionName = (name: string) => {
  return name.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const TonePracticeDetail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const module = searchParams.get('module') || 'composition';
  const level = searchParams.get('level') || 'beginner';
  const sequence = searchParams.get('sequence') || '1';

  const [tone, setTone] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);

  useEffect(() => {
    const fetchTone = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/lessons/tone-practice/one?module=${module}&level=${level}&sequence=${sequence}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.tone && data.tone.length > 0) {
          setTone(data.tone[0].content.tones);
        }
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load tone practice', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchTone();
  }, [module, level, sequence, toast]);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/composition/tonePractice/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ module, level, sequence: parseInt(sequence), question: tone.prompt, answer }),
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
        title="Tone Practice" 
        subtitle={`Exercise #${sequence} • ${level}`}
        icon={Mic2}
        iconColor="text-purple-500"
        iconBgColor="bg-purple-100 dark:bg-purple-900/30"
        backTo={`/tone-practice?module=${module}&level=${level}`}
      />

      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        {loading || !tone ? (
          <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
        ) : (
          <div className="grid gap-6">
            <Card className="shadow-medium border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">Adjust the Tone</CardTitle>
                    <CardDescription className="text-base font-medium text-foreground/90">{tone.prompt}</CardDescription>
                  </div>
                  {tone.tone && (
                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 whitespace-nowrap px-3 py-1">
                      Target: {tone.tone}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Write your response here trying to match the target tone..."
                  rows={8}
                  disabled={!!evaluation}
                  className="resize-none text-base bg-background/50 focus:bg-background"
                />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                   <span>Word count: {answer.trim().split(/\s+/).filter(Boolean).length}</span>
                </div>

                {!evaluation && (
                  <Button onClick={handleSubmit} disabled={submitting || !answer.trim()} className="w-full md:w-auto min-w-[150px]">
                    <Send className="w-4 h-4 mr-2" /> {submitting ? 'Evaluating...' : 'Submit'}
                  </Button>
                )}
              </CardContent>
            </Card>

            {evaluation && (
              <Card className="shadow-strong border-purple-500/20 bg-purple-50/10 dark:bg-purple-900/10 animate-scale-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                    <Award className="w-6 h-6" /> Evaluation Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-card p-4 rounded-xl shadow-sm text-center border border-border/50">
                      <span className="text-xs text-muted-foreground uppercase font-bold">Score</span>
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

                  <Button onClick={() => navigate(`/tone-practice?module=${module}&level=${level}`)} className="w-full" variant="secondary">
                    Back to Tone Practice List
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

export default TonePracticeDetail;