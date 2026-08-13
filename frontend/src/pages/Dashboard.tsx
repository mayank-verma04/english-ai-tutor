import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ModeToggle } from "@/components/mode-toggle";

import {
  BookOpen,
  PenTool,
  ChevronRight,
  Target,
  Brain,
  Zap,
  User,
  Sparkles,
  ArrowUpRight,
  LogOut,
  BarChart3,
  Award
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
      title: 'Comprehension Mastery',
      description: 'Enhance reading speed, context decoding, and listening comprehension with AI vocabulary & passage drills.',
      icon: BookOpen,
      gradient: 'from-cyan-500 to-blue-600',
      badgeBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
      topics: ['Vocabulary Builder', 'Sentence Analysis', 'Passage Comprehension']
    },
    {
      id: 'composition',
      title: 'Composition & Writing Lab',
      description: 'Master English writing through structured sentence formation, tone modulation, formal letters, essays, and persuasive writing.',
      icon: PenTool,
      gradient: 'from-purple-500 to-indigo-600',
      badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      topics: ['Sentence Formation', 'Short Paragraphs', 'Tone Practice', 'Letters & Essays', 'Persuasive Reports']
    }
  ];

  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };

  return (
    <div className="relative min-h-screen bg-background transition-colors duration-300 flex flex-col justify-between overflow-x-hidden">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-100px] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Futuristic Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/25 transform hover:scale-105 transition-transform duration-300">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black font-display tracking-tight text-foreground flex items-center gap-1.5">
                  Lexicon <span className="gradient-text">AI</span>
                </span>
              </div>
            </div>

            {/* Navigation Right Actions */}
            <div className="flex items-center space-x-3">
              <ModeToggle />

              {/* Profile Pill */}
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-card/80 border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 group shadow-sm"
                aria-label="View profile"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {user?.name ? user.name[0].toUpperCase() : <User className="w-3.5 h-3.5" />}
                </div>
                <span className="text-sm font-semibold text-foreground hidden sm:block max-w-[120px] truncate group-hover:text-primary transition-colors">
                  {user?.name || 'Learner'}
                </span>
              </button>

              {/* Logout Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout} 
                className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors gap-1.5 text-xs font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full relative z-10 space-y-8 animate-fade-in">

        {/* Hero Greeting Panel */}
        <div className="relative p-6 sm:p-8 rounded-3xl glass-card border border-border/60 overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/20 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                <Sparkles className="w-3.5 h-3.5" /> Daily AI Workspace
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-foreground">
                Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Learner'}</span> 👋
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
                Ready to elevate your English composition and reading precision today?
              </p>
            </div>

            {/* Quick Action Badge / AI Recommendation */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-background/80 border border-border/60 shadow-sm backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Recommended Next Step</p>
                <p className="text-sm font-bold text-foreground flex items-center gap-1 cursor-pointer hover:text-primary transition-colors" onClick={() => navigate('/on-demand-test')}>
                  Skill Assessment Quiz <ArrowUpRight className="w-3.5 h-3.5" />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* LEARNING MODULES & SIDEBAR GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Learning Modules (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold font-display text-foreground">Core Learning Modules</h3>
              </div>
              <span className="text-xs font-medium text-muted-foreground">Select a module to begin</span>
            </div>

            <div className="space-y-6">
              {modules.map((module) => (
                <Card
                  key={module.id}
                  className="glass-card border-border/60 cursor-pointer hover:border-primary/40 transition-all duration-300 hover:shadow-xl group p-2 relative overflow-hidden"
                  onClick={() => handleModuleClick(module.id)}
                >
                  <CardHeader className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start space-x-4">
                        <div className={`w-14 h-14 bg-gradient-to-br ${module.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                          <module.icon className="w-7 h-7" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-xl font-bold font-display text-foreground group-hover:text-primary transition-colors">
                              {module.title}
                            </CardTitle>
                          </div>
                          <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                            {module.description}
                          </CardDescription>
                        </div>
                      </div>

                      <Button variant="ghost" size="icon" className="rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all self-end sm:self-center flex-shrink-0">
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 pt-0">
                    <div className="flex flex-wrap gap-2">
                      {module.topics.map((topic) => (
                        <span key={topic} className={`px-3 py-1 rounded-lg text-xs font-semibold border ${module.badgeBg}`}>
                          {topic}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* On Demand Test Banner */}
            <div className="pt-4">
              <Card className="glass-card border-border/60 p-6 relative overflow-hidden bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-transparent">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                      <Brain className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold font-display text-foreground">On-Demand Adaptive Assessment</h4>
                      <p className="text-xs text-muted-foreground">Evaluate reading comprehension and sentence structure accuracy in under 10 minutes.</p>
                    </div>
                  </div>

                  <Button 
                    className="w-full sm:w-auto bg-gradient-primary hover:opacity-95 text-white font-semibold rounded-xl shadow-md shadow-primary/20 px-6"
                    onClick={() => navigate('/on-demand-test')}
                  >
                    Take Practice Test
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Sidebar Section (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Leaderboard Teaser Card */}
            <Card className="glass-card border-border/60 p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-500">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold font-display text-foreground">Community Leaderboard</h4>
                  <p className="text-xs text-muted-foreground">Compare scores with top learners</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/40 border border-border/50 flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Your Current Rank</span>
                <span className="font-extrabold text-foreground font-display">{user?.rank ? `#${user.rank}` : 'Unranked'}</span>
              </div>

              <Button 
                variant="outline" 
                className="w-full rounded-xl hover:bg-primary/10 hover:text-primary border-border/70 text-sm font-semibold"
                onClick={handleViewLeaderboard}
              >
                View Global Standings
              </Button>
            </Card>

            {/* Quick Stats / Progress Summary */}
            <Card className="glass-card border-border/60 p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-primary/15 text-primary">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold font-display text-foreground">Learning Insights</h4>
                  <p className="text-xs text-muted-foreground">Keep up your daily practice</p>
                </div>
              </div>

              <div className="space-y-3 pt-1 text-xs">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Target Comprehension</span>
                  <span className="font-bold text-foreground">85% Accuracy</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-primary rounded-full w-[85%]" />
                </div>
              </div>
            </Card>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/50 bg-background/50 backdrop-blur-md mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Lexicon AI Tutor. Empowering Linguistic Mastery.</p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/cookie-policy" className="hover:text-primary transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;