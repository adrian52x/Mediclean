'use server';

import prisma from '@/prisma/prisma';
import { isAdmin } from '@/lib/middleware';

export async function getProducts() {
  // const admin = await isAdmin();
  // if (!admin) {
  //   throw new Error('Unauthorized: Only the admin can view products.');
  // }

  // Fetch all products from the database
  return await prisma.products.findMany();
}

export async function addProduct(data: {
  title: string;
  description: string;
  image: string;
  price: number;
  discount: number;
}) {

  // Check if the user is the admin
  // const admin = await isAdmin();
  // if (!admin) {
  //   throw new Error('Unauthorized: Only the admin can add products.');
  // }

  // Add the product
  return await prisma.products.create({
    data,
  });
}