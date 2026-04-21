import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2 } from 'lucide-react';

type AdminEditUserDialogProps = {
  open: boolean;
  record: Record<string, unknown> | null;
  saving: boolean;
  hasError: boolean;
  onClose: () => void;
  onSubmit: (payload: { id: string; name: string; role: string }) => Promise<void>;
};

export function AdminEditUserDialog({
  open,
  record,
  saving,
  hasError,
  onClose,
  onSubmit,
}: AdminEditUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>Update editable fields and save changes.</DialogDescription>
        </DialogHeader>

        {record ? (
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              await onSubmit({
                id: String(record.id),
                name: String(fd.get('name') ?? ''),
                role: String(fd.get('role') ?? 'user'),
              });
            }}
          >
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm">{String(record.email ?? '')}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="edit-name">Name</label>
              <Input id="edit-name" name="name" defaultValue={String(record.name ?? '')} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="edit-role">Role</label>
              <select
                id="edit-role"
                name="role"
                defaultValue={String(record.role ?? 'user')}
                className="h-9 w-full rounded-4xl border border-input bg-input/30 px-3 text-sm"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {hasError ? (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle>Update failed</AlertTitle>
                <AlertDescription>Please try again.</AlertDescription>
              </Alert>
            ) : null}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-1 size-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  'Save changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}