import React from 'react';
import Container from '../Nav/Container';
import Banner from '../Banner/Banner';
import { products } from './ClientProducts';
import { TruncateText } from '../Utils/truncate';

export default function ClientPage() {
  return (
    <div className="p-8">
      <Container>
        <div>
          <Banner />
        </div>
        {/*retview products*/ }
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl-grid-cols-5 2xl:grid-cols-6 gap:8">
          {products.map((product) => {
            return (
              <div key={product.id}>
                {/*reduced text length and retview*/ }
                {TruncateText(product.name)} 
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
