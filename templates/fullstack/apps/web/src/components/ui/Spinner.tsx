import { ClipLoader } from 'react-spinners';

export function Spinner({ color = '#36d7b7' }: { color?: string }) {
  return (
    <div className="inline-flex items-center justify-center">
      <ClipLoader color={color} loading size={40} aria-label="Loading Spinner" data-testid="loader" />
    </div>
  );
}