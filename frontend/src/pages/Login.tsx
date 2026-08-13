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
import { BookOpen, Mail, Lock, Eye, EyeOff, ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

// --- IMPORTS FOR GOOGLE & THEME ---
import { GoogleLogin } from '@react-oauth/google';
import { useTheme } from 'next-themes';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auth Context
  const { login, googleLogin, user } = useAuth();

  // UI Hooks
  const { toast } = useToast();
  const navigate = useNavigate();

  // Theme Hook (to style the Google Button)
  const { resolvedTheme } = useTheme();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // --- GOOGLE SUCCESS HANDLER ---
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      if (!credentialResponse.credential)
        throw new Error('No credential received');

      await googleLogin(credentialResponse.credential);

      toast({
        title: 'Welcome back!',
        description: 'Successfully signed in with Google.',
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: error.message || 'Google sign-in could not be completed.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleFailure = () => {
    toast({
      variant: 'destructive',
      title: 'Login failed',
      description: 'Google sign-in was unsuccessful. Please try again.',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast({
        title: 'Welcome back!',
        description: "You've successfully logged in.",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: 'Please check your credentials and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background transition-colors duration-300 flex flex-col justify-between overflow-hidden">
      {/* Dynamic Background Glow Fields */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[30%] right-[20%] w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex justify-between items-center relative z-20">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="hover:bg-primary/10 hover:text-primary transition-all rounded-xl gap-2 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Home
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Sparkles className="w-3.5 h-3.5" /> Lexicon AI
          </div>
          <ModeToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          
          {/* Left / Info Showcase Section (Hidden on Mobile) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col space-y-8 pr-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 text-primary font-semibold text-sm">
                <ShieldCheck className="w-4 h-4 text-primary" /> AI-Powered Fluency Engine
              </div>
              <h1 className="text-4xl xl:text-5xl font-black font-display tracking-tight text-foreground leading-[1.15]">
                Unlock Natural <br />
                <span className="gradient-text">English Mastery</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                Experience personalized feedback, real-time composition analysis, and adaptive reading exercises built for fast progress.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-md shadow-sm transition-transform hover:translate-x-1">
                <div className="p-2 rounded-xl bg-primary/15 text-primary">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Instant Structural Feedback</h4>
                  <p className="text-xs text-muted-foreground">Grammar, tone, and sentence architecture checked in real-time.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-md shadow-sm transition-transform hover:translate-x-1">
                <div className="p-2 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Adaptive Learning Modules</h4>
                  <p className="text-xs text-muted-foreground">Tailored passages and exercises based on your skill trajectory.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right / Login Card Container */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="relative">
              {/* Card Ambient Aura */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-100 transition duration-1000" />

              <Card className="relative glass-card border-border/60 shadow-2xl rounded-3xl p-2 sm:p-4">
                <CardHeader className="space-y-3 text-center pb-4">
                  <div className="mx-auto w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 transform hover:rotate-6 transition-transform duration-300">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold font-display text-foreground tracking-tight">
                      Sign In to Lexicon
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mt-1">
                      Enter your credentials to access your personalized learning space
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Input */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-semibold text-foreground">
                        Email Address
                      </Label>
                      <div className="relative group">
                        <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="learner@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-11 bg-background/60 border-border/70 focus:border-primary focus:bg-background rounded-xl transition-all shadow-sm"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-xs font-semibold text-foreground">
                          Password
                        </Label>
                        <Link
                          to="#"
                          className="text-xs text-primary hover:underline font-medium"
                          onClick={(e) => {
                            e.preventDefault();
                            toast({
                              description: 'Password reset instructions have been sent to system administrator.',
                            });
                          }}
                        >
                          Forgot?
                        </Link>
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 h-11 bg-background/60 border-border/70 focus:border-primary focus:bg-background rounded-xl transition-all shadow-sm"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-9 px-3 hover:bg-transparent text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full h-11 bg-gradient-primary hover:opacity-95 text-white font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Authenticating...' : 'Sign In'}
                    </Button>
                  </form>

                  {/* Google Divider */}
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/60" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-3 text-muted-foreground font-medium">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Google OAuth Button */}
                  <div className="flex justify-center w-full">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleFailure}
                      theme={resolvedTheme === 'dark' ? 'filled_black' : 'outline'}
                      text="continue_with"
                      width="100%"
                      shape="pill"
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-3 pt-2 text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link
                      to="/register"
                      className="text-primary hover:text-primary-light font-bold hover:underline transition-colors"
                    >
                      Create one now
                    </Link>
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-muted-foreground border-t border-border/40 bg-background/50 backdrop-blur-md relative z-20">
        &copy; {new Date().getFullYear()} Lexicon AI Tutor. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;