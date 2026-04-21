// apps/web/src/features/admin/components/admin-page-header.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Shield } from 'lucide-react';

type AdminPageHeaderProps = {
  onRefresh: () => void;
};

export function AdminPageHeader({ onRefresh }: AdminPageHeaderProps) {
  return (
    <header className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage users, roles, and verification status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Shield className="size-3" />
            Admin Mode
          </Badge>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="mr-1 size-4" />
            Refresh
          </Button>
        </div>
      </div>
    </header>
  );
}