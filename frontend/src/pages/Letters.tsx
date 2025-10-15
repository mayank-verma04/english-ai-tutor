import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/constants';

const Letters = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const module = searchParams.get('module') || 'composition';
  const level = searchParams.get('level') || 'advanced';

  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLetters();
  }, [module, level]);

  const fetchLetters = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${API_BASE_URL}/lessons/letters?module=${module}&level=${level}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setLetters(data.letters || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load letters',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLetterClick = (sequence) => {
    navigate(`/letter?module=${module}&level=${level}&sequence=${sequence}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-soft">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
              <Mail className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-semibold">Letters</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Badge className="bg-muted">{level}</Badge>
        </div>

        {letters.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No letters available for this level
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {letters.map((letter) => (
              <Card
                key={letter.sequence}
                className="cursor-pointer hover:shadow-medium transition-all duration-200 hover-scale"
                onClick={() => handleLetterClick(letter.sequence)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">#{letter.sequence}</Badge>
                        {letter.type && (
                          <Badge className="bg-primary-soft">
                            {letter.type}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{letter.title}</CardTitle>
                      {letter.focus && letter.focus.length > 0 && (
                        <CardDescription className="mt-2">
                          Focus: {letter.focus.join(', ')}
                        </CardDescription>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Letters;
