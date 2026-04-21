// apps/web/src/pages/admin-page.tsx
import { getAdminMeta, getAdminModelList, patchAdminModel } from '@/features/admin/api';
import { getVisibleFields } from '@/features/admin/helpers';
import { useModal } from '@/hooks/use-modal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { AdminKpiCards } from '@/features/admin/components/admin-kpi-cards';
import { AdminPageHeader } from '@/features/admin/components/admin-page-header';
import { AdminUsersSection } from '@/features/admin/components/admin-users-section';

type AdminRow = Record<string, unknown>;

export function AdminPage() {
  const qc = useQueryClient();
  const { openModal } = useModal();

  const [model] = useState('users');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const metaQuery = useQuery({
    queryKey: ['admin-meta'],
    queryFn: getAdminMeta,
  });

  const listQuery = useQuery({
    queryKey: ['admin-list', model, search],
    queryFn: () => getAdminModelList(model, { page: 1, limit: 20, search: search || undefined }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      patchAdminModel(model, id, payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin-list', model] });
    },
  });

  const usersModel = metaQuery.data?.models.find((m) => m.key === model);
  const rows = (listQuery.data?.items ?? []) as AdminRow[];
  const visibleFields = useMemo(() => getVisibleFields(usersModel), [usersModel]);

  const isLoading = metaQuery.isPending || listQuery.isPending;
  const hasError = Boolean(metaQuery.error || listQuery.error);

  const totalUsers = listQuery.data?.total ?? rows.length;
  const adminCount = rows.filter((r) => r.role === 'admin').length;
  const verifiedCount = rows.filter((r) => r.emailVerified === true).length;

  function handleRefresh() {
    void qc.invalidateQueries({ queryKey: ['admin-list', model] });
  }

  function handleEdit(row: AdminRow) {
    openModal({
      type: 'editUser',
      payload: {
        userId: String(row.id),
        email: String(row.email ?? ''),
        name: String(row.name ?? ''),
        role: row.role === 'admin' ? 'admin' : 'user',
        onSubmit: async ({ userId, name, role }) => {
          await updateMutation.mutateAsync({
            id: userId,
            payload: { name, role },
          });
        },
      },
    });
  }

  return (
    <main className="space-y-6">
      <AdminPageHeader onRefresh={handleRefresh} />

      <AdminKpiCards
        loading={isLoading}
        totalUsers={totalUsers}
        adminCount={adminCount}
        verifiedCount={verifiedCount}
      />

      <AdminUsersSection
        fields={visibleFields}
        rows={rows}
        searchInput={searchInput}
        search={search}
        loading={isLoading}
        hasError={hasError}
        onSearchInputChange={setSearchInput}
        onApplySearch={() => setSearch(searchInput.trim())}
        onClearSearch={() => {
          setSearch('');
          setSearchInput('');
        }}
        onEdit={handleEdit}
      />
    </main>
  );
}