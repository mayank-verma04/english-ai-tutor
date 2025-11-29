import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, FileText, Eye, EyeOff, CheckCircle2, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/constants';
import { Header } from '@/components/header';
import { Progress } from '@/components/ui/progress';

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

      if (!response.ok) throw new Error('Failed to fetch sentences');

      const data = await response.json();
      if (data.sentences && data.sentences.length > 0) {
        setSentences(data.sentences);
        setCurrentIndex(0);
        setShowAnswer(false);
      } else {
        toast({ title: "Complete", description: "You've completed all sentences for this level!" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load sentences.", variant: "destructive" });
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
      const progressResponse = await fetch(`${API_BASE_URL}/progress/sentence`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ module, level, lastSeenSequence: currentSentence.sequence }),
      });

      if (!progressResponse.ok) throw new Error('Failed to save progress');

      if (currentIndex + 1 < sentences.length) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      } else {
        await fetchSentences();
      }
      toast({ title: "Saved", description: "Progress saved successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Could not save progress.", variant: "destructive" });
    } finally {
      setIsProgressing(false);
    }
  };

  useEffect(() => {
    fetchSentences();
  }, [module, level]);

  const currentSentence = sentences[currentIndex];
  const progressPercentage = sentences.length > 0 ? ((currentIndex + 1) / sentences.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-soft transition-colors duration-300">
      <Header 
        title="Sentence Practice" 
        subtitle={`${level.charAt(0).toUpperCase() + level.slice(1)} Level`}
        icon={FileText}
        iconColor="text-cyan-500"
        iconBgColor="bg-cyan-100 dark:bg-cyan-900/30"
        backTo="/comprehension"
      />

      <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
        {isLoading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div></div>
        ) : !currentSentence ? (
          <Card className="text-center p-8 border-dashed bg-card/50">
            <CardContent>
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-xl font-bold">All Caught Up!</h2>
              <p className="text-muted-foreground mt-2 mb-6">You have completed all sentences for this level.</p>
              <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>Progress</span>
                <span>{currentIndex + 1} / {sentences.length}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            <Card className="shadow-strong border-border/60 bg-card/80 backdrop-blur-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-lg font-medium text-muted-foreground uppercase tracking-widest">
                  Exercise #{currentSentence.sequence}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-8 p-6 md:p-10">
                {/* Sentence Display */}
                <div className="bg-background/50 p-8 rounded-xl border border-border shadow-inner text-center">
                   <p className="text-2xl md:text-3xl font-serif leading-relaxed text-foreground">
                     {currentSentence.sentence}
                   </p>
                </div>

                {/* Grammar Tags */}
                {currentSentence.grammar && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {Array.isArray(currentSentence.grammar) ? currentSentence.grammar.map((g, i) => (
                      <Badge key={i} variant="secondary" className="px-3 py-1 text-sm bg-cyan-100/50 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800">
                        {g}
                      </Badge>
                    )) : (
                      <Badge variant="secondary">{currentSentence.grammar}</Badge>
                    )}
                  </div>
                )}

                {/* Interactive Answer Section */}
                <div className="space-y-4">
                  <Button
                    variant="ghost"
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="w-full h-12 border border-input hover:bg-accent hover:text-accent-foreground transition-all group"
                  >
                    {showAnswer ? (
                      <><EyeOff className="w-4 h-4 mr-2" /> Hide Explanation</>
                    ) : (
                      <><Eye className="w-4 h-4 mr-2" /> Reveal Explanation</>
                    )}
                  </Button>
                  
                  {showAnswer && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-100 dark:border-green-800 animate-accordion-down">
                      <p className="text-lg font-medium text-green-800 dark:text-green-300 text-center">
                        {currentSentence.answer}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center pt-2">
              <Button
                onClick={handleNext}
                disabled={isProgressing}
                size="lg"
                className="w-full md:w-auto min-w-[200px] shadow-lg"
              >
                {isProgressing ? (
                  <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <>Next Sentence <ArrowRight className="w-5 h-5 ml-2" /></>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sentence;