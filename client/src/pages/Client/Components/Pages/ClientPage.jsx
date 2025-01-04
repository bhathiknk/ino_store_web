import React, { useEffect, useState } from 'react';
import Container from '../Nav/Container';
import Banner from '../Banner/Banner';
import ProductCard from '../Products/ProductCard';

export default function ClientPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/products/user/products'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="font-normal text-2xl py-10 px-10">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="font-normal text-red-600 text-2xl border border-red-600 p-4 rounded-lg">
          Error: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100">
      {' '}
      {/* white default */}
      <Container>
        <div>
          <Banner />
        </div>
        {/* Display products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} data={product} />
          ))}
        </div>
      </Container>
    </div>
  );
}
