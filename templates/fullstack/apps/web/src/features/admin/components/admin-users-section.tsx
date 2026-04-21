// apps/web/src/features/admin/components/admin-users-section.tsx
import { formatCellValue } from '@/features/admin/helpers';
import type { AdminField } from '@/features/admin/types';
import { AlertCircle, Pencil, Search } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type AdminUsersSectionProps = {
  fields: AdminField[];
  rows: Record<string, unknown>[];
  searchInput: string;
  search: string;
  loading: boolean;
  hasError: boolean;
  onSearchInputChange: (value: string) => void;
  onApplySearch: () => void;
  onClearSearch: () => void;
  onEdit: (row: Record<string, unknown>) => void;
};

export function AdminUsersSection({
  fields,
  rows,
  searchInput,
  search,
  loading,
  hasError,
  onSearchInputChange,
  onApplySearch,
  onClearSearch,
  onEdit,
}: AdminUsersSectionProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Users</CardTitle>
        <CardDescription>Search, review, and edit account-level fields.</CardDescription>
        <CardAction>
          <Badge variant="secondary">{rows.length} shown</Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex w-full flex-wrap items-center gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by name or email"
              value={searchInput}
              onChange={(e) => onSearchInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onApplySearch();
              }}
            />
          </div>

          <Button variant="outline" onClick={onApplySearch}>
            <Search className="mr-1 size-4" />
            Search
          </Button>

          {search ? (
            <Button variant="ghost" onClick={onClearSearch}>
              Clear
            </Button>
          ) : null}
        </div>

        <Separator />

        {hasError ? (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Failed to load admin data</AlertTitle>
            <AlertDescription>Please refresh and try again.</AlertDescription>
          </Alert>
        ) : loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {fields.map((f) => (
                  <TableHead key={f.key}>{f.label}</TableHead>
                ))}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={fields.length + 1} className="py-8 text-center text-muted-foreground">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, i) => (
                  <TableRow key={String(row.id ?? i)}>
                    {fields.map((f) => (
                      <TableCell key={f.key}>
                        {f.key === 'role' ? (
                          <Badge variant={String(row[f.key] ?? 'user') === 'admin' ? 'default' : 'secondary'}>
                            {String(row[f.key] ?? 'user')}
                          </Badge>
                        ) : f.key === 'emailVerified' ? (
                          <Badge variant={row[f.key] === true ? 'default' : 'outline'}>
                            {row[f.key] === true ? 'Verified' : 'Unverified'}
                          </Badge>
                        ) : (
                          formatCellValue(row[f.key])
                        )}
                      </TableCell>
                    ))}

                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => onEdit(row)}>
                        <Pencil className="mr-1 size-4" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}