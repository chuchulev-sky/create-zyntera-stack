import { Link } from 'react-router';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser } from '@/hooks/use-current-user';

export function HomePage() {
  const { user, hasUser, sessionPending } = useCurrentUser();

  const isLoading = sessionPending || hasUser;

  if (isLoading) {
    return (
      <main className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
        </div>
      </main>
    );
  }

  if (hasUser) {
    return (
      <main className="space-y-6">
        <Alert variant="destructive">
          <AlertTitle>Could not load your account</AlertTitle>
          <AlertDescription>
            Please refresh the page or try again later.
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {hasUser ? `Welcome back, ${user?.name ?? 'there'}!` : 'Welcome to Zyntera Blueprint'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {hasUser
            ? 'Quick overview of your account and next actions.'
            : 'Sign in or create an account to continue.'}
        </p>
      </header>

      {!hasUser ? (
        <Card>
          <CardHeader>
            <CardTitle>Get started</CardTitle>
            <CardDescription>
              Access your dashboard, track data, and manage your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/register">Create account</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Your authenticated profile details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Name:</span> {user?.name ?? '—'}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user?.email ?? '—'}
              </p>
              <div className="flex items-center gap-2">
                <span className="font-medium">Role:</span>
                <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'}>
                  {user?.role ?? 'user'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next actions</CardTitle>
              <CardDescription>Jump to the areas you use most.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link to="/app">Open app</Link>
              </Button>

              {user?.role === 'admin' ? (
                <Button asChild>
                  <Link to="/admin">Admin dashboard</Link>
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}