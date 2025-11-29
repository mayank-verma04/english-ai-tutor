import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Award, TrendingUp, BookOpen, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/constants';
import { Header } from '@/components/header';

const formatCriterionName = (name: string) => {
  return name.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const Essay = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const module = searchParams.get('module') || 'composition';
  const level = searchParams.get('level') || 'advanced';
  const sequence = searchParams.get('sequence') || '1';

  const [essay, setEssay] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);

  useEffect(() => {
    const fetchEssay = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/lessons/essays/one?module=${module}&level=${level}&sequence=${sequence}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.essay && data.essay.length > 0) {
          setEssay(data.essay[0].content.essays);
        }
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load essay', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchEssay();
  }, [module, level, sequence, toast]);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/composition/essays/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ module, level, sequence: parseInt(sequence), question: essay.prompt, answer }),
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
        title="Essay Writing" 
        subtitle={`Topic #${sequence}`}
        icon={BookOpen}
        iconColor="text-rose-500"
        iconBgColor="bg-rose-100 dark:bg-rose-900/30"
        backTo={`/essays?module=${module}&level=${level}`}
      />

      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        {loading || !essay ? (
           <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
        ) : (
          <div className="grid gap-6">
            <Card className="shadow-medium border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                     <Badge variant="outline" className="w-fit">Essay Topic</Badge>
                     {essay.timeLimit && <Badge variant="secondary" className="flex gap-1 items-center"><Clock className="w-3 h-3"/> {essay.timeLimit} mins</Badge>}
                  </div>
                  <CardTitle className="text-2xl leading-tight">{essay.title}</CardTitle>
                  <CardDescription className="text-lg font-medium text-foreground/80 mt-2 p-4 bg-muted/30 rounded-lg border border-border/50">
                    {essay.prompt}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Start your essay here..."
                  rows={20}
                  disabled={!!evaluation}
                  className="resize-none text-base bg-background/50 focus:bg-background leading-relaxed"
                />
                
                {!evaluation && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Word count: {answer.trim().split(/\s+/).filter(Boolean).length}</span>
                    <Button onClick={handleSubmit} disabled={submitting || !answer.trim()} size="lg" className="min-w-[150px]">
                      <Send className="w-4 h-4 mr-2" /> {submitting ? 'Evaluating...' : 'Submit Essay'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {evaluation && (
              <Card className="shadow-strong border-rose-500/20 bg-rose-50/10 dark:bg-rose-900/10 animate-scale-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
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

                  <Button onClick={() => navigate(`/essays?module=${module}&level=${level}`)} className="w-full" variant="secondary">
                    Back to Essays List
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

export default Essay;