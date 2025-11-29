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
  CardFooter
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: 'Welcome back!',
        description: "You've successfully logged in.",
      });
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
    <div className="min-h-screen bg-gradient-soft transition-colors duration-300 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="w-full max-w-7xl mx-auto p-4 flex justify-between items-center absolute top-0 left-0 right-0 z-10">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')} 
          className="hover:bg-background/50 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Button>
        <ModeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 pt-16">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 transform hover:scale-105 transition-transform duration-300">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to continue your progress</p>
          </div>

          <Card className="shadow-strong border-border/50 bg-card/80 backdrop-blur-sm animate-scale-in">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl font-semibold text-center">Sign In</CardTitle>
              <CardDescription className="text-center">
                Enter your email and password below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-background/50 border-input focus:bg-background transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link 
                      to="#" 
                      className="text-xs text-primary hover:text-primary-light hover:underline font-medium"
                      onClick={(e) => {
                        e.preventDefault();
                        toast({ description: "Password reset feature coming soon!" });
                      }}
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-background/50 border-input focus:bg-background transition-all"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground hover:text-foreground"
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

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 border-t border-border/50 bg-muted/20 p-6">
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-primary hover:text-primary-light font-semibold hover:underline transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;