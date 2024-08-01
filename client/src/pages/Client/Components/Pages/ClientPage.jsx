import React from 'react';
import Container from '../Nav/Container';
import Banner from '../Banner/Banner';
import { products } from './ClientProducts';
import ProductCard from '../Products/ProductCard';

export default function ClientPage() {
  return (
    <div className="p-8 bg-white">
      <Container>
        <div>
          <Banner />
        </div>
        {/* Review products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} data={product} />
          ))}
        </div>
      </Container>
    </div>
  );
}
