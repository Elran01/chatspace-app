'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('Home page auth state:', {
      user: !!user,
      loading,
      userId: user?.uid,
    }); // Debug log

    if (!loading) {
      if (user) {
        console.log('Redirecting to dashboard...'); // Debug log
        router.push('/dashboard');
      } else {
        console.log('Redirecting to login...'); // Debug log
        router.push('/auth/login');
      }
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading ChatSpace...</p>
        </div>
      </div>
    );
  }

  // Show a brief loading state during redirect to prevent flash
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">
          {user ? 'Redirecting to dashboard...' : 'Redirecting to login...'}
        </p>
      </div>
    </div>
  );
}
