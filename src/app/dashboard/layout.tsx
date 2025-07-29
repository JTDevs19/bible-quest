
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
  ChevronUp,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { UserProfile } from '@/app/page';
import AppTour from '@/components/tour/AppTour';
import { useUserProgress } from '@/hooks/use-user-progress';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';


const VERSES_PER_STAGE = 20;
const LEVELS_PER_STAGE = 5;

// Function to check if a stage is complete
const isStageComplete = (stageNum: number, scores: any) => {
    if (!scores || !scores[stageNum]) return false;
    for (let level = 1; level <= LEVELS_PER_STAGE; level++) {
        const levelScores = scores[stageNum]?.[level];
        if (!levelScores || Object.keys(levelScores).length < VERSES_PER_STAGE) {
            return false;
        }
    }
    return true;
};

function DashboardNav() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const [characterAdventuresUnlocked, setCharacterAdventuresUnlocked] = useState(false);
  const [bibleMasteryUnlocked, setBibleMasteryUnlocked] = useState(false);

  useEffect(() => {
    const profileStr = localStorage.getItem('bibleQuestsUser');
    const profile = profileStr ? JSON.parse(profileStr) : null;
    const isTester = profile?.username === 'Scassenger';

    const verseMemoryProgress = JSON.parse(localStorage.getItem('verseMemoryProgress') || '{}');
    const stage1Completed = isStageComplete(1, verseMemoryProgress.scores);
    const stage2Completed = isStageComplete(2, verseMemoryProgress.scores);

    setCharacterAdventuresUnlocked(isTester || stage1Completed);
    setBibleMasteryUnlocked(isTester || stage2Completed);

  }, [pathname]);

  const navItems = [
    { id: 'nav-dashboard', href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'nav-verse-memory', href: '/dashboard/verse-memory', icon: BookText, label: 'Verse Memory' },
    {
      id: 'nav-character-adventures',
      href: '/dashboard/character-adventures',
      icon: Users,
      label: 'Character Adventures',
      isLocked: !characterAdventuresUnlocked,
      tooltipText: 'Complete Stage 1 of Verse Memory to unlock'
    },
    { 
      id: 'nav-bible-mastery',
      href: '/dashboard/bible-mastery', 
      icon: Milestone, 
      label: 'Bible Mastery',
      isLocked: !bibleMasteryUnlocked,
      tooltipText: 'Complete Stage 2 of Verse Memory to unlock'
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

function UserProgressHeader() {
    const { level, exp, expForNextLevel, lastLevelUpExp } = useUserProgress();
    const progressPercentage = ((exp - lastLevelUpExp) / (expForNextLevel - lastLevelUpExp)) * 100;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer">
                    <div className="text-right">
                        <p className="font-bold text-sm">Level {level}</p>
                        <p className="text-xs text-muted-foreground">EXP: {exp - lastLevelUpExp}/{expForNextLevel - lastLevelUpExp}</p>
                    </div>
                    <Progress value={progressPercentage} className="w-24 h-2" />
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-64">
                <div className="space-y-2">
                    <h4 className="font-medium leading-none">Level {level}</h4>
                    <p className="text-sm text-muted-foreground">Your spiritual growth progress.</p>
                    <Progress value={progressPercentage} className="w-full h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{exp - lastLevelUpExp} EXP</span>
                        <span>{expForNextLevel - lastLevelUpExp} EXP to Level Up</span>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
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
           <UserProgressHeader />
        </header>
        <main id="main-content" className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
