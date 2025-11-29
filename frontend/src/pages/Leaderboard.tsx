import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, ArrowLeft, Crown, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { API_BASE_URL } from '@/config/constants';

interface LeaderboardUser {
  rank: number;
  _id: string;
  name: string;
  points: number;
  avatar?: string; // Optional if you have avatars later
}

interface LeaderboardData {
  leaderboard: LeaderboardUser[];
  currentUser: {
    rank: number;
    points: number;
    name: string;
  };
}

const Leaderboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/leaderboard?limit=20`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch leaderboard');

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500/20" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-slate-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-700" />;
    return <span className="text-sm font-bold text-muted-foreground w-6 text-center">{rank}</span>;
  };

  const getRankStyles = (rank: number) => {
    if (rank === 1) return "bg-yellow-500/10 border-yellow-500/50 text-yellow-700 dark:text-yellow-400";
    if (rank === 2) return "bg-slate-400/10 border-slate-400/50 text-slate-700 dark:text-slate-300";
    if (rank === 3) return "bg-amber-700/10 border-amber-700/50 text-amber-800 dark:text-amber-500";
    return "bg-card hover:bg-accent/50 border-transparent";
  };

  return (
    <div className="min-h-screen bg-gradient-soft p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="w-fit pl-0 hover:bg-transparent hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="text-right hidden md:block">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Global Rankings</h1>
            <p className="text-sm text-muted-foreground">Updated in real-time</p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-6 md:p-10 text-white shadow-lg">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Leaderboard</h2>
                <p className="text-primary-foreground/80">Compete with the best learners worldwide.</p>
              </div>
            </div>
            
            {/* User's Current Rank (Desktop Highlight) */}
            {data && (
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20">
                <div className="text-right">
                  <p className="text-xs font-medium uppercase tracking-wider text-primary-foreground/70">Your Rank</p>
                  <p className="text-2xl font-bold">#{data.currentUser.rank}</p>
                </div>
                <div className="h-8 w-px bg-white/20"></div>
                <div>
                   <p className="text-xs font-medium uppercase tracking-wider text-primary-foreground/70">Points</p>
                   <p className="text-2xl font-bold">{data.currentUser.points}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Decorative background circle */}
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"></div>
        </div>

        {/* Main List */}
        <Card className="shadow-medium border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              Top Performers
            </CardTitle>
            <CardDescription>
              Students with the highest learning streaks and points this week.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-6 w-12" />
                  </div>
                ))}
              </div>
            ) : data && data.leaderboard.length > 0 ? (
              <div className="divide-y divide-border/50">
                {data.leaderboard.map((user) => {
                  const isCurrentUser = user._id === data.currentUser._id || (user.rank === data.currentUser.rank && user.points === data.currentUser.points);
                  
                  return (
                    <div
                      key={user._id}
                      className={`
                        relative flex items-center gap-4 p-4 transition-all duration-200
                        ${isCurrentUser ? 'bg-primary/5' : 'hover:bg-muted/40'}
                      `}
                    >
                      {/* Active Indicator for Current User */}
                      {isCurrentUser && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                      )}

                      {/* Rank Icon/Number */}
                      <div className="w-8 flex justify-center flex-shrink-0">
                        {getRankIcon(user.rank)}
                      </div>

                      {/* Avatar */}
                      <Avatar className={`w-10 h-10 border-2 ${
                        user.rank === 1 ? 'border-yellow-500' : 
                        user.rank === 2 ? 'border-slate-400' : 
                        user.rank === 3 ? 'border-amber-700' : 
                        'border-transparent'
                      }`}>
                        <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`} />
                        <AvatarFallback className="text-xs">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                           <p className={`font-semibold text-sm truncate ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                            {user.name} {isCurrentUser && "(You)"}
                          </p>
                          {user.rank <= 3 && (
                             <Badge variant="secondary" className="text-[10px] h-4 px-1 rounded-sm hidden sm:flex">
                                Top 3
                             </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          Level {Math.floor(user.points / 100) + 1} Scholar
                        </p>
                      </div>

                      {/* Points Badge */}
                      <div className="text-right">
                         <span className={`text-sm font-bold ${
                           user.rank === 1 ? 'text-yellow-600 dark:text-yellow-400' : 'text-foreground'
                         }`}>
                           {user.points.toLocaleString()}
                         </span>
                         <span className="text-xs text-muted-foreground block">pts</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                   <Trophy className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-medium text-foreground">No data yet</h3>
                <p className="text-muted-foreground">Be the first to climb the leaderboard!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;