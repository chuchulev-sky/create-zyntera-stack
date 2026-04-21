export type AdminField = {
    key: string;
    label: string;
    type: 'text' | 'email' | 'boolean' | 'enum' | 'datetime';
    required?: boolean;
    readonly?: boolean;
    hiddenInList?: boolean;
    options?: Array<{ label: string; value: string }>;
  };
  
  export type AdminModel = {
    key: string;
    label: string;
    primaryKey: string;
    fields: AdminField[];
  };
  
  export type AdminMetaResponse = {
    models: AdminModel[];
  };
  
  export type AdminListResponse<T = Record<string, unknown>> = {
    items: T[];
    total: number;
    page: number;
    limit: number;
  };