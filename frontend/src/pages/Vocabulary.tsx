import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, BookOpen, Volume2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/constants';

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

      if (!response.ok) {
        throw new Error('Failed to fetch vocabulary');
      }

      const data = await response.json();
      if (data.vocabulary && data.vocabulary.length > 0) {
        setCurrentWord(data.vocabulary[0]);
      } else {
        toast({
          title: 'No more vocabulary',
          description: "You've completed all vocabulary for this level!",
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load vocabulary. Please try again.',
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

      // Save progress
      const progressResponse = await fetch(
        `${API_BASE_URL}/progress/vocabulary`,
        {
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
        }
      );

      if (!progressResponse.ok) {
        throw new Error('Failed to save progress');
      }

      // Fetch next vocabulary
      await fetchVocabulary();

      toast({
        title: 'Progress saved!',
        description: 'Moving to next vocabulary word.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save progress. Please try again.',
        variant: 'destructive',
      });
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">
              No vocabulary available
            </h2>
            <p className="text-muted-foreground mb-4">
              All vocabulary for this level has been completed!
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

          {/* Main Content */}
          <Card className="mb-8">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-3 mb-2">
                <CardTitle className="text-3xl font-bold text-primary">
                  {currentWord.word}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => speakWord(currentWord.word)}
                  className="p-2"
                >
                  <Volume2 className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Word #{currentWord.sequence}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Meanings */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-secondary-foreground">
                  Meanings
                </h3>
                <div className="space-y-3">
                  {currentWord.meanings.map((meaning, index) => (
                    <div key={index} className="flex gap-3">
                      <Badge variant="outline" className="shrink-0">
                        {meaning.partOfSpeech}
                      </Badge>
                      <p className="text-foreground">{meaning.definition}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Examples */}
              {currentWord.examples && currentWord.examples.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-secondary-foreground">
                    Examples
                  </h3>
                  <div className="space-y-3">
                    {currentWord.examples.map((example, index) => (
                      <div
                        key={index}
                        className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary"
                      >
                        <p className="text-foreground italic">"{example}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                  Next Word
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

export default Vocabulary;
