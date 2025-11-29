import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronRight, Star, GraduationCap } from 'lucide-react';
import { Header } from '@/components/header';

const ComprehensionModule = () => {
  const navigate = useNavigate();

  const handleTopicClick = (levelId: string, topic: string) => {
    const topicRoutes: Record<string, string> = {
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
      color: 'text-green-600 dark:text-green-400',
      iconColor: 'text-green-600 dark:text-green-400',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      borderColor: 'hover:border-green-500/50',
    },
    {
      id: 'intermediate',
      name: 'Intermediate',
      description: 'Build comprehension skills with moderate complexity',
      topics: ['Vocabulary', 'Sentences', 'Passages'],
      color: 'text-yellow-600 dark:text-yellow-400',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
      borderColor: 'hover:border-yellow-500/50',
    },
    {
      id: 'advanced',
      name: 'Advanced',
      description: 'Master complex texts and advanced vocabulary',
      topics: ['Vocabulary', 'Sentences', 'Passages'],
      color: 'text-blue-600 dark:text-blue-400',
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      borderColor: 'hover:border-blue-500/50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft transition-colors duration-300">
      <Header 
        title="Comprehension Module" 
        subtitle="Reading & Listening Skills"
        icon={BookOpen}
        iconColor="text-blue-600 dark:text-blue-400"
        iconBgColor="bg-blue-100 dark:bg-blue-900/30"
        backTo="/dashboard"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="text-center mb-10 space-y-3">
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            Reading Comprehension
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Master language interpretation through structured vocabulary building, 
            sentence analysis, and passage understanding.
          </p>
        </div>

        <div className="grid gap-6">
          {levels.map((level, index) => (
            <Card
              key={level.id}
              className={`
                group border-border/60 shadow-sm hover:shadow-lg hover:shadow-primary/5 
                transition-all duration-300 transform hover:-translate-y-1
                bg-card/50 backdrop-blur-sm
                ${level.borderColor}
              `}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader>
                <div className="flex items-start sm:items-center gap-5">
                  <div className={`p-3 rounded-xl ${level.iconBg} ${level.iconColor} shadow-inner`}>
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <CardTitle className="text-xl flex items-center gap-2">
                      {level.name} Level
                      {level.id === 'advanced' && <GraduationCap className="w-4 h-4 text-muted-foreground" />}
                    </CardTitle>
                    <CardDescription className="text-base font-medium">
                      {level.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3 mt-2">
                  {level.topics.map((topic) => (
                    <Button
                      key={topic}
                      variant="outline"
                      className="
                        group/btn relative overflow-hidden
                        border-input bg-background/50 hover:bg-accent hover:text-accent-foreground
                        transition-all duration-300
                        pl-5 pr-4 py-5 h-auto text-sm font-medium
                      "
                      onClick={() => handleTopicClick(level.id, topic)}
                    >
                      <span className="relative z-10 flex items-center">
                        {topic}
                        <ChevronRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300" />
                      </span>
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