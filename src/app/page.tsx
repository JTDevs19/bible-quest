'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // This will redirect all users from the root page ('/') to the dashboard.
    // It's a temporary change for testing purposes as requested.
    router.replace('/dashboard');
  }, [router]);

  // Render a loading state while redirecting
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p>Loading your dashboard...</p>
    </div>
  );
}
