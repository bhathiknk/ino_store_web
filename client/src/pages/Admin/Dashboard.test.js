// src/pages/Admin/Dashboard.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Modal from 'react-modal';
import ProductPage from './Dashboard'; // Ensure this path is correct

// Mock `socket.io-client` before importing the component
jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  })),
}));

// Preserve the original console.warn
const originalWarn = console.warn;

// Suppress specific React Router warnings
beforeAll(() => {
  console.warn = (message, ...args) => {
    if (
      typeof message === 'string' &&
      (message.includes('React Router Future Flag Warning') ||
        message.includes('Relative route resolution within Splat routes'))
    ) {
      // Ignore these specific warnings
      return;
    }
    originalWarn(message, ...args);
  };
});

afterAll(() => {
  // Restore the original console.warn after all tests
  console.warn = originalWarn;
});

// If your component uses `react-modal`, set up the app element
Modal.setAppElement(document.createElement('div'));

jest.mock('axios');

beforeEach(() => {
  jest.clearAllMocks();

  // Set a mock token in localStorage if your component uses it
  localStorage.setItem('token', 'test-token');

  // Mocking Axios GET requests
  axios.get.mockImplementation((url) => {
    if (url === 'http://localhost:5000/api/products/my-products') {
      return Promise.resolve({
        data: [
          {
            _id: 'product123',
            name: 'Sample Product',
            images: ['/images/sample1.jpg', '/images/sample2.jpg'],
            basePrice: 1000,
            discountPrice: 800,
            isDiscount: true,
            quantity: 5,
          },
          {
            _id: 'product456',
            name: 'Another Product',
            images: ['/images/sample3.jpg'],
            basePrice: 1500,
            isDiscount: false,
            quantity: 0,
          },
        ],
      });
    }
    if (url === 'http://localhost:5000/api/admin/details') {
      // Mock response for fetching admin details
      return Promise.resolve({
        data: { name: 'Admin User' },
      });
    }
    return Promise.reject(new Error('Not Found'));
  });

  // Mocking Axios PUT requests if your component makes any
  axios.put.mockImplementation((url) => {
    if (url === 'http://localhost:5000/api/products/update') {
      return Promise.resolve({});
    }
    return Promise.reject(new Error('Not Found'));
  });
});

afterEach(() => {
  // Clean up localStorage after each test
  localStorage.clear();
});

test('renders products and handles image navigation', async () => {
  render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<ProductPage />} />
      </Routes>
    </MemoryRouter>
  );

  // Wait for products to load
  await waitFor(() => {
    expect(screen.getByText('Sample Product')).toBeInTheDocument();
    expect(screen.getByText('Another Product')).toBeInTheDocument();
  });

  // Check initial image for the first product
  const firstProductImage = screen.getByAltText('Sample Product');
  expect(firstProductImage).toHaveAttribute(
    'src',
    'http://localhost:5000/images/sample1.jpg'
  );

  // Navigate to the next image for the first product
  const nextButton = screen.getByRole('button', { name: 'Next >' });
  fireEvent.click(nextButton);

  // Check that the image changes
  await waitFor(() => {
    expect(firstProductImage).toHaveAttribute(
      'src',
      'http://localhost:5000/images/sample2.jpg'
    );
  });

  // Navigate back to the previous image
  const prevButton = screen.getByRole('button', { name: '< Prev' });
  fireEvent.click(prevButton);

  // Check that the image reverts to the first one
  await waitFor(() => {
    expect(firstProductImage).toHaveAttribute(
      'src',
      'http://localhost:5000/images/sample1.jpg'
    );
  });
});

test('displays correct product information', async () => {
  render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<ProductPage />} />
      </Routes>
    </MemoryRouter>
  );

  // Wait for products to load
  await waitFor(() => {
    expect(screen.getByText('Sample Product')).toBeInTheDocument();
    expect(screen.getByText('Another Product')).toBeInTheDocument();
  });

  // Check discounted price
  expect(screen.getByText('Discounted: USD 800')).toBeInTheDocument();
  expect(screen.getByText('USD 1000')).toHaveClass('line-through');

  // Check stock status for both products
  expect(screen.getByText('In Stock')).toHaveClass('text-green-600');
  expect(screen.getByText('Out of Stock')).toHaveClass('text-red-500');
});
