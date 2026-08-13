import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Mail, Lock, User, ArrowLeft, Sparkles, CheckCircle2, Trophy, Star } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password mismatch",
        description: "Passwords do not match. Please check and try again.",
      });
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password);
      toast({
        title: "Account created!",
        description: "Welcome to Lexicon AI Tutor. Let's start learning!",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Please try again with different credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background transition-colors duration-300 flex flex-col justify-between overflow-y-auto">
      {/* Background Glow Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] left-[20%] w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Compact Navigation Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-3 flex justify-between items-center relative z-20 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="hover:bg-primary/10 hover:text-primary transition-all rounded-xl gap-2 font-medium text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Home
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Sparkles className="w-3 h-3" /> Lexicon AI
          </div>
          <ModeToggle />
        </div>
      </header>

      {/* Main Form Layout - Vertically Centered */}
      <main className="flex-1 flex items-center justify-center px-4 py-2 relative z-10 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-10 items-center w-full">
          
          {/* Left Column Showcase (Desktop Only) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col space-y-6 pr-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-primary/20 border border-purple-500/30 text-purple-600 dark:text-purple-400 font-semibold text-xs">
                <Trophy className="w-3.5 h-3.5" /> Gamified AI Tutor
              </div>
              <h1 className="text-3xl xl:text-4xl font-black font-display tracking-tight text-foreground leading-tight">
                Begin Your Journey To <br />
                <span className="gradient-text">Fluent Expression</span>
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                Join thousands of students mastering vocabulary, comprehension, and structured essay writing with live AI feedback.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-md shadow-sm">
                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Interactive Exercises</h4>
                  <p className="text-[11px] text-muted-foreground">From vocabulary drills to full essay compositions.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-md shadow-sm">
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">XP & Global Leaderboard</h4>
                  <p className="text-[11px] text-muted-foreground">Earn rewards as you complete daily practice modules.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Register Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-primary rounded-3xl blur-xl opacity-20 group-hover:opacity-100 transition duration-1000" />

              <Card className="relative glass-card border-border/60 shadow-2xl rounded-3xl p-1 sm:p-3">
                <CardHeader className="space-y-1.5 text-center pb-2 pt-3">
                  <div className="mx-auto w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/30 transform hover:rotate-6 transition-transform duration-300">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold font-display text-foreground tracking-tight">
                      Create Your Account
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mt-0.5">
                      Fill in your details below for instant access
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-2.5 pt-1 px-4 sm:px-6">
                  <form onSubmit={handleSubmit} className="space-y-2.5">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <Label htmlFor="name" className="text-xs font-semibold text-foreground">
                        Full Name
                      </Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Alex Morgan"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-8 h-9 bg-background/60 border-border/70 focus:border-primary focus:bg-background rounded-xl transition-all shadow-sm text-xs"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-xs font-semibold text-foreground">
                        Email Address
                      </Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="alex@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-8 h-9 bg-background/60 border-border/70 focus:border-primary focus:bg-background rounded-xl transition-all shadow-sm text-xs"
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                      <Label htmlFor="password" className="text-xs font-semibold text-foreground">
                        Password
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-8 h-9 bg-background/60 border-border/70 focus:border-primary focus:bg-background rounded-xl transition-all shadow-sm text-xs"
                          required
                        />
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                      <Label htmlFor="confirmPassword" className="text-xs font-semibold text-foreground">
                        Confirm Password
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-8 h-9 bg-background/60 border-border/70 focus:border-primary focus:bg-background rounded-xl transition-all shadow-sm text-xs"
                          required
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full h-9 mt-1 bg-gradient-primary hover:opacity-95 text-white font-semibold rounded-xl shadow-md shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 text-xs"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating Account...' : 'Get Started Free'}
                    </Button>
                  </form>
                </CardContent>

                <CardFooter className="flex flex-col gap-1 pt-1 pb-3 text-center">
                  <p className="text-xs text-muted-foreground">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="text-primary hover:text-primary-light font-bold hover:underline transition-colors"
                    >
                      Sign In
                    </Link>
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>

        </div>
      </main>

      {/* Compact Footer */}
      <footer className="w-full py-2 text-center text-[11px] text-muted-foreground border-t border-border/40 bg-background/50 backdrop-blur-md relative z-20 flex-shrink-0">
        &copy; {new Date().getFullYear()} Lexicon AI Tutor. All rights reserved.
      </footer>
    </div>
  );
};

export default Register;