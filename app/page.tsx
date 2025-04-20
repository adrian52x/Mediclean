import { Button } from '@/components/ui/button';
import React from 'react';
import { ProductDetails } from '@/types';
import { getProducts } from '@/app/actions/productActions';

export default async function Home() {
  const products = await getProducts();
  return (
    <main className="container mx-auto py-8">
      <div className="flex flex-col">
        {products.map((product: ProductDetails) => (
          <div key={product.id} className="flex flex-row">
            {/* <img src={product.image} alt={product.title} /> */}
            <div>
              <h2>Title: {product.title}</h2>
              <p>Description: {product.description}</p>
              <p>Price: {product.price}</p>
              {product.discount > 0 && <p>Discount: -{product.discount}$</p>}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        {products.map((product: ProductDetails) => (
          <div key={product.id} className="flex flex-row">
            {/* <img src={product.image} alt={product.title} /> */}
            <div>
              <h2>Title: {product.title}</h2>
              <p>Description: {product.description}</p>
              <p>Price: {product.price}</p>
              {product.discount > 0 && <p>Discount: -{product.discount}$</p>}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        {products.map((product: ProductDetails) => (
          <div key={product.id} className="flex flex-row">
            {/* <img src={product.image} alt={product.title} /> */}
            <div>
              <h2>Title: {product.title}</h2>
              <p>Description: {product.description}</p>
              <p>Price: {product.price}</p>
              {product.discount > 0 && <p>Discount: -{product.discount}$</p>}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        {products.map((product: ProductDetails) => (
          <div key={product.id} className="flex flex-row">
            {/* <img src={product.image} alt={product.title} /> */}
            <div>
              <h2>Title: {product.title}</h2>
              <p>Description: {product.description}</p>
              <p>Price: {product.price}</p>
              {product.discount > 0 && <p>Discount: -{product.discount}$</p>}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        {products.map((product: ProductDetails) => (
          <div key={product.id} className="flex flex-row">
            {/* <img src={product.image} alt={product.title} /> */}
            <div>
              <h2>Title: {product.title}</h2>
              <p>Description: {product.description}</p>
              <p>Price: {product.price}</p>
              {product.discount > 0 && <p>Discount: -{product.discount}$</p>}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        {products.map((product: ProductDetails) => (
          <div key={product.id} className="flex flex-row">
            {/* <img src={product.image} alt={product.title} /> */}
            <div>
              <h2>Title: {product.title}</h2>
              <p>Description: {product.description}</p>
              <p>Price: {product.price}</p>
              {product.discount > 0 && <p>Discount: -{product.discount}$</p>}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
