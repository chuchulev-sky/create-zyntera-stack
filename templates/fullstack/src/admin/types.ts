export type AdminModelKey = 'users';

export type AdminFieldType = 'text' | 'email' | 'boolean' | 'enum' | 'datetime';

export type AdminFieldMeta = {
    key: string;
    label: string;
    type: AdminFieldType;
    required?: boolean;
    readonly?: boolean;
    hiddenInList?: boolean;
    options?: Array<{ label: string; value: string }>;
};

export type AdminModelMeta = {
    key: AdminModelKey;
    label: string;
    primaryKey: string;
    list: {
        defaultSort?: { field: string; direction: 'asc' | 'desc' };
        pageSize?: number;
    };
    permissions: {
        canList: boolean;
        canCreate: boolean;
        canUpdate: boolean;
        canDelete: boolean;
    };
    fields: AdminFieldMeta[];
};

export type AdminListQuery = {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
};

export type AdminListResult<T> = {
    items: T[];
    total: number;
    page: number;
    limit: number;
};