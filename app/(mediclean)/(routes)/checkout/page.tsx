import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finalizare comandă | Mediclean',
  description: 'Completează comanda ta pentru produse medicale și dezinfectanți profesionali.',
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
