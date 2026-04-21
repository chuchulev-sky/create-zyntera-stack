import type { AdminModelMeta } from "./types.js";

export const adminRegistry: Record<string, AdminModelMeta> = {
    users: {
        key: 'users',
        label: 'Users',
        primaryKey: 'id',
        list: {
            defaultSort: { field: 'createdAt', direction: 'desc' },
            pageSize: 20,
        },
        permissions: {
            canList: true,
            canCreate: true,
            canUpdate: true,
            canDelete: true,
        },
        fields: [
            { key: 'id', label: 'ID', type: 'text', readonly: true },
            { key: 'name', label: 'Name', type: 'text', required: true },
            { key: 'email', label: 'Email', type: 'email', required: true, readonly: true },
            { key: 'emailVerified', label: 'Email Verified', type: 'boolean', readonly: true },
            {
                key: 'role',
                label: 'Role',
                type: 'enum',
                required: true,
                options: [
                    { label: 'User', value: 'user' },
                    { label: 'Admin', value: 'admin' },
                ],
            },
            { key: 'createdAt', label: 'Created', type: 'datetime', readonly: true },
            { key: 'updatedAt', label: 'Updated', type: 'datetime', readonly: true },
        ]
    }
}

export function getAdminModelMeta(model: string) {
    return adminRegistry[model] ?? null;
}

export function getAdminMetaList() {
    return Object.values(adminRegistry);
}