import type { AdminField, AdminModel } from './types';

export function getVisibleFields(model?: AdminModel): AdminField[] {
  return (model?.fields ?? []).filter((f) => !f.hiddenInList);
}

export function formatCellValue(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value instanceof Date) return value.toLocaleString();
  if (typeof value === 'string') {
    const asDate = new Date(value);
    if (!Number.isNaN(asDate.getTime()) && value.includes('T')) {
      return asDate.toLocaleString();
    }
  }
  return String(value ?? '');
}