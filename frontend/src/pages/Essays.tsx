import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/constants';
import { Header } from '@/components/header';
import { Skeleton } from '@/components/ui/skeleton';

const Essays = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const module = searchParams.get('module') || 'composition';
  const level = searchParams.get('level') || 'advanced';

  const [essays, setEssays] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEssays = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/lessons/essays?module=${module}&level=${level}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setEssays(data.essays || []);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load essays', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchEssays();
  }, [module, level, toast]);

  const handleEssayClick = (sequence: number) => {
    navigate(`/essay?module=${module}&level=${level}&sequence=${sequence}`);
  };

  return (
    <div className="min-h-screen bg-gradient-soft transition-colors duration-300">
      <Header 
        title="Essay Composition" 
        subtitle="Structured Long-form Writing"
        icon={BookOpen}
        iconColor="text-rose-500"
        iconBgColor="bg-rose-100 dark:bg-rose-900/30"
        backTo="/composition"
      />

      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        {loading ? (
          <div className="grid gap-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
        ) : essays.length === 0 ? (
          <Card className="text-center p-8 bg-card/50 border-dashed">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No essay topics available for this level yet.</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {essays.map((essay, index) => (
              <Card
                key={essay.sequence}
                className="group cursor-pointer hover:shadow-lg hover:border-rose-400/30 transition-all duration-300 hover:-translate-x-[-4px] bg-card/80 backdrop-blur-sm"
                onClick={() => handleEssayClick(essay.sequence)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="p-6">
                  <div className="flex justify-between items-center gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">#{essay.sequence}</Badge>
                        {essay.focus && essay.focus.length > 0 && (
                          <div className="flex gap-1">
                            {essay.focus.slice(0, 2).map((f: string, i: number) => (
                              <Badge key={i} variant="secondary" className="bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 text-[10px] px-1.5">{f}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-lg group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                        {essay.title}
                      </CardTitle>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-rose-500 transition-colors" />
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