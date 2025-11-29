import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ChevronRight, Mic2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/constants';
import { Header } from '@/components/header';
import { Skeleton } from '@/components/ui/skeleton';

const TonePractice = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const module = searchParams.get('module') || 'composition';
  const level = searchParams.get('level') || 'beginner';

  const [tones, setTones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTones = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/lessons/tone-practice?module=${module}&level=${level}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTones(data.tones || []);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load tone practices', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchTones();
  }, [module, level, toast]);

  const handleToneClick = (sequence: number) => {
    navigate(`/tone-practice-detail?module=${module}&level=${level}&sequence=${sequence}`);
  };

  return (
    <div className="min-h-screen bg-gradient-soft transition-colors duration-300">
      <Header 
        title="Tone & Voice" 
        subtitle="Master nuances in writing"
        icon={Mic2}
        iconColor="text-purple-500"
        iconBgColor="bg-purple-100 dark:bg-purple-900/30"
        backTo="/composition"
      />

      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        {loading ? (
           <div className="grid gap-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
        ) : tones.length === 0 ? (
          <Card className="text-center p-8 bg-card/50 border-dashed">
            <CardContent>
              <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No practices available for this level yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {tones.map((tone, index) => (
              <Card
                key={tone.sequence}
                className="group cursor-pointer hover:shadow-lg hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 bg-card/80 backdrop-blur-sm"
                onClick={() => handleToneClick(tone.sequence)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">#{tone.sequence}</Badge>
                        {tone.tone && (
                          <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 hover:bg-purple-200 border-transparent">
                            {tone.tone}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                        {tone.title}
                      </CardTitle>
                    </div>
                    <div className="p-2 rounded-full bg-muted group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                       <ChevronRight className="w-4 h-4" />
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

export default TonePractice;