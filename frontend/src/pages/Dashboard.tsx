import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ModeToggle } from "@/components/mode-toggle"; // Ensure this is imported

import { 
  BookOpen, 
  PenTool, 
  Trophy, 
  Flame, 
  Star,
  ChevronRight,
  Target,
  Brain,
  Zap
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleModuleClick = (moduleId: string) => {
    if (moduleId === 'comprehension') {
      navigate('/comprehension');
    } else if (moduleId === 'composition') {
      navigate('/composition');
    }
  };

  const modules = [
    {
      id: 'comprehension',
      title: 'Comprehension',
      description: 'Enhance reading and listening skills with vocabulary, sentences, and passages',
      icon: BookOpen,
      gradient: 'bg-gradient-comprehension',
      bgSoft: 'bg-comprehension-soft',
      textColor: 'text-comprehension',
      topics: ['Vocabulary', 'Sentences', 'Passages']
    },
    {
      id: 'composition',
      title: 'Composition',
      description: 'Develop writing skills through sentences, paragraphs, letters, essays, and creative composition',
      icon: PenTool,
      gradient: 'bg-gradient-composition',
      bgSoft: 'bg-composition-soft',
      textColor: 'text-composition',
      topics: ['Sentence Formation', 'Short Paragraphs', 'Tone Practice', 'Letters', 'Essays', 'Reports', 'Persuasive Writing']
    }
  ];

  const stats = [
    { label: 'Current Streak', value: user?.streak.count || 0, icon: Flame, color: 'text-orange-500 dark:text-orange-400' },
    { label: 'Total Points', value: user?.points || 0, icon: Star, color: 'text-green-600 dark:text-green-400' },
    { label: 'Rank', value: user?.rank ? `#${user.rank}` : '-', icon: Trophy, color: 'text-blue-600 dark:text-blue-400' },
  ];

  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };

  return (
    <div className="min-h-screen bg-gradient-soft transition-colors duration-300">
      {/* Header - Fixed bg-white issue */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-md">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">English Tutor AI</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
               {/* Mode Toggle Positioned Here */}
              <ModeToggle />
              <Button variant="outline" onClick={logout} className="text-sm hover:bg-destructive/10 hover:text-destructive transition-colors">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        
        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card 
              key={stat.label} 
              className={`
                shadow-soft border-border/50
                relative overflow-hidden 
                transform transition-all duration-300 ease-in-out
                hover:scale-[1.03] hover:shadow-xl hover:border-primary/20
                cursor-default group
                bg-card/50 backdrop-blur-sm
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div 
                className={`
                  absolute inset-x-0 bottom-0 h-1 
                  ${stat.color.replace('text-', 'bg-')}
                  transform translate-y-full transition-transform duration-300 ease-out 
                  group-hover:translate-y-0
                `}
              ></div>
              
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl bg-muted/50 transition-colors duration-300 group-hover:bg-accent ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-extrabold text-foreground transition-all duration-300 ease-out">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Learning Modules */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Learning Modules</h2>
            </div>

            {modules.map((module, moduleIndex) => (
              <Card 
                key={module.id} 
                className="shadow-medium border-border/50 cursor-pointer hover:shadow-glow hover:border-primary/30 transition-all duration-300 hover:translate-x-1 group bg-card"
                onClick={() => handleModuleClick(module.id)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 ${module.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <module.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className='pb-2 text-xl'>{module.title}</CardTitle>
                      <CardDescription className="mt-1 text-base">{module.description}</CardDescription>
                    </div>
                    <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {module.topics.map((topic) => (
                      <Badge key={topic} variant="secondary" className="text-xs font-normal">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
              {/* Leaderboard Card */}
              <Card className="mt-14 border-border/50 shadow-medium hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start gap-x-4">
                    <div className="flex-shrink-0 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                      <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">Leaderboard</CardTitle>
                      <CardDescription className="mt-1">
                        Compete with others and earn your spot at the top!
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                   <div className="bg-muted/30 p-4 rounded-md text-sm text-muted-foreground">
                      Current Rank: <span className="font-bold text-foreground">{user?.rank ? `#${user.rank}` : 'Unranked'}</span>
                   </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full hover:bg-accent" onClick={handleViewLeaderboard}>
                    View Full Leaderboard
                  </Button>
                </CardFooter>
              </Card>
          </div>
        </div>

        {/* On Demand Tests */}
          <div className="space-y-6 mt-12">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">On-Demand Tests</h2>
            </div>
            <Card className="shadow-medium border-border/50 hover:shadow-glow transition-all duration-300 hover:border-primary/30 group bg-card">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-300">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className='pb-2 text-xl'>Skill Assessment</CardTitle>
                    <CardDescription className="mt-1 text-base">Test your knowledge with AI-generated quizzes tailored to your level.</CardDescription>
                  </div>
                  <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardHeader>
              <CardFooter>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white" onClick={() => navigate('/on-demand-test')}>
                  Start Assessment
                </Button>
              </CardFooter>
            </Card>
          </div>
      </div>

      {/* Footer - Fixed bg-white issue */}
      <footer className="bg-background border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} English Tutor AI. Excellence in Learning.</p>
          <div className="flex space-x-6">
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;