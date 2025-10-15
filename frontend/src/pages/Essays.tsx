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
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/constants';

const Essays = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const module = searchParams.get('module') || 'composition';
  const level = searchParams.get('level') || 'advanced';

  const [essays, setEssays] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEssays();
  }, [module, level]);

  const fetchEssays = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${API_BASE_URL}/lessons/essays?module=${module}&level=${level}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setEssays(data.essays || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load essays',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEssayClick = (sequence) => {
    navigate(`/essay?module=${module}&level=${level}&sequence=${sequence}`);
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
              <BookOpen className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-semibold">Essays</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Badge className="bg-muted">{level}</Badge>
        </div>

        {essays.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No essays available for this level
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {essays.map((essay) => (
              <Card
                key={essay.sequence}
                className="cursor-pointer hover:shadow-medium transition-all duration-200 hover-scale"
                onClick={() => handleEssayClick(essay.sequence)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">#{essay.sequence}</Badge>
                      </div>
                      <CardTitle className="text-lg">{essay.title}</CardTitle>
                      {essay.focus && essay.focus.length > 0 && (
                        <CardDescription className="mt-2">
                          Focus: {essay.focus.join(', ')}
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

export default Essays;
