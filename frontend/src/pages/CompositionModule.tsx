import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PenTool, ArrowLeft, ChevronRight, Star } from 'lucide-react';

const CompositionModule = () => {
  const navigate = useNavigate();

  const handleTopicClick = (levelId, topic) => {
    const topicRoutes = {
      'Sentence Formation': '/sentence-formation',
      'Short Paragraphs': '/short-paragraphs',
      'Tone Practice': '/tone-practice',
      Letters: '/letters',
      Essays: '/essays',
      Reports: '/reports',
      'Persuasive Writing': '/persuasive-writing',
    };

    const route = topicRoutes[topic];
    if (route) {
      navigate(`${route}?module=composition&level=${levelId}`);
    }
  };

  const levels = [
    {
      id: 'beginner',
      name: 'Beginner',
      description: 'Learn basic sentence formation and short paragraph writing',
      topics: ['Sentence Formation', 'Short Paragraphs', 'Tone Practice'],
      color: 'text-beginner',
      bgColor: 'bg-success-soft',
    },
    {
      id: 'intermediate',
      name: 'Intermediate',
      description: 'Develop structured writing skills with varied tones',
      topics: ['Sentence Formation', 'Short Paragraphs', 'Tone Practice'],
      color: 'text-intermediate',
      bgColor: 'bg-warning-soft',
    },
    {
      id: 'advanced',
      name: 'Advanced',
      description:
        'Master formal writing: letters, essays, reports, and persuasion',
      topics: ['Letters', 'Essays', 'Reports', 'Persuasive Writing'],
      color: 'text-advanced',
      bgColor: 'bg-muted',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <header className="bg-white shadow-soft sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-composition rounded-xl flex items-center justify-center">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Composition Module
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Writing & Composition
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Develop writing skills through sentence formation, essays, letters,
            and creative composition
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          {levels.map((level, index) => (
            <Card
              key={level.id}
              className={`shadow-medium border-0 animate-fade-in-delay-${
                index * 100
              } hover:shadow-lg transition-shadow duration-200-${index * 100}`}
            >
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Star className={`${level.color}`} />
                  <div className="flex-1">
                    <CardTitle className="text-xl">
                      {level.name} Level
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {level.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap flex-col sm:flex-row gap-3 ">
                  {level.topics.map((topic) => (
                    <Button
                      key={topic}
                      variant="outline"
                      className="text-sm hover:shadow-soft transition-all duration-200 hover-scale px-6 py-3"
                      onClick={() => handleTopicClick(level.id, topic)}
                    >
                      {topic}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompositionModule;
