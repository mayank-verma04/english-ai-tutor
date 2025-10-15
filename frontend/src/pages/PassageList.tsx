import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/constants';

interface PassageItem {
  sequence: number;
  title: string;
}

const PassageList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [passages, setPassages] = useState<PassageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const module = searchParams.get('module') || 'comprehension';
  const level = searchParams.get('level') || 'beginner';

  const fetchPassages = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/lessons/passages?module=${module}&level=${level}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch passages');
      }

      const data = await response.json();
      setPassages(data.passages || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load passages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePassageClick = (sequence: number) => {
    navigate(`/passage?module=${module}&level=${level}&sequence=${sequence}`);
  };

  useEffect(() => {
    fetchPassages();
  }, [module, level]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
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

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Reading Passages</h1>
            <p className="text-muted-foreground">
              Choose a passage to practice your comprehension skills
            </p>
          </div>

          {/* Passages Grid */}
          {passages.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {passages.map((passage, index) => (
                <Card 
                  key={passage.sequence}
                  className="group hover:shadow-lg transition-all duration-200 cursor-pointer hover-scale"
                  onClick={() => handlePassageClick(passage.sequence)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <BookOpen className="w-8 h-8 text-primary shrink-0" />
                      <Badge variant="outline">#{passage.sequence}</Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <CardTitle className="text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {passage.title || `Passage ${passage.sequence}`}
                    </CardTitle>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Click to read
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">No passages available</h2>
                <p className="text-muted-foreground mb-4">
                  No passages found for this level. Check back later!
                </p>
                <Button onClick={() => navigate('/dashboard')}>
                  Return to Dashboard
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PassageList;