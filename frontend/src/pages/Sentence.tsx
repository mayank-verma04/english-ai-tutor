import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, FileText, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/constants';

interface SentenceData {
  sentence: string;
  sequence: number;
  answer: string;
  grammar: string[];
}

const Sentence = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sentences, setSentences] = useState<SentenceData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProgressing, setIsProgressing] = useState(false);

  const module = searchParams.get('module') || 'comprehension';
  const level = searchParams.get('level') || 'beginner';

  const fetchSentences = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/lessons/sentence?module=${module}&level=${level}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sentences');
      }

      const data = await response.json();
      if (data.sentences && data.sentences.length > 0) {
        setSentences(data.sentences);
        setCurrentIndex(0);
        setShowAnswer(false);
      } else {
        toast({
          title: "No more sentences",
          description: "You've completed all sentences for this level!",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load sentences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    const currentSentence = sentences[currentIndex];
    if (!currentSentence) return;

    try {
      setIsProgressing(true);
      const token = localStorage.getItem('token');
      
      // Save progress
      const progressResponse = await fetch(`${API_BASE_URL}/progress/sentence`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          module,
          level,
          lastSeenSequence: currentSentence.sequence,
        }),
      });

      if (!progressResponse.ok) {
        throw new Error('Failed to save progress');
      }

      // Move to next sentence or fetch new batch
      if (currentIndex + 1 < sentences.length) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      } else {
        await fetchSentences();
      }
      
      toast({
        title: "Progress saved!",
        description: "Moving to next sentence.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProgressing(false);
    }
  };

  useEffect(() => {
    fetchSentences();
  }, [module, level]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const currentSentence = sentences[currentIndex];

  if (!currentSentence) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No sentences available</h2>
            <p className="text-muted-foreground mb-4">
              All sentences for this level have been completed!
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/comprehension')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Comprehension
            </Button>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize">
                {module}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {level}
              </Badge>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Sentence {currentIndex + 1} of {sentences.length}
              </span>
              <span className="text-sm text-muted-foreground">
                Sequence #{currentSentence.sequence}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / sentences.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Main Content */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center text-xl">
                Sentence Practice
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Sentence */}
              <div className="text-center">
                <div className="bg-muted/50 p-6 rounded-lg border-2 border-dashed border-muted-foreground/20">
                  <p className="text-lg leading-relaxed text-foreground">
                    {currentSentence.sentence}
                  </p>
                </div>
              </div>

              {/* Grammar Info */}
              {currentSentence.grammar && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-secondary-foreground">
                    Grammar Focus
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {currentSentence.grammar}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Answer Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-secondary-foreground">
                    Answer/Explanation
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="flex items-center gap-2"
                  >
                    {showAnswer ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Hide Answer
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        Show Answer
                      </>
                    )}
                  </Button>
                </div>
                
                {showAnswer && (
                  <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                    <p className="text-accent-foreground">{currentSentence.answer}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-center">
            <Button
              onClick={handleNext}
              disabled={isProgressing}
              className="flex items-center gap-2 px-8"
            >
              {isProgressing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Saving Progress...
                </>
              ) : (
                <>
                  Next Sentence
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sentence;