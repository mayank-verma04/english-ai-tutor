import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { 
  BookOpen, 
  PenTool, 
  Trophy, 
  Flame, 
  Star,
  ChevronRight,
  Award,
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
    { label: 'Current Streak', value: user?.streak.count || 0, icon: Flame, color: 'text-warning' },
    { label: 'Total Points', value: user?.points || 0, icon: Star, color: 'text-success' },
    { label: 'Rank', value: user?.rank ? `#${user.rank}` : '-', icon: Trophy, color: 'text-primary' },
  ];

  const achievements = [
    { title: 'First Steps', description: 'Complete your first lesson', earned: true },
    { title: 'Vocabulary Master', description: 'Learn 50 new words', earned: true },
    { title: 'Writing Wizard', description: 'Submit 10 compositions', earned: false },
    { title: 'Streak Champion', description: 'Maintain a 7-day streak', earned: user?.streak.count >= 7 },
  ];

  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <header className="bg-white shadow-soft border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">English Tutor AI</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* <span className="text-sm text-muted-foreground">Welcome back, {user?.name}!</span> */}
              <Button variant="outline" onClick={logout} className="text-sm hover:bg-red-100 hover:border-red-200 hover:text-black transition-all duration-200">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* STATS OVERVIEW WITH MODERN HOVER EFFECT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card 
              key={stat.label} 
              className={`
                shadow-soft border-0 
                relative overflow-hidden 
                transform transition-all duration-300 ease-in-out // Enables smooth animation
                hover:scale-[1.03] hover:shadow-xl // The "Lift" effect
                cursor-default group // 'group' enables animated child elements
                animate-fade-in-delay-${index * 100}
              `}
            >
              {/* The Animated Bottom Border/Glow Bar */}
              <div 
                className={`
                  absolute inset-x-0 bottom-0 h-1 
                  ${stat.color.replace('text-', 'bg-')} // Converts text-warning to bg-warning, etc.
                  transform translate-y-full transition-transform duration-300 ease-out 
                  group-hover:translate-y-0 // Slides the bar up on hover
                `}
              ></div>
              
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  {/* Icon Area: Updated padding and group-hover effect */}
                  <div className={`p-3 rounded-xl bg-muted transition-colors duration-300 group-hover:bg-gray-100 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    {/* Value text: Larger and bolder */}
                    <p className="text-3xl font-extrabold text-foreground transition-all duration-300 ease-out">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* ------------------------------------------------------------------- */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Learning Modules */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-2 mb-6">
              <Target className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Learning Modules</h2>
            </div>

            {modules.map((module, moduleIndex) => (
              <Card 
                key={module.id} 
                className={`shadow-medium border-0 animate-fade-in-delay-${moduleIndex * 100} cursor-pointer hover:shadow-glow transition-all duration-300 hover-scale`}
                onClick={() => handleModuleClick(module.id)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 ${module.gradient} rounded-xl flex items-center justify-center shadow-glow`}>
                      <module.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className='pb-2'>{module.title}</CardTitle>
                      <CardDescription className="mt-1">{module.description}</CardDescription>
                    </div>
                    <ChevronRight className="w-6 h-6 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {module.topics.map((topic) => (
                      <Badge key={topic} variant="outline" className="text-xs">
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
              <Card className="mt-16">
                <CardHeader>
                  <div className="flex items-start gap-x-4">
                    <div className="flex-shrink-0 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <Trophy className="w-6 h-6 text-slate-900 dark:text-slate-50" />
                    </div>
                    <div className="flex-1">
                      <CardTitle>View Leaderboard</CardTitle>
                      <CardDescription className="mt-1">
                        Check your rank and progress.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>
                    See where you stand against other learners. Climb the ranks, earn new badges, and showcase your skills!
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="default" className="w-full" onClick={handleViewLeaderboard}>
                    Go to Leaderboard
                  </Button>
                </CardFooter>
              </Card>
          </div>
        </div>
        {/* On Demand Tests */}
          <div className="space-y-6 mt-10">
            <div className="flex items-center space-x-2 mb-6">
              <Brain className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">On-Demand Tests</h2>
            </div>
            <Card className="shadow-medium border-0 hover:shadow-glow transition-all duration-300 hover-scale">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-indigo-800 rounded-xl flex items-center justify-center shadow-glow">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className='pb-2'>Take a Test</CardTitle>
                    <CardDescription className="mt-1">Assess your skills with quick quizzes and full-length tests.</CardDescription>
                  </div>
                  <ChevronRight className="w-6 h-6 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p>
                  Choose from a variety of tests to evaluate your comprehension and composition skills. Get instant feedback and score reports.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="default" className="w-full" onClick={() => navigate('/on-demand-test')}>
                  Start a Test
                </Button>
              </CardFooter>
            </Card>
          </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} English Tutor AI. All rights reserved.</p>
          <div className="flex space-x-4">
            {/* Use Links */}
            <Link to="#" className="text-sm text-muted-foreground hover:underline">Privacy Policy</Link>
            <Link to="#" className="text-sm text-muted-foreground hover:underline">Terms of Service</Link>
            <Link to="#" className="text-sm text-muted-foreground hover:underline">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;