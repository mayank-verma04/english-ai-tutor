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
import { ArrowLeft, FileText, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/constants';

const ShortParagraphs = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const module = searchParams.get('module') || 'composition';
  const level = searchParams.get('level') || 'beginner';

  const [paragraphs, setParagraphs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchParagraphs();
  }, [module, level]);

  const fetchParagraphs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${API_BASE_URL}/lessons/short-paragraphs?module=${module}&level=${level}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setParagraphs(data.paragraphs || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load paragraphs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleParagraphClick = (sequence) => {
    navigate(
      `/short-paragraph?module=${module}&level=${level}&sequence=${sequence}`
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
              <FileText className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-semibold">Short Paragraphs</h1>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Badge
            className={`bg-${
              level === 'beginner' ? 'success' : 'warning'
            }-soft`}
          >
            {level}
          </Badge>
        </div>

        {paragraphs.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No paragraphs available for this level
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {paragraphs.map((para) => (
              <Card
                key={para.sequence}
                className="cursor-pointer hover:shadow-medium transition-all duration-200 hover-scale"
                onClick={() => handleParagraphClick(para.sequence)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">#{para.sequence}</Badge>
                      </div>
                      <CardTitle className="text-lg">{para.title}</CardTitle>
                      {para.focus && para.focus.length > 0 && (
                        <CardDescription className="mt-2">
                          Focus: {para.focus.join(', ')}
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

export default ShortParagraphs;
