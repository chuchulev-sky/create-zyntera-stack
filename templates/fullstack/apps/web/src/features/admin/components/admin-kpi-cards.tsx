import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Crown, Users } from 'lucide-react';
import type { ReactNode } from 'react';

type AdminKpiCardsProps = {
  loading: boolean;
  totalUsers: number;
  adminCount: number;
  verifiedCount: number;
};

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: number;
  loading: boolean;
};

function StatCard({ icon, label, value, loading }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          {icon}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <Skeleton className="h-7 w-14" /> : <p className="text-2xl font-semibold">{value}</p>}
      </CardContent>
    </Card>
  );
}

export function AdminKpiCards({
  loading,
  totalUsers,
  adminCount,
  verifiedCount,
}: AdminKpiCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        icon={<Users className="size-4 text-muted-foreground" />}
        label="Total Users"
        value={totalUsers}
        loading={loading}
      />
      <StatCard
        icon={<Crown className="size-4 text-muted-foreground" />}
        label="Admin Users"
        value={adminCount}
        loading={loading}
      />
      <StatCard
        icon={<CheckCircle2 className="size-4 text-muted-foreground" />}
        label="Verified Emails"
        value={verifiedCount}
        loading={loading}
      />
    </section>
  );
}