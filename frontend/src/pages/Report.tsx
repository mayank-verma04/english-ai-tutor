import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Award, TrendingUp, ClipboardList, BarChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/constants';
import { Header } from '@/components/header';

const formatCriterionName = (name: string) => {
  return name.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const Report = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const module = searchParams.get('module') || 'composition';
  const level = searchParams.get('level') || 'advanced';
  const sequence = searchParams.get('sequence') || '1';

  const [report, setReport] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/lessons/reports/one?module=${module}&level=${level}&sequence=${sequence}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.report && data.report.length > 0) {
          setReport(data.report[0].content.reports);
        }
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load report', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [module, level, sequence, toast]);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/composition/reports/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ module, level, sequence: parseInt(sequence), question: report.prompt, answer }),
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
        title="Report Writing" 
        subtitle={`Task #${sequence}`}
        icon={ClipboardList}
        iconColor="text-slate-600 dark:text-slate-400"
        iconBgColor="bg-slate-100 dark:bg-slate-800"
        backTo={`/reports?module=${module}&level=${level}`}
      />

      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        {loading || !report ? (
           <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
        ) : (
          <div className="grid gap-6">
            <Card className="shadow-medium border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                     <Badge variant="outline">Formal Report</Badge>
                     {report.data && <Badge variant="secondary" className="flex gap-1 items-center"><BarChart className="w-3 h-3"/> Data Provided</Badge>}
                  </div>
                  <CardTitle className="text-xl">{report.title}</CardTitle>
                  <CardDescription className="text-base text-foreground/90 mt-2 p-4 bg-muted/30 rounded-lg border border-border/50 font-medium">
                    {report.prompt}
                  </CardDescription>
                  {report.data && (
                    <div className="mt-2 p-4 bg-background border border-border rounded-md text-sm font-mono text-muted-foreground whitespace-pre-wrap">
                      {report.data}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Title: ...&#10;Introduction: ...&#10;Findings: ...&#10;Conclusion: ..."
                  rows={15}
                  disabled={!!evaluation}
                  className="resize-none text-base bg-background/50 focus:bg-background"
                />
                
                {!evaluation && (
                  <div className="flex justify-end">
                    <Button onClick={handleSubmit} disabled={submitting || !answer.trim()} size="lg" className="min-w-[150px]">
                      <Send className="w-4 h-4 mr-2" /> {submitting ? 'Analyzing...' : 'Submit Report'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {evaluation && (
              <Card className="shadow-strong border-slate-500/20 bg-slate-50/10 dark:bg-slate-900/10 animate-scale-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Award className="w-6 h-6" /> Assessment
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

                  <Button onClick={() => navigate(`/reports?module=${module}&level=${level}`)} className="w-full" variant="secondary">
                    Back to Reports
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

export default Report;