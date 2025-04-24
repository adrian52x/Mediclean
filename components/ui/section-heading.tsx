import Link from 'next/link';
import { Button } from './button';
import { ShoppingBasketIcon } from 'lucide-react';

interface HeadingProps {
  title: string;
  description?: string;
}

export const SectionHeading: React.FC<HeadingProps> = ({
  title,
  description,
}) => {
  return (
    <div className="my-4">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};
