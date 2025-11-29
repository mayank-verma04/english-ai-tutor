import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  iconColor?: string; // e.g., "text-blue-500"
  iconBgColor?: string; // e.g., "bg-blue-100 dark:bg-blue-900"
  showBack?: boolean;
  backTo?: string; // Custom route to go back to
  className?: string;
  children?: React.ReactNode; // For extra right-side actions
}

export const Header = ({
  title,
  subtitle,
  icon: Icon,
  iconColor,
  iconBgColor,
  showBack = true,
  backTo,
  className,
  children,
}: HeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section: Back Button & Title */}
          <div className="flex items-center gap-4">
            {showBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="rounded-full hover:bg-muted transition-colors mr-2"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </Button>
            )}

            <div className="flex items-center gap-3">
              {Icon && (
                <div className={cn(
                  "p-2 rounded-lg flex items-center justify-center shadow-sm",
                  iconBgColor || "bg-primary/10",
                  iconColor || "text-primary"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
              )}
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-foreground leading-tight tracking-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs text-muted-foreground font-medium hidden sm:block">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Section: Actions & Mode Toggle */}
          <div className="flex items-center gap-2">
            {children}
            <div className="pl-2 border-l border-border/50 ml-2">
               <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};