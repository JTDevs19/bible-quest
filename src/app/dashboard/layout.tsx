
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
  Shield,
  Key,
  Hammer,
  NotebookText,
  Lightbulb,
  Coins,
  Heart,
  Puzzle,
  Swords,
  FileSearch,
  Wallet,
  Music,
  Play,
  Pause,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { UserProfile } from '@/app/page';
import { useUserProgress } from '@/hooks/use-user-progress';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';


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

function DashboardNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const navItems = [
    { id: 'nav-dashboard', href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'nav-games', href: '/dashboard/games', icon: Puzzle, label: 'Games & Challenges' },
    { id: 'nav-ai-helper', href: '/dashboard/personalized-verse', icon: Sparkles, label: 'AI Verse Helper', adminOnly: true },
    { id: 'nav-progress', href: '/dashboard/progress', icon: TrendingUp, label: 'My Progress' },
    { id: 'nav-support', href: '/dashboard/support', icon: Heart, label: 'Support Us' },
    { id: 'nav-notes', href: '/dashboard/notes', icon: NotebookText, label: 'My Notes', adminOnly: true },
  ];

  return (
     <SidebarMenu>
      {navItems.map((item) => {
        if (item.adminOnly && !isAdmin) {
          return null;
        }
        const buttonContent = (
          <SidebarMenuButton
            id={item.id}
            isActive={pathname === item.href || (item.href === '/dashboard/games' && (pathname.startsWith('/dashboard/') && !navItems.some(nav => nav.href === pathname && nav.href !== '/dashboard/games')) || pathname === '/dashboard/daily-challenge')}
            tooltip={item.label}
            onClick={() => setOpenMobile(false)}
          >
            <item.icon />
            <span>{item.label}</span>
          </SidebarMenuButton>
        );

        return (
          <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref>
                {buttonContent}
              </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  )
}

function UserProgressHeader({ userProfile, isAdmin }: { userProfile: UserProfile, isAdmin: boolean }) {
    const { level, exp, expForNextLevel, lastLevelUpExp, shields, wisdomKeys, hints, denarius } = useUserProgress();
    const progressPercentage = ((exp - lastLevelUpExp) / (expForNextLevel - lastLevelUpExp)) * 100;
    const router = useRouter();

    const ShieldDisplay = () => {
        const hasHalfShield = shields % 2 !== 0;
        return (
            <div className="flex items-center gap-2">
                <div className="relative w-5 h-5">
                    {hasHalfShield ? (
                        <>
                            <Shield className="w-5 h-5 text-primary fill-muted" />
                            <div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden">
                                <Shield className="w-5 h-5 text-primary fill-primary" />
                            </div>
                        </>
                    ) : (
                         <Shield className={cn("w-5 h-5 text-primary", shields > 0 ? "fill-primary" : "fill-muted")} />
                    )}
                </div>
                <span className={cn("font-semibold", hasHalfShield ? "text-destructive" : "text-foreground")}>
                    {Math.floor(shields / 2)}
                </span>
            </div>
        );
    };

    return (
        <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                     <Button variant="ghost" className="flex items-center gap-2 h-10">
                        <Avatar className={cn(isAdmin && "border-2 border-primary", "w-8 h-8")}>
                          <AvatarFallback>{userProfile.username?.[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="hidden sm:block">
                            <span className="font-semibold truncate max-w-[100px]">{userProfile.username}</span>
                        </div>
                     </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                     <div className="space-y-4">
                        <h4 className="font-medium leading-none text-center">My Progress & Resources</h4>
                        <Separator />

                        {/* Level Progress */}
                        <div className="space-y-2">
                            <div className='flex justify-between items-baseline'>
                                <h5 className="font-medium">Level {level}</h5>
                                <p className="text-xs text-muted-foreground">EXP: {exp - lastLevelUpExp}/{expForNextLevel - lastLevelUpExp}</p>
                            </div>
                            <Progress value={progressPercentage} className="w-full h-2" />
                        </div>

                        <Separator />

                        {/* Resources */}
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <ShieldDisplay />
                                <div className="text-sm">
                                    <p className="font-medium">Shields</p>
                                    <p className="text-muted-foreground">Your chances for challenging games. Each mistake costs half a shield.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                 <div className="flex items-center gap-2 pt-0.5">
                                    <Key className="w-5 h-5 text-yellow-500" />
                                    <span className="font-semibold">{wisdomKeys}</span>
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium">Wisdom Keys</p>
                                    <p className="text-muted-foreground">Earned by leveling up. Use them for hints or to refill Shields.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex items-center gap-2 pt-0.5">
                                    <Lightbulb className="w-5 h-5 text-blue-500" />
                                    <span className="font-semibold">{hints}</span>
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium">Scholar's Lens</p>
                                    <p className="text-muted-foreground">Charges for your lens to get hints in the Verse Memory game.</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <div className="flex items-center gap-2 pt-0.5">
                                    <Coins className="w-5 h-5 text-amber-500" />
                                    <span className="font-semibold">{denarius}</span>
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium">Denarius</p>
                                    <p className="text-muted-foreground">Currency for AI features once your free charges are used.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}

const ADMIN_USERS = ['Kaya', 'Scassenger'];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setIsClient(true);
    const profileStr = localStorage.getItem('bibleQuestUser');
    if (profileStr) {
        const profile = JSON.parse(profileStr);
        setUserProfile(profile);
        if (ADMIN_USERS.includes(profile.username)) {
            setIsAdmin(true);
        }
    } else {
        router.push('/');
    }
  }, [router]);
  
  useEffect(() => {
    // This effect runs when the component mounts on the client.
    // It checks for and unregisters any active service workers.
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        if (registrations.length > 0) {
          console.log('Found old service workers, unregistering...');
          for (const registration of registrations) {
            registration.unregister();
          }
           // Reload the page to ensure the new content is fetched.
          window.location.reload();
        }
      });
    }

    const musicShouldPlay = localStorage.getItem('playMusic') === 'true';
    if (musicShouldPlay && audioRef.current) {
      audioRef.current.play().catch(console.error);
      localStorage.removeItem('playMusic'); 
    }
  }, [isClient]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  if (!userProfile) {
    return <div className="flex h-screen items-center justify-center">Loading Dashboard...</div>
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader id="sidebar-header">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="font-headline text-2xl font-bold text-primary">Bible Quest</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
         <DashboardNav isAdmin={isAdmin} />
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
             <Button variant="outline" size="icon" onClick={togglePlayPause}>
                {isPlaying ? <Pause /> : <Play />}
                <span className="sr-only">Toggle Music</span>
              </Button>
           </div>
           <UserProgressHeader userProfile={userProfile} isAdmin={isAdmin} />
        </header>
        <main id="main-content" className="flex-1 p-4 md:p-6">{children}</main>
        {isClient && (
          <audio ref={audioRef} loop onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}>
            <source src="/bg-peaceful.mp3" type="audio/mpeg" />
          </audio>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
