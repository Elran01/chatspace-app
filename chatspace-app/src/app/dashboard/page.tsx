'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, Mail, Calendar, Zap } from 'lucide-react';

function DashboardContent() {
  const { user, userProfile, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              ChatSpace Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.displayName || 'User'}!
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.photoURL || ''} />
                  <AvatarFallback>
                    {getInitials(user?.displayName || user?.email || 'U')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {user?.displayName || 'No name set'}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {user?.email}
                  </p>
                </div>
              </div>

              {userProfile && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Subscription:</span>
                    <Badge
                      variant={
                        userProfile.subscription.plan === 'free'
                          ? 'secondary'
                          : 'default'
                      }
                    >
                      {userProfile.subscription.plan}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status:</span>
                    <Badge
                      variant={
                        userProfile.subscription.status === 'active'
                          ? 'default'
                          : 'destructive'
                      }
                    >
                      {userProfile.subscription.status}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Usage Stats */}
          {userProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Usage Stats
                </CardTitle>
                <CardDescription>Your current usage this month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tokens Used:</span>
                    <span className="font-medium">
                      {userProfile.usage.tokensUsed.toLocaleString()} /{' '}
                      {userProfile.usage.limits.monthlyTokens.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${Math.min((userProfile.usage.tokensUsed / userProfile.usage.limits.monthlyTokens) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Conversations:</span>
                  <span className="font-medium">
                    {userProfile.usage.conversationsCount} /{' '}
                    {userProfile.usage.limits.conversations}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Default Model:</span>
                  <Badge variant="outline">
                    {userProfile.preferences.defaultModel}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with ChatSpace</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" disabled>
                <User className="mr-2 h-4 w-4" />
                Start New Conversation
              </Button>
              <Button variant="outline" className="w-full" disabled>
                <Calendar className="mr-2 h-4 w-4" />
                Create Project
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Features coming soon!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
