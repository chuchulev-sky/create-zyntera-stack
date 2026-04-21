// apps/web/src/features/admin/api.ts
import { apiRequest } from '@/api/client';

export type AdminMetaResponse = {
  models: Array<{
    key: string;
    label: string;
    primaryKey: string;
    fields: Array<{
      key: string;
      label: string;
      type: 'text' | 'email' | 'boolean' | 'enum' | 'datetime';
      required?: boolean;
      readonly?: boolean;
      hiddenInList?: boolean;
      options?: Array<{ label: string; value: string }>;
    }>;
  }>;
};

export type AdminListResponse<T = Record<string, unknown>> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export function getAdminMeta() {
  return apiRequest<AdminMetaResponse>('/admin/meta');
}

export function getAdminModelList(
  model: string,
  params: { page?: number; limit?: number; search?: string } = {},
) {
  const q = new URLSearchParams();
  if (params.page) q.set('page', String(params.page));
  if (params.limit) q.set('limit', String(params.limit));
  if (params.search) q.set('search', params.search); // fixed typo
  return apiRequest<AdminListResponse>(`/admin/${model}?${q.toString()}`);
}

export function patchAdminModel(model: string, id: string, body: Record<string, unknown>) {
  return apiRequest(`/admin/${model}/${id}`, {
    method: 'PATCH', // keep PATCH
    body,
  });
}