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
import { ArrowLeft, MessageSquare, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/constants';

const TonePractice = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const module = searchParams.get('module') || 'composition';
  const level = searchParams.get('level') || 'beginner';

  const [tones, setTones] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTones();
  }, [module, level]);

  const fetchTones = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${API_BASE_URL}/lessons/tone-practice?module=${module}&level=${level}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setTones(data.tones || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load tone practices',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToneClick = (sequence: number) => {
    navigate(
      `/tone-practice-detail?module=${module}&level=${level}&sequence=${sequence}`
    );
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
              <MessageSquare className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-semibold">Tone Practice</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Badge
            variant="outline"
            className="mr-2 bg-primary-soft text-primary"
          >
            {level}
          </Badge>
        </div>

        {tones.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No tone practices available for this level
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {tones.map((tone) => (
              <Card
                key={tone.sequence}
                className="cursor-pointer hover:shadow-medium transition-all duration-200 hover-scale"
                onClick={() => handleToneClick(tone.sequence)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">#{tone.sequence}</Badge>
                        {tone.tone && (
                          <Badge
                            variant="secondary"
                            className="bg-primary-soft"
                          >
                            {tone.tone}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{tone.title}</CardTitle>
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

export default TonePractice;
