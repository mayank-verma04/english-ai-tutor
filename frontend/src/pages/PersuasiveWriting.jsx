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
import { ArrowLeft, Lightbulb, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/constants';

const PersuasiveWriting = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const module = searchParams.get('module') || 'composition';
  const level = searchParams.get('level') || 'advanced';

  const [writings, setWritings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWritings();
  }, [module, level]);

  const fetchWritings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${API_BASE_URL}/lessons/persuasive-writing?module=${module}&level=${level}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setWritings(data.persuasiveWritings || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load persuasive writings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWritingClick = (sequence) => {
    navigate(
      `/persuasive-writing-detail?module=${module}&level=${level}&sequence=${sequence}`
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
              <Lightbulb className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-semibold">Persuasive Writing</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Badge className="bg-muted">{level}</Badge>
        </div>

        {writings.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No persuasive writings available for this level
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {writings.map((writing) => (
              <Card
                key={writing.sequence}
                className="cursor-pointer hover:shadow-medium transition-all duration-200 hover-scale"
                onClick={() => handleWritingClick(writing.sequence)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">#{writing.sequence}</Badge>
                      </div>
                      <CardTitle className="text-lg">{writing.title}</CardTitle>
                      {writing.focus && writing.focus.length > 0 && (
                        <CardDescription className="mt-2">
                          Focus: {writing.focus.join(', ')}
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

export default PersuasiveWriting;
