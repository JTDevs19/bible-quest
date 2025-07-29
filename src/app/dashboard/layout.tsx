
'use client';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  BookText,
  Users,
  Milestone,
  Sparkles,
  TrendingUp,
  Cog,
  Gift,
  Lock,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { UserProfile } from '@/app/page';
import AppTour from '@/components/tour/AppTour';

const STARS_TO_UNLOCK_LEVEL_4 = 90; 
const PERFECT_SCORE_PER_LEVEL = 10;
const TOTAL_ADVENTURE_LEVELS = 20;

function DashboardNav() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const [characterAdventuresCompleted, setCharacterAdventuresCompleted] = useState(false);
  const [bibleMasteryUnlocked, setBibleMasteryUnlocked] = useState(false);

  useEffect(() => {
    // This effect runs on the client-side
    const characterAdventuresProgress = JSON.parse(localStorage.getItem('characterAdventuresProgress') || '{}');
    if (characterAdventuresProgress.scores) {
        const completedLevels = Object.values(characterAdventuresProgress.scores).filter(score => score === PERFECT_SCORE_PER_LEVEL).length;
        if(completedLevels >= TOTAL_ADVENTURE_LEVELS) {
            setBibleMasteryUnlocked(true);
        }
    }
    
    // Check if level 1 of character adventures is passed
    const levelOneScore = characterAdventuresProgress.scores?.[1] || 0;
    setCharacterAdventuresCompleted(levelOneScore >= PERFECT_SCORE_PER_LEVEL);

  }, [pathname]); // Rerun on navigation to update lock status

  const navItems = [
    { id: 'nav-dashboard', href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'nav-verse-memory', href: '/dashboard/verse-memory', icon: BookText, label: 'Verse Memory' },
    {
      id: 'nav-character-adventures',
      href: '/dashboard/character-adventures',
      icon: Users,
      label: 'Character Adventures',
    },
    { 
      id: 'nav-bible-mastery',
      href: '/dashboard/bible-mastery', 
      icon: Milestone, 
      label: 'Bible Mastery',
      isLocked: !bibleMasteryUnlocked,
      tooltipText: 'Master all Character Adventures first'
    },
    { id: 'nav-ai-helper', href: '/dashboard/personalized-verse', icon: Sparkles, label: 'AI Verse Helper' },
    { id: 'nav-daily-challenge', href: '/dashboard/daily-challenge', icon: Gift, label: 'Daily Challenge' },
    { id: 'nav-progress', href: '/dashboard/progress', icon: TrendingUp, label: 'My Progress' },
  ];

  return (
     <SidebarMenu>
      {navItems.map((item) => {
        const buttonContent = (
          <SidebarMenuButton
            id={item.id}
            isActive={pathname === item.href}
            tooltip={item.isLocked ? `${item.label} (${item.tooltipText})` : item.label}
            onClick={() => !item.isLocked && setOpenMobile(false)}
            disabled={item.isLocked}
            className={cn(item.isLocked && "text-muted-foreground/50 cursor-not-allowed")}
          >
            {item.isLocked ? <Lock /> : <item.icon />}
            <span>{item.label}</span>
          </SidebarMenuButton>
        );

        return (
          <SidebarMenuItem key={item.href}>
            {item.isLocked ? (
              <div>{buttonContent}</div>
            ) : (
              <Link href={item.href} passHref>
                {buttonContent}
              </Link>
            )}
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  useEffect(() => {
    const profile = localStorage.getItem('bibleQuestsUser');
    if (profile) {
      setUserProfile(JSON.parse(profile));
    } else {
      router.push('/');
    }
  }, [router]);
  
  if (!userProfile) {
    return <div className="flex h-screen items-center justify-center">Loading Dashboard...</div>
  }

  return (
    <SidebarProvider>
      <AppTour />
      <Sidebar>
        <SidebarHeader id="sidebar-header">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="font-headline text-2xl font-bold text-primary">Bible Quests</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
         <DashboardNav />
        </SidebarContent>
        <SidebarFooter>
          <div className="border-t border-border -mx-2 pt-2">
             <SidebarMenu>
                <SidebarMenuItem>
                  <Link href="/dashboard/admin">
                    <SidebarMenuButton tooltip="Administration">
                        <Cog/>
                        <span>Administration</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
             </SidebarMenu>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header id="main-header" className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 justify-between">
           <SidebarTrigger className="md:hidden" />
           <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>{userProfile.username?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="font-semibold">{userProfile.username}</span>
           </div>
        </header>
        <main id="main-content" className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
