import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { API_BASE_URL } from '@/config/constants';

interface LeaderboardUser {
  rank: number;
  _id: string;
  name: string;
  points: number;
}

interface LeaderboardData {
  leaderboard: LeaderboardUser[];
  currentUser: {
    rank: number;
    points: number;
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
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-700" />;
    return null;
  };

  const getRankBadgeVariant = (rank: number) => {
    if (rank === 1) return "default";
    if (rank === 2) return "secondary";
    if (rank === 3) return "outline";
    return "outline";
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Trophy className="w-8 h-8 text-primary" />
              Leaderboard
            </CardTitle>
            <CardDescription>
              See how you rank against other learners
            </CardDescription>
          </CardHeader>
        </Card>

        {data && (
          <Card className="mb-6 bg-primary/5 border-primary">
            <CardHeader>
              <CardTitle className="text-xl">Your Rank</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getRankIcon(data.currentUser.rank)}
                  <div>
                    <p className="text-2xl font-bold">Rank #{data.currentUser.rank}</p>
                    <p className="text-muted-foreground">Keep learning to climb higher!</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">{data.currentUser.points}</p>
                  <p className="text-sm text-muted-foreground">Points</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Top Learners</CardTitle>
            <CardDescription>The most dedicated students</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : data && data.leaderboard.length > 0 ? (
              <div className="space-y-3">
                {data.leaderboard.map((user) => (
                  <div
                    key={user._id}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                      user.rank <= 3 ? 'bg-muted/50' : 'hover:bg-muted/30'
                    }`}
                  >
                    <div className="w-12 flex items-center justify-center">
                      {getRankIcon(user.rank) || (
                        <span className="text-lg font-semibold text-muted-foreground">
                          #{user.rank}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Rank #{user.rank}
                      </p>
                    </div>
                    <Badge variant={getRankBadgeVariant(user.rank)} className="text-base px-4 py-1">
                      {user.points} pts
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No leaderboard data available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
