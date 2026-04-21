import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil } from 'lucide-react';
import { formatCellValue } from '../helpers';
import type { AdminField } from '../types';

type AdminUsersTableProps = {
  loading: boolean;
  fields: AdminField[];
  rows: Record<string, unknown>[];
  onEdit: (row: Record<string, unknown>) => void;
};

export function AdminUsersTable({ loading, fields, rows, onEdit }: AdminUsersTableProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {fields.map((f) => <TableHead key={f.key}>{f.label}</TableHead>)}
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={fields.length + 1} className="text-center text-muted-foreground">
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
  );
}