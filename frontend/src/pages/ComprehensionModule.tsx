import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowLeft, ChevronRight, Star } from 'lucide-react';

const ComprehensionModule = () => {
  const navigate = useNavigate();

  const handleTopicClick = (levelId, topic) => {
    const topicRoutes = {
      Vocabulary: '/vocabulary',
      Sentences: '/sentence',
      Passages: '/passages',
    };

    const route = topicRoutes[topic];
    if (route) {
      navigate(`${route}?module=comprehension&level=${levelId}`);
    }
  };

  const levels = [
    {
      id: 'beginner',
      name: 'Beginner',
      description: 'Start with basic vocabulary and simple passages',
      topics: ['Vocabulary', 'Sentences', 'Passages'],
      color: 'text-beginner',
      bgColor: 'bg-success-soft',
    },
    {
      id: 'intermediate',
      name: 'Intermediate',
      description: 'Build comprehension skills with moderate complexity',
      topics: ['Vocabulary', 'Sentences', 'Passages'],
      color: 'text-intermediate',
      bgColor: 'bg-warning-soft',
    },
    {
      id: 'advanced',
      name: 'Advanced',
      description: 'Master complex texts and advanced vocabulary',
      topics: ['Vocabulary', 'Sentences', 'Passages'],
      color: 'text-advanced',
      bgColor: 'bg-muted',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <header className="bg-white shadow-soft border-b">
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
              <div className="w-10 h-10 bg-gradient-comprehension rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Comprehension Module
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Reading Comprehension
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Master reading comprehension through vocabulary building, sentence
            analysis, and passage understanding
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          {levels.map((level, index) => (
            <Card
              key={level.id}
              className={`shadow-medium border-0 animate-fade-in-delay-${
                index * 100
              } hover:shadow-lg transition-shadow duration-200`}
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
                {/* i want to add hover effect to the card */}
                <div className="flex flex-wrap flex-col sm:flex-row gap-3">
                  {level.topics.map((topic) => (
                    <Button
                      key={topic}
                      variant="outline"
                      // i want to remove hover effect from the button
                      className="text-sm transition-all duration-200 px-6 py-3"
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

export default ComprehensionModule;
