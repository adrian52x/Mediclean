import { cn } from '@/lib/utils';

export function Separator({ className }: { className?: string }) {
  return (
    <hr
      className={cn(
        'my-4 h-px border-0 bg-neutral-200 dark:bg-neutral-800',
        className,
      )}
    />
  );
}
