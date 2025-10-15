import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Lightbulb, Award, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/constants';

// Helper to format criteria names from snake_case to Title Case
const formatCriterionName = (name) => {
  return name
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const SentenceFormation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const module = searchParams.get('module') || 'composition';
  const level = searchParams.get('level') || 'beginner';

  const [exercise, setExercise] = useState(null);
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  useEffect(() => {
    fetchExercise();
  }, [module, level]);

  const fetchExercise = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${API_BASE_URL}/lessons/sentence-formation?module=${module}&level=${level}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.sentences && data.sentences.length > 0) {
        setExercise(data.sentences[0]);
        setAnswer('');
        setShowHint(false);
        setEvaluation(null);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load exercise',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim()) {
      toast({
        title: 'Error',
        description: 'Please write your sentence',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${API_BASE_URL}/composition/sentenceFormation/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            module,
            level,
            sequence: exercise.sequence,
            question: exercise.prompt,
            answer,
          }),
        }
      );
      const data = await res.json();
      setEvaluation(data.evaluation);

      toast({
        title: 'Submitted!',
        description: `You earned ${data.points.pointsAwarded} points!`,
        className: 'bg-success-soft',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit answer',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/progress/sentenceFormation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          module,
          level,
          lastSeenSequence: exercise.sequence,
        }),
      });
      fetchExercise();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update progress',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-soft">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No exercises available</p>
            <Button onClick={() => navigate('/composition')} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Composition
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="bg-white shadow-soft border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button variant="ghost" onClick={() => navigate('/composition')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Composition
            </Button>
            <div className="flex items-center gap-2">
              <Badge
                className={`bg-${
                  level === 'beginner'
                    ? 'success'
                    : level === 'intermediate'
                    ? 'warning'
                    : 'advanced'
                }-soft`}
              >
                {level}
              </Badge>
              <h1 className="text-lg font-semibold">Sentence Formation</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-medium">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">
                  Exercise #{exercise.sequence}
                </CardTitle>
                <CardDescription className="mt-2 text-base">
                  {exercise.prompt}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHint(!showHint)}
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                {showHint ? 'Hide' : 'Show'} Hint
              </Button>
            </div>

            {showHint && exercise.hint && (
              <div className="mt-4 p-4 bg-warning-soft rounded-lg">
                <p className="text-sm">
                  <strong>Hint:</strong> {exercise.hint}
                </p>
              </div>
            )}

            {exercise.grammar && exercise.grammar.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Grammar Focus:</p>
                <div className="flex flex-wrap gap-2">
                  {exercise.grammar.map((item: string, idx: number) => (
                    <Badge key={idx} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Sentence
              </label>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your sentence here..."
                rows={4}
                disabled={!!evaluation}
                className="resize-none"
              />
            </div>

            {!evaluation ? (
              <Button
                onClick={handleSubmit}
                disabled={submitting || !answer.trim()}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                {submitting ? 'Submitting...' : 'Submit for Evaluation'}
              </Button>
            ) : (
              <>
                <Card className="bg-gradient-soft border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      Evaluation Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-white rounded-lg">
                        <p className="text-sm text-muted-foreground">Score</p>
                        <p className="text-2xl font-bold text-primary">
                          {evaluation.score}/{evaluation.maxScore}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Performance
                        </p>
                        <p className="text-2xl font-bold text-success">
                          {Math.round(
                            (evaluation.score / evaluation.maxScore) * 100
                          )}
                          %
                        </p>
                      </div>
                    </div>

                    {/* === DYNAMIC RUBRIC DISPLAY === */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(evaluation.rubric).map(
                        ([criterion, score]) => (
                          <div
                            key={criterion}
                            className="text-center p-3 bg-white rounded-lg"
                          >
                            <p className="text-xs text-muted-foreground capitalize">
                              {formatCriterionName(criterion)}
                            </p>
                            <p className="text-lg font-semibold">{score}/10</p>
                          </div>
                        )
                      )}
                    </div>

                    <div className="p-4 bg-white rounded-lg">
                      <p className="text-sm font-medium flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4" />
                        Feedback
                      </p>
                      <div className="prose prose-sm max-w-none text-muted-foreground text-base">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {evaluation.feedback}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={handleNext} className="w-full" size="lg">
                  Next Exercise
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SentenceFormation;
