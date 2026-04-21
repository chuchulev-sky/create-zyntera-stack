// apps/web/src/features/modal/modal-types.ts
export type ConfirmModalPayload = {
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => Promise<void> | void;
  };
  
  export type EditUserModalPayload = {
    userId: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
    onSubmit: (data: { userId: string; name: string; role: 'user' | 'admin' }) => Promise<void>;
  };
  
  export type ModalState =
    | { type: 'none' }
    | { type: 'confirm'; payload: ConfirmModalPayload }
    | { type: 'editUser'; payload: EditUserModalPayload };