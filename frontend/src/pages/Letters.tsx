import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, ChevronRight, PenTool } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/constants';
import { Header } from '@/components/header';
import { Skeleton } from '@/components/ui/skeleton';

const Letters = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const module = searchParams.get('module') || 'composition';
  const level = searchParams.get('level') || 'advanced';

  const [letters, setLetters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLetters = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/lessons/letters?module=${module}&level=${level}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setLetters(data.letters || []);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load letters', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchLetters();
  }, [module, level, toast]);

  const handleLetterClick = (sequence: number) => {
    navigate(`/letter?module=${module}&level=${level}&sequence=${sequence}`);
  };

  return (
    <div className="min-h-screen bg-gradient-soft transition-colors duration-300">
      <Header 
        title="Letter Writing" 
        subtitle="Formal & Informal Correspondence"
        icon={Mail}
        iconColor="text-blue-500"
        iconBgColor="bg-blue-100 dark:bg-blue-900/30"
        backTo="/composition"
      />

      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        {loading ? (
          <div className="grid gap-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
        ) : letters.length === 0 ? (
          <Card className="text-center p-8 bg-card/50 border-dashed">
            <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No letter exercises available for this level yet.</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {letters.map((letter, index) => (
              <Card
                key={letter.sequence}
                className="group cursor-pointer hover:shadow-lg hover:border-blue-400/30 transition-all duration-300 hover:-translate-x-[-4px] bg-card/80 backdrop-blur-sm"
                onClick={() => handleLetterClick(letter.sequence)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="p-6">
                  <div className="flex justify-between items-center gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">#{letter.sequence}</Badge>
                        {letter.type && (
                          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-transparent hover:bg-blue-200">
                            {letter.type}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {letter.title}
                      </CardTitle>
                    </div>
                    <div className="p-2 rounded-full bg-muted group-hover:bg-blue-500 group-hover:text-white transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </div>
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