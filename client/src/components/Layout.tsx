import React from 'react';
import { Link, useLocation } from 'wouter';
import { CheckSquare, Calendar, Edit3, BarChart2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { icon: CheckSquare, label: 'Today', path: '/' },
    { icon: Calendar, label: 'History', path: '/calendar' },
    { icon: Edit3, label: 'Edit', path: '/edit' },
    { icon: BarChart2, label: 'Stats', path: '/stats' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden">
      <div className="bg-noise" />
      
      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto no-scrollbar safe-area-top safe-area-bottom pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 px-6 pb-6 pt-4 safe-area-bottom bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
        <div className="glass-panel rounded-full px-2 py-2 flex justify-between items-center pointer-events-auto shadow-lg shadow-black/20">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div className={cn(
                  "flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300",
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground active:scale-95"
                )}>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
              </Link>
            );
          })}
          
          {/* Settings button separately if needed or integrated */}
        </div>
      </nav>
    </div>
  );
}
