'use server';

import prisma from '@/prisma/prisma';
import { supabaseServer } from '@/lib/supabase/server';

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

export async function getProductsImages() {
  const supabase = await supabaseServer();

  // Fetch the list of files in the `product-images` bucket
  const { data: files, error } = await supabase.storage
    .from('product-images') // Replace with your bucket name
    .list();

  if (error) {
    console.error('Error fetching product images:', error.message);
    return [];
  }

  // Generate public URLs for the images
  const images = files.map((file) => {
    const { data } = supabase.storage
      .from('product-images') // Replace with your bucket name
      .getPublicUrl(file.name);

    return {
      name: file.name,
      url: data.publicUrl,
    };
  });

  return images;
}

export async function getServicesImages() {
  const supabase = await supabaseServer();

  // Fetch the list of files in the `services-images` bucket
  const { data: files, error } = await supabase.storage
    .from('services-images') // Replace with your bucket name
    .list();

  if (error) {
    console.error('Error fetching services images:', error.message);
    return [];
  }

  // Generate public URLs for the images
  const images = files.map((file) => {
    const { data } = supabase.storage
      .from('services-images') // Replace with your bucket name
      .getPublicUrl(file.name);

    return {
      name: file.name,
      url: data.publicUrl,
    };
  });

  return images;
}
