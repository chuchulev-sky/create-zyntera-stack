import { Search } from 'lucide-react';
import type { AdminModel } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type AdminToolbarProps = {
  models: AdminModel[];
  model: string;
  searchInput: string;
  onModelChange: (value: string) => void;
  onSearchInputChange: (value: string) => void;
  onSubmitSearch: () => void;
  onClearSearch: () => void;
  hasActiveSearch: boolean;
};

export function AdminToolbar({
  models,
  model,
  searchInput,
  onModelChange,
  onSearchInputChange,
  onSubmitSearch,
  onClearSearch,
  hasActiveSearch,
}: AdminToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={model} onValueChange={onModelChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Select model" />
        </SelectTrigger>
        <SelectContent>
          {models.map((m) => (
            <SelectItem key={m.key} value={m.key}>{m.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by name or email"
          value={searchInput}
          onChange={(e) => onSearchInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmitSearch();
          }}
        />
      </div>

      <Button variant="outline" onClick={onSubmitSearch}>Search</Button>
      {hasActiveSearch ? (
        <Button variant="ghost" onClick={onClearSearch}>Clear</Button>
      ) : null}
    </div>
  );
}