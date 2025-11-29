import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ChevronRight, BookOpenText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/constants';
import { Header } from '@/components/header';
import { Skeleton } from '@/components/ui/skeleton';

interface PassageItem {
  sequence: number;
  title: string;
}

const PassageList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [passages, setPassages] = useState<PassageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const module = searchParams.get('module') || 'comprehension';
  const level = searchParams.get('level') || 'beginner';

  const fetchPassages = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/lessons/passages?module=${module}&level=${level}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch passages');
      const data = await response.json();
      setPassages(data.passages || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load passages.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePassageClick = (sequence: number) => {
    navigate(`/passage?module=${module}&level=${level}&sequence=${sequence}`);
  };

  useEffect(() => {
    fetchPassages();
  }, [module, level]);

  return (
    <div className="min-h-screen bg-gradient-soft transition-colors duration-300">
      <Header 
        title="Reading Passages" 
        subtitle={`Select a story to begin • ${level}`}
        icon={BookOpenText}
        iconColor="text-pink-600 dark:text-pink-400"
        iconBgColor="bg-pink-100 dark:bg-pink-900/30"
        backTo="/comprehension"
      />

      <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             {[...Array(6)].map((_, i) => (
               <Card key={i} className="h-32 bg-card/50"><CardContent className="p-6"><Skeleton className="h-4 w-1/2 mb-4"/><Skeleton className="h-4 w-full"/></CardContent></Card>
             ))}
          </div>
        ) : passages.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {passages.map((passage, index) => (
              <Card 
                key={passage.sequence}
                className="group relative overflow-hidden cursor-pointer hover:shadow-xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 bg-card/80 backdrop-blur-sm"
                onClick={() => handlePassageClick(passage.sequence)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <CardContent className="p-6 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <Badge variant="outline" className="font-mono text-xs">#{passage.sequence}</Badge>
                    </div>
                    
                    <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {passage.title || `Untitled Passage ${passage.sequence}`}
                    </h3>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground font-medium mt-4 group-hover:translate-x-1 transition-transform">
                    Read Passage <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h2 className="text-xl font-semibold">No passages found</h2>
            <p className="text-muted-foreground mt-2">Check back later for new content.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PassageList;