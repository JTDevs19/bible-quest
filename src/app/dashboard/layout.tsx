
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
  UserCircle,
  LogOut,
  Cog,
  Gift,
  Lock,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type OnboardingData } from '../page';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const STARS_TO_UNLOCK_LEVEL_4 = 90; // 3 levels * 10 verses/level * 3 stars/verse
const PERFECT_SCORE_PER_LEVEL = 10;
const TOTAL_ADVENTURE_LEVELS = 5;

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/verse-memory', icon: BookText, label: 'Verse Memory' },
  {
    href: '/dashboard/character-adventures',
    icon: Users,
    label: 'Character Adventures',
    isLocked: 'verseMemory',
  },
  { 
    href: '/dashboard/bible-mastery', 
    icon: Milestone, 
    label: 'Bible Mastery',
    isLocked: 'characterAdventures',
  },
  { href: '/dashboard/personalized-verse', icon: Sparkles, label: 'AI Verse Helper' },
  { href: '/dashboard/daily-challenge', icon: Gift, label: 'Daily Challenge' },
  { href: '/dashboard/progress', icon: TrendingUp, label: 'My Progress' },
];


function DashboardNav() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const [characterAdventuresUnlocked, setCharacterAdventuresUnlocked] = useState(false);
  const [bibleMasteryUnlocked, setBibleMasteryUnlocked] = useState(false);

  useEffect(() => {
    // Check for Character Adventures unlock
    const verseMemoryProgress = localStorage.getItem('verseMemoryProgress');
    if (verseMemoryProgress) {
      const { stars } = JSON.parse(verseMemoryProgress);
      if (stars >= STARS_TO_UNLOCK_LEVEL_4) {
        setCharacterAdventuresUnlocked(true);
      }
    }
    
    // Check for Bible Mastery unlock
    const characterAdventuresProgress = localStorage.getItem('characterAdventuresProgress');
    if(characterAdventuresProgress) {
        const { scores } = JSON.parse(characterAdventuresProgress);
        if(scores) {
            let completedLevels = 0;
            for(let i=1; i<= TOTAL_ADVENTURE_LEVELS; i++) {
                if(scores[i] === PERFECT_SCORE_PER_LEVEL) {
                    completedLevels++;
                }
            }
            if(completedLevels === TOTAL_ADVENTURE_LEVELS) {
                setBibleMasteryUnlocked(true);
            }
        }
    }

  }, []);

  return (
     <SidebarMenu>
      {navItems.map((item) => {
        let isLocked = false;
        let tooltipText = item.label;

        if (item.isLocked === 'verseMemory' && !characterAdventuresUnlocked) {
          isLocked = true;
          tooltipText = `${item.label} (Unlock at Verse Memory Lvl 4)`;
        } else if (item.isLocked === 'characterAdventures' && !bibleMasteryUnlocked) {
          isLocked = true;
          tooltipText = `${item.label} (Complete all Character Adventures levels with a perfect score)`;
        }

        const buttonContent = (
          <SidebarMenuButton
            isActive={pathname === item.href}
            tooltip={tooltipText}
            onClick={() => !isLocked && setOpenMobile(false)}
            disabled={isLocked}
            className={cn(isLocked && "text-muted-foreground/50 cursor-not-allowed")}
          >
            {isLocked ? <Lock /> : <item.icon />}
            <span>{item.label}</span>
          </SidebarMenuButton>
        );

        return (
          <SidebarMenuItem key={item.href}>
            {isLocked ? (
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
  const [user, setUser] = useState<OnboardingData | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('bibleQuestsUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('bibleQuestsUser');
    router.push('/');
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
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
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                    <LogOut/>
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
             </SidebarMenu>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 justify-between">
           <SidebarTrigger className="md:hidden" />
           <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>{user?.username?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="font-semibold">{user?.username}</span>
           </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
