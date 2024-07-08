import React from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

const products = [
  { id: 1, code: 'SWE-1', name: 'Green Sweater', price: 100, stock: 200, lowStock: false },
  { id: 2, code: 'BTS', name: 'Blue T-Shirt', price: 100, stock: 200, lowStock: true },
  { id: 3, code: 'WCS', name: 'White Casual Shirt', price: 100, stock: 200, lowStock: false },
  { id: 4, code: 'SWE-2', name: 'Pink Sweater', price: 100, stock: 200, lowStock: false },
  { id: 5, code: 'SWE', name: 'Jeans', price: 100, stock: 200, lowStock: false },
  { id: 6, code: 'SWE-3', name: 'Warm Winter Sweater', price: 100, stock: 200, lowStock: false },
  { id: 7, code: 'SWE-4', name: 'Red Winter Sweater', price: 100, stock: 200, lowStock: true },
  { id: 8, code: 'SWE-5', name: 'Men Sweater', price: 100, stock: 200, lowStock: false },
];

const Dashboard = () => {
  return (
    <div className="p-4">
      <Navbar />

      <div className="flex justify-between items-center mt-6 mb-4">
        <div className="text-lg">Products</div>
        <Link to="/create-product" className="bg-blue-500 text-white py-2 px-4 rounded">
          + Create New Product
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <div key={product.id} className="border p-4 rounded-lg flex flex-col items-center">
              <div className="mb-2 flex justify-center">
                <img src={`${process.env.PUBLIC_URL}/Assets/${product.code}.jpg`} alt={product.name} className="h-40 w-40 object-cover" />
              </div>
              <div className="text-center mb-2">
                <div className="font-bold">{product.name}</div>
                <div className="text-gray-500">Code: {product.code}</div>
                <div className="text-green-500">${product.price}</div>
              </div>
              <div className="text-center">
                <div>On hand: {product.stock} items</div>
                {product.lowStock && <div className="text-red-500 font-bold">Low-Stock Alerts</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
