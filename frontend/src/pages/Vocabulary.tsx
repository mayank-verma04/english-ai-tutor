import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookOpen, Volume2, Sparkles, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/constants';
import { Header } from '@/components/header';

interface VocabularyWord {
  word: string;
  sequence: number;
  meanings: {
    partOfSpeech: string;
    definition: string;
  }[];
  examples: string[];
}

const Vocabulary = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentWord, setCurrentWord] = useState<VocabularyWord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProgressing, setIsProgressing] = useState(false);

  const module = searchParams.get('module') || 'comprehension';
  const level = searchParams.get('level') || 'beginner';

  const fetchVocabulary = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE_URL}/lessons/vocab?module=${module}&level=${level}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch vocabulary');

      const data = await response.json();
      if (data.vocabulary && data.vocabulary.length > 0) {
        setCurrentWord(data.vocabulary[0]);
      } else {
        toast({
          title: 'Complete!',
          description: "You've mastered all words for this level.",
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load vocabulary.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (!currentWord) return;
    try {
      setIsProgressing(true);
      const token = localStorage.getItem('token');
      const progressResponse = await fetch(`${API_BASE_URL}/progress/vocabulary`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          module,
          level,
          lastSeenSequence: currentWord.sequence,
        }),
      });

      if (!progressResponse.ok) throw new Error('Failed to save progress');
      await fetchVocabulary();
      toast({ title: 'Saved', description: 'Progress updated successfully.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Could not save progress.', variant: 'destructive' });
    } finally {
      setIsProgressing(false);
    }
  };

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    fetchVocabulary();
  }, [module, level]);

  return (
    <div className="min-h-screen bg-gradient-soft transition-colors duration-300">
      <Header 
        title="Vocabulary Practice" 
        subtitle={`${module} • ${level}`}
        icon={BookOpen}
        iconColor="text-indigo-500"
        iconBgColor="bg-indigo-100 dark:bg-indigo-900/30"
        backTo="/comprehension"
      />

      <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="text-muted-foreground animate-pulse">Loading words...</p>
          </div>
        ) : !currentWord ? (
          <Card className="text-center p-8 border-dashed border-2 bg-card/50">
            <CardContent>
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">All Caught Up!</h2>
              <p className="text-muted-foreground mb-6">You have completed the vocabulary for this level.</p>
              <Button onClick={() => navigate('/dashboard')} variant="default">Return to Dashboard</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Flashcard */}
            <Card className="overflow-hidden border-border/60 shadow-strong bg-card/80 backdrop-blur-md">
              <div className="h-2 bg-gradient-primary w-full" />
              <CardHeader className="text-center pb-2 pt-8">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="relative group cursor-pointer" onClick={() => speakWord(currentWord.word)}>
                    <h1 className="text-5xl font-extrabold tracking-tight text-foreground transition-transform group-hover:scale-105">
                      {currentWord.word}
                    </h1>
                    <div className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Volume2 className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <Badge variant="outline" className="px-3 py-1 text-sm bg-background/50">
                    Word #{currentWord.sequence}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-8 p-6 md:p-8">
                {/* Meanings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Definitions</h3>
                  {currentWord.meanings.map((meaning, index) => (
                    <div key={index} className="flex gap-4 p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                      <Badge className="h-fit shrink-0 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                        {meaning.partOfSpeech}
                      </Badge>
                      <p className="text-lg leading-relaxed text-foreground/90">{meaning.definition}</p>
                    </div>
                  ))}
                </div>

                {/* Examples */}
                {currentWord.examples && currentWord.examples.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Contextual Examples</h3>
                    <div className="space-y-3">
                      {currentWord.examples.map((example, index) => (
                        <div key={index} className="pl-4 border-l-4 border-indigo-400 dark:border-indigo-600 py-1">
                          <p className="text-lg italic text-muted-foreground">"{example}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                onClick={handleNext}
                disabled={isProgressing}
                className="w-full md:w-auto min-w-[200px] shadow-lg hover:shadow-primary/25 transition-all text-base h-12 gap-2"
              >
                {isProgressing ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>Next Word <ArrowRight className="w-5 h-5" /></>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vocabulary;