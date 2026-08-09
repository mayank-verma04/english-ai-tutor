import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ModeToggle } from '@/components/mode-toggle';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  ArrowLeft,
  Save,
  Flame,
  Star,
  Trophy,
  Shield,
  Edit3,
  CheckCircle2,
  Calendar,
  LogOut,
} from 'lucide-react';

const getAvatarInitials = (name: string) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getAvatarColor = (name: string) => {
  const colors = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-amber-600',
    'from-rose-500 to-pink-600',
    'from-indigo-500 to-blue-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Info edit state
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSavingInfo, setIsSavingInfo] = useState(false);

  // Password state
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const initials = getAvatarInitials(user.name);
  const avatarGradient = getAvatarColor(user.name);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSaveInfo = async () => {
    if (!name.trim()) {
      toast({ variant: 'destructive', title: 'Name cannot be empty' });
      return;
    }
    setIsSavingInfo(true);
    try {
      await updateProfile({ name: name.trim(), email: email.trim() });
      setIsEditingInfo(false);
      toast({
        title: '✅ Profile Updated',
        description: 'Your name and email have been saved.',
      });
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: err.message || 'Something went wrong.',
      });
    } finally {
      setIsSavingInfo(false);
    }
  };

  const handleCancelInfo = () => {
    setName(user.name);
    setEmail(user.email);
    setIsEditingInfo(false);
  };

  const handleSavePassword = async () => {
    // Step 1: current password is always required
    if (!currentPassword) {
      toast({
        variant: 'destructive',
        title: 'Current password required',
        description: 'Please enter your current password to proceed.',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ variant: 'destructive', title: 'Passwords do not match' });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Password too short',
        description: 'New password must be at least 6 characters.',
      });
      return;
    }
    if (newPassword === currentPassword) {
      toast({
        variant: 'destructive',
        title: 'Same password',
        description: 'New password must be different from your current password.',
      });
      return;
    }
    setIsSavingPassword(true);
    try {
      await updateProfile({ currentPassword, newPassword });
      setIsEditingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast({
        title: '🔒 Password Updated',
        description: 'Your password has been changed successfully.',
      });
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Password update failed',
        description: err.message || 'Something went wrong.',
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleCancelPassword = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsEditingPassword(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    {
      label: 'Total Points',
      value: user.points,
      icon: Star,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      label: 'Current Streak',
      value: `${user.streak.count} days`,
      icon: Flame,
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      label: 'Global Rank',
      value: user.rank ? `#${user.rank}` : 'Unranked',
      icon: Trophy,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/dashboard')}
                className="rounded-full hover:bg-muted"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-primary rounded-lg flex items-center justify-center shadow-sm">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-lg font-bold text-foreground tracking-tight">My Profile</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ModeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-sm hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
        {/* Hero Profile Card */}
        <Card className="border-border/50 shadow-medium bg-card overflow-hidden">
          {/* Banner */}
          <div className="h-28 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 relative">
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                  radial-gradient(circle at 80% 20%, white 1px, transparent 1px),
                  radial-gradient(circle at 60% 80%, white 1px, transparent 1px)`,
                backgroundSize: '30px 30px',
              }}
            />
          </div>

          <CardContent className="pt-0 pb-6 px-6 relative">
            {/* Avatar */}
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center shadow-lg border-4 border-background ring-2 ring-primary/20`}
              >
                <span className="text-2xl font-extrabold text-white tracking-tight">
                  {initials}
                </span>
              </div>
              <div className="flex items-center gap-2 pb-1">
                {user.googleId && (
                  <Badge variant="secondary" className="gap-1 text-xs font-medium">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google Account
                  </Badge>
                )}
                <Badge className="gap-1 text-xs bg-primary/10 text-primary border-primary/20">
                  <Shield className="w-3 h-3" />
                  Active
                </Badge>
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
              <p className="text-muted-foreground text-sm">{user.email}</p>
              {user.createdAt && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Member since {formatDate(user.createdAt)}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="border-border/50 shadow-soft hover:shadow-md transition-all bg-card/80 backdrop-blur-sm group"
            >
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg} transition-colors`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-xl font-extrabold text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Personal Information */}
        <Card className="border-border/50 shadow-medium bg-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Personal Information</CardTitle>
                  <CardDescription className="text-xs mt-0.5">Update your name and email address</CardDescription>
                </div>
              </div>
              {!isEditingInfo && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingInfo(true)}
                  className="gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1.5">
              <Label htmlFor="profile-name" className="text-sm font-medium flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                Full Name
              </Label>
              {isEditingInfo ? (
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-background/60 focus:bg-background transition-colors"
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/40 rounded-md text-sm text-foreground border border-border/50">
                  <span className="font-medium">{user.name}</span>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="profile-email" className="text-sm font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                Email Address
              </Label>
              {isEditingInfo ? (
                <Input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-background/60 focus:bg-background transition-colors"
                />
              ) : (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/40 rounded-md text-sm text-foreground border border-border/50">
                  <span>{user.email}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {isEditingInfo && (
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleSaveInfo}
                  disabled={isSavingInfo}
                  className="flex-1 gap-2 bg-gradient-primary hover:opacity-90 transition-opacity"
                >
                  {isSavingInfo ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelInfo}
                  disabled={isSavingInfo}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="border-border/50 shadow-medium bg-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Lock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Password & Security</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    {user.googleId && !isEditingPassword
                      ? 'Set a password to also enable email login'
                      : 'Change your account password'}
                  </CardDescription>
                </div>
              </div>
              {!isEditingPassword && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingPassword(true)}
                  className="gap-2 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 dark:hover:bg-orange-900/20 dark:hover:text-orange-400 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  {user.googleId ? 'Set Password' : 'Change'}
                </Button>
              )}
            </div>
          </CardHeader>

          {!isEditingPassword ? (
            <CardContent>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  {user.googleId
                    ? 'Your account uses Google authentication. You can also set a password for email login.'
                    : 'Password is set. Click "Change" to update it.'}
                </p>
              </div>
            </CardContent>
          ) : (
            <CardContent className="space-y-4">
              {/* Current Password — ALWAYS required */}
              <div className="space-y-1.5">
                <Label htmlFor="current-password" className="text-sm font-medium flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                  Current Password
                  <span className="text-red-500 text-xs font-normal ml-0.5">*</span>
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="current-password"
                    type={showCurrentPw ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className={`pl-10 pr-10 bg-background/60 focus:bg-background transition-colors ${
                      currentPassword
                        ? 'border-input'
                        : ''
                    }`}
                    autoFocus
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => setShowCurrentPw((p) => !p)}
                  >
                    {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">You must verify your current password before setting a new one.</p>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <Label htmlFor="new-password" className="text-sm font-medium">
                  New Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="new-password"
                    type={showNewPw ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 chars)"
                    className="pl-10 pr-10 bg-background/60 focus:bg-background transition-colors"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => setShowNewPw((p) => !p)}
                  >
                    {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {/* Strength indicator */}
                {newPassword && (
                  <div className="flex gap-1 mt-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                          newPassword.length >= i * 3
                            ? newPassword.length >= 12
                              ? 'bg-emerald-500'
                              : newPassword.length >= 8
                              ? 'bg-amber-500'
                              : 'bg-red-400'
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1 self-center">
                      {newPassword.length < 6
                        ? 'Too short'
                        : newPassword.length < 8
                        ? 'Weak'
                        : newPassword.length < 12
                        ? 'Good'
                        : 'Strong'}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password" className="text-sm font-medium">
                  Confirm New Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPw ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className={`pl-10 pr-10 bg-background/60 focus:bg-background transition-colors ${
                      confirmPassword && confirmPassword !== newPassword
                        ? 'border-red-400 focus:ring-red-400/30'
                        : confirmPassword && confirmPassword === newPassword
                        ? 'border-emerald-400 focus:ring-emerald-400/30'
                        : ''
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirmPw((p) => !p)}
                  >
                    {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
                {confirmPassword && confirmPassword === newPassword && (
                  <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Passwords match
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleSavePassword}
                  disabled={isSavingPassword || !currentPassword || !newPassword || !confirmPassword}
                  className="flex-1 gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 text-white transition-opacity"
                >
                  {isSavingPassword ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Password
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelPassword}
                  disabled={isSavingPassword}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/30 shadow-soft bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <CardTitle className="text-base text-red-600 dark:text-red-400">Sign Out</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  You'll need to log in again to access your account.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-destructive/40 text-destructive hover:bg-destructive hover:text-white transition-all duration-300 gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out of Account
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-background border-t border-border mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} English Tutor AI. Your data is private and secure.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
