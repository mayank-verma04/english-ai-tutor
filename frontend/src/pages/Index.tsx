import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, PenTool, Sparkles, Trophy, ArrowRight, CheckCircle2, Rocket } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-300 selection:bg-primary/20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">English Tutor AI</span>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate("/login")} className="hidden sm:inline-flex hover:bg-primary/10 hover:text-primary">
                Sign In
              </Button>
              <Button onClick={() => navigate("/register")} className="shadow-md hover:shadow-primary/20 transition-all">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Learning Experience</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Master English with <br className="hidden lg:block" />
              <span className="bg-clip-text text-transparent bg-gradient-primary">Intelligent Feedback</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Elevate your reading and writing skills with personalized lessons, real-time corrections, and adaptive exercises tailored just for you.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300" onClick={() => navigate("/register")}>
                Start Learning Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-base border-primary/20 hover:bg-primary/5" onClick={() => navigate("/login")}>
                I have an account
              </Button>
            </div>
            
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Free Tier Available</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> No Credit Card</div>
            </div>
          </div>
          
          {/* Hero Visual / Mockup */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none animate-scale-in delay-200">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-primary rounded-2xl blur-lg opacity-20 dark:opacity-30" />
              
              <Card className="relative bg-card/90 backdrop-blur-xl border-border/50 shadow-2xl overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-primary" />
                <CardContent className="p-6 sm:p-8 space-y-6">
                  {/* Mock UI Elements */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 border border-border/50">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Analysis Complete</p>
                      <p className="text-sm text-muted-foreground mt-1">Your essay structure has improved significantly. Great use of transitional phrases!</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Grammar Score</span>
                      <span className="text-primary">92/100</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full w-full overflow-hidden">
                      <div className="h-full bg-gradient-primary w-[92%] rounded-full animate-progress-glow" />
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-xs font-bold text-primary uppercase">AI Suggestion</span>
                    </div>
                    <p className="text-sm italic text-muted-foreground leading-relaxed">
                      "Consider replacing <span className="underline decoration-wavy decoration-red-400 text-foreground">very good</span> with <span className="font-semibold text-primary">exceptional</span> or <span className="font-semibold text-primary">outstanding</span> to strengthen your argument."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Everything you need to excel</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our comprehensive platform combines traditional learning methods with cutting-edge AI technology.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Reading Comprehension",
                desc: "Dive into adaptive passages with instant vocabulary definitions and context-aware questions.",
                color: "text-blue-600 dark:text-blue-400",
                bg: "bg-blue-100 dark:bg-blue-900/20",
                border: "hover:border-blue-500/30"
              },
              {
                icon: PenTool,
                title: "Writing Composition",
                desc: "Practice essays, letters, and reports with immediate AI grading on grammar, tone, and structure.",
                color: "text-purple-600 dark:text-purple-400",
                bg: "bg-purple-100 dark:bg-purple-900/20",
                border: "hover:border-purple-500/30"
              },
              {
                icon: Trophy,
                title: "Gamified Progress",
                desc: "Earn points, maintain streaks, and climb the global leaderboard as you master new skills.",
                color: "text-amber-600 dark:text-amber-400",
                bg: "bg-amber-100 dark:bg-amber-900/20",
                border: "hover:border-amber-500/30"
              }
            ].map((feature, i) => (
              <Card 
                key={i} 
                className={`group hover:shadow-xl transition-all duration-300 border-border/60 bg-card ${feature.border}`}
              >
                <CardContent className="p-8 space-y-5">
                  <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
            <Rocket className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Ready to start your journey?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students improving their English proficiency with our AI tutor today.
          </p>
          <div className="pt-4">
            <Button size="lg" className="h-14 px-12 text-lg shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 rounded-full" onClick={() => navigate("/register")}>
              Create Free Account
            </Button>
          </div>
        </div>
        
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10" />
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                  <BookOpen className="w-3 h-3 text-white" />
                </div>
                <span className="font-bold text-lg">English Tutor AI</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-xs">
                Empowering learners worldwide with accessible, intelligent, and personalized English education.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">For Schools</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} English Tutor AI. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
              <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
              <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;