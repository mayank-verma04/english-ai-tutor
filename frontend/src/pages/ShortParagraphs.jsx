import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ChevronRight, PenLine } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/constants';
import { Header } from '@/components/header';
import { Skeleton } from '@/components/ui/skeleton';

const ShortParagraphs = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const module = searchParams.get('module') || 'composition';
  const level = searchParams.get('level') || 'beginner';

  const [paragraphs, setParagraphs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchParagraphs = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/lessons/short-paragraphs?module=${module}&level=${level}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setParagraphs(data.paragraphs || []);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load paragraphs', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchParagraphs();
  }, [module, level, toast]);

  const handleParagraphClick = (sequence) => {
    navigate(`/short-paragraph?module=${module}&level=${level}&sequence=${sequence}`);
  };

  return (
    <div className="min-h-screen bg-gradient-soft transition-colors duration-300">
      <Header 
        title="Short Paragraphs" 
        subtitle="Practice concise writing"
        icon={PenLine}
        iconColor="text-teal-500"
        iconBgColor="bg-teal-100 dark:bg-teal-900/30"
        backTo="/composition"
      />

      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        {loading ? (
          <div className="grid gap-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
        ) : paragraphs.length === 0 ? (
          <Card className="text-center p-8 bg-card/50 border-dashed">
            <CardContent>
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No paragraphs available for this level yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {paragraphs.map((para, index) => (
              <Card
                key={para.sequence}
                className="group cursor-pointer hover:shadow-md hover:border-teal-500/30 transition-all duration-300 hover:-translate-x-[-4px] bg-card/80 backdrop-blur-sm"
                onClick={() => handleParagraphClick(para.sequence)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                       <div className="flex items-center gap-2">
                         <Badge variant="outline" className="font-mono text-xs">#{para.sequence}</Badge>
                         {para.focus && para.focus.length > 0 && (
                            <div className="flex gap-1">
                              {para.focus.map((f, i) => (
                                <Badge key={i} variant="secondary" className="text-[10px] px-1.5">{f}</Badge>
                              ))}
                            </div>
                         )}
                       </div>
                       <CardTitle className="text-lg group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                         {para.title}
                       </CardTitle>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-teal-500 transition-colors" />
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