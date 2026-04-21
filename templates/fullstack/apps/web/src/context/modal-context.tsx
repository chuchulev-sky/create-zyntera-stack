import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { ModalState } from '@/features/modal/modal-types';
import { useCallback, useMemo, useState } from 'react';
import { ModalContext } from './modal-context-value';

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [busy, setBusy] = useState(false);

  // local edit-user form state in modal host
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<'user' | 'admin'>('user');

  const openModal = useCallback((next: Exclude<ModalState, { type: 'none' }>) => {
    if (next.type === 'editUser') {
      setEditName(next.payload.name);
      setEditRole(next.payload.role);
    }
    setModal(next);
  }, []);

  const closeModal = useCallback(() => {
    setModal({ type: 'none' });
    setBusy(false);
  }, []);

  const value = useMemo(
    () => ({ modal, openModal, closeModal }),
    [modal, openModal, closeModal],
  );

  async function handleConfirm() {
    if (modal.type !== 'confirm') return;
    setBusy(true);
    try {
      await modal.payload.onConfirm();
      closeModal();
    } finally {
      setBusy(false);
    }
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (modal.type !== 'editUser') return;

    setBusy(true);
    try {
      await modal.payload.onSubmit({
        userId: modal.payload.userId,
        name: editName.trim(),
        role: editRole,
      });
      closeModal();
    } finally {
      setBusy(false);
    }
  }

  return (
    <ModalContext.Provider value={value}>
      {children}

      <Dialog open={modal.type !== 'none'} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent>
          {modal.type === 'confirm' ? (
            <>
              <DialogHeader>
                <DialogTitle>{modal.payload.title}</DialogTitle>
                {modal.payload.description ? (
                  <DialogDescription>{modal.payload.description}</DialogDescription>
                ) : null}
              </DialogHeader>

              <DialogFooter>
                <Button variant="outline" onClick={closeModal} disabled={busy}>
                  {modal.payload.cancelText ?? 'Cancel'}
                </Button>
                <Button onClick={() => void handleConfirm()} disabled={busy}>
                  {busy ? 'Working...' : modal.payload.confirmText ?? 'Confirm'}
                </Button>
              </DialogFooter>
            </>
          ) : null}

          {modal.type === 'editUser' ? (
            <form className="space-y-4" onSubmit={(e) => void handleEditSubmit(e)}>
              <DialogHeader>
                <DialogTitle>Edit user</DialogTitle>
                <DialogDescription>
                  Update user profile and role.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm">{modal.payload.email}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="modal-user-name">
                  Name
                </label>
                <Input
                  id="modal-user-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="User name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="modal-user-role">
                  Role
                </label>
                <select
                  id="modal-user-role"
                  className="h-9 w-full rounded-4xl border border-input bg-input/30 px-3 text-sm"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as 'user' | 'admin')}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeModal} disabled={busy}>
                  Cancel
                </Button>
                <Button type="submit" disabled={busy}>
                  {busy ? 'Saving...' : 'Save changes'}
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  );
}