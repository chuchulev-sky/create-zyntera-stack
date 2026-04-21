import type { ModalState } from '@/features/modal/modal-types';
import { createContext } from 'react';

export type ModalContextValue = {
  modal: ModalState;
  openModal: (next: Exclude<ModalState, { type: 'none' }>) => void;
  closeModal: () => void;
};

export const ModalContext = createContext<ModalContextValue | null>(null);