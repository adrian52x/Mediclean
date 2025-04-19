import { isAdmin } from '@/lib/middleware';
import { notFound } from 'next/navigation';
import React from 'react'

export default async function Admin() {
  const admin = await isAdmin();

  if (!admin) {
    // Render the default 404 page for non-admin users
    notFound();
  }

  return (
    <div className="text-3xl font-bold">Admin dashboard</div>
  );
}
