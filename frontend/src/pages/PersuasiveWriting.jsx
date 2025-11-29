import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/constants';
import { Header } from '@/components/header';
import { Skeleton } from '@/components/ui/skeleton';

const PersuasiveWriting = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const module = searchParams.get('module') || 'composition';
  const level = searchParams.get('level') || 'advanced';

  const [writings, setWritings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWritings = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/lessons/persuasive-writing?module=${module}&level=${level}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setWritings(data.persuasiveWritings || []);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load persuasive writings', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchWritings();
  }, [module, level, toast]);

  const handleWritingClick = (sequence) => {
    navigate(`/persuasive-writing-detail?module=${module}&level=${level}&sequence=${sequence}`);
  };

  return (
    <div className="min-h-screen bg-gradient-soft transition-colors duration-300">
      <Header 
        title="Persuasive Writing" 
        subtitle="Arguments & Influence"
        icon={Megaphone}
        iconColor="text-amber-500"
        iconBgColor="bg-amber-100 dark:bg-amber-900/30"
        backTo="/composition"
      />

      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        {loading ? (
          <div className="grid gap-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
        ) : writings.length === 0 ? (
          <Card className="text-center p-8 bg-card/50 border-dashed">
            <Megaphone className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No persuasive topics available for this level yet.</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {writings.map((writing, index) => (
              <Card
                key={writing.sequence}
                className="group cursor-pointer hover:shadow-lg hover:border-amber-400/30 transition-all duration-300 hover:-translate-x-[-4px] bg-card/80 backdrop-blur-sm"
                onClick={() => handleWritingClick(writing.sequence)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="p-6">
                  <div className="flex justify-between items-center gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">#{writing.sequence}</Badge>
                        {writing.focus && writing.focus.length > 0 && (
                          <div className="flex gap-1">
                             {writing.focus.slice(0, 2).map((f, i) => <Badge key={i} variant="secondary" className="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 text-[10px] px-1.5">{f}</Badge>)}
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-lg group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {writing.title}
                      </CardTitle>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-amber-500 transition-colors" />
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