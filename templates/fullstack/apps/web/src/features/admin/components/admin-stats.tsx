import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Crown, Users } from 'lucide-react';

type AdminStatsProps = {
  loading: boolean;
  totalUsers: number;
  adminCount: number;
  verifiedCount: number;
};

type StatValueProps = {
  loading: boolean;
  value: number;
};

function StatValue({ loading, value }: StatValueProps) {
  return loading ? <Skeleton className="h-7 w-14" /> : <p className="text-2xl font-semibold">{value}</p>;
}

export function AdminStats({ loading, totalUsers, adminCount, verifiedCount }: AdminStatsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Users className="size-4 text-muted-foreground" />
            Total Users
          </CardTitle>
        </CardHeader>
        <CardContent><StatValue loading={loading} value={totalUsers} /></CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Crown className="size-4 text-muted-foreground" />
            Admin Users
          </CardTitle>
        </CardHeader>
        <CardContent><StatValue loading={loading} value={adminCount} /></CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 className="size-4 text-muted-foreground" />
            Verified Emails
          </CardTitle>
        </CardHeader>
        <CardContent><StatValue loading={loading} value={verifiedCount} /></CardContent>
      </Card>
    </section>
  );
}