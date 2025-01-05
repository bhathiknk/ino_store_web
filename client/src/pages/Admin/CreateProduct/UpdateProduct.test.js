// UpdateProduct.test.js

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { toast } from 'react-toastify';
import UpdateProduct from './UpdateProduct';

// Mock dependencies
jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div>ToastContainer Mock</div>,
}));

describe('UpdateProduct Component', () => {
  // Mock functions
  let originalConsoleWarn;
  let originalConsoleError;

  beforeAll(() => {
    // Preserve the original console.warn and console.error
    originalConsoleWarn = console.warn;
    originalConsoleError = console.error;

    // Mock console.warn to suppress React Router warnings
    console.warn = jest.fn();

    // Mock console.error to suppress expected error logs
    console.error = jest.fn();
  });

  afterAll(() => {
    // Restore the original console methods after all tests
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('token', 'mock-token');
  });

  test('fetches existing product data and displays it', async () => {
    // Mock product fetch
    axios.get
      .mockResolvedValueOnce({
        data: {
          name: 'Old Product Name',
          categoryDescription: 'Old Category',
          description: 'Old Description',
          basePrice: 500,
          discountPrice: 400,
          isDiscount: true,
          isFreeShipping: false,
          shippingCost: 50,
          quantity: 10,
          images: ['/images/test.jpg'],
        },
      })
      // Mock categories fetch
      .mockResolvedValueOnce({
        data: [{ name: 'Category 1', description: 'cat1, cat2' }],
      });

    render(
      <MemoryRouter initialEntries={['/Admin/update-product/123']}>
        <Routes>
          <Route path="/Admin/update-product/:id" element={<UpdateProduct />} />
          {/* Mocked ProductPage route */}
          <Route
            path="/Admin/ProductPage"
            element={<div>Mock ProductPage</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the product data to be displayed
    await waitFor(() => {
      expect(screen.getByDisplayValue('Old Product Name')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Old Category')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Old Description')).toBeInTheDocument();
    });
  });

  test('handles update product success', async () => {
    // Mock product fetch
    axios.get
      .mockResolvedValueOnce({
        data: {
          name: 'Old Product Name',
          categoryDescription: 'Old Category',
          description: 'Some Desc',
          basePrice: 100,
          discountPrice: 90,
          isDiscount: true,
          isFreeShipping: false,
          shippingCost: 20,
          quantity: 5,
          images: [],
        },
      })
      // Mock categories fetch
      .mockResolvedValueOnce({ data: [] });

    // Mock PUT success
    axios.put.mockResolvedValueOnce({});

    render(
      <MemoryRouter initialEntries={['/Admin/update-product/123']}>
        <Routes>
          <Route path="/Admin/update-product/:id" element={<UpdateProduct />} />
          <Route
            path="/Admin/ProductPage"
            element={<div>Mock ProductPage</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    // Wait for product data to be displayed
    await waitFor(() => {
      expect(screen.getByDisplayValue('Old Product Name')).toBeInTheDocument();
    });

    // Click "Update Product" button
    const updateButton = screen.getByRole('button', {
      name: /update product/i,
    });
    fireEvent.click(updateButton);

    // Wait for the PUT call and success toast
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:5000/api/products/products/update/123',
        expect.any(FormData),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-token',
          }),
        })
      );
      expect(toast.success).toHaveBeenCalledWith(
        'Product updated successfully!',
        expect.any(Object)
      );
    });
  });

  test('handles update product failure', async () => {
    // Mock product fetch
    axios.get
      .mockResolvedValueOnce({
        data: {
          name: 'Fail Product',
          categoryDescription: 'Fail Category',
          description: 'Fail Desc',
          basePrice: 999,
          discountPrice: 0,
          isDiscount: false,
          isFreeShipping: true,
          shippingCost: 0,
          quantity: 5,
          images: [],
        },
      })
      // Mock categories fetch
      .mockResolvedValueOnce({ data: [] });

    // Mock PUT failure
    axios.put.mockRejectedValueOnce(new Error('Update error'));

    render(
      <MemoryRouter initialEntries={['/Admin/update-product/123']}>
        <Routes>
          <Route path="/Admin/update-product/:id" element={<UpdateProduct />} />
          <Route
            path="/Admin/ProductPage"
            element={<div>Mock ProductPage</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    // Wait for product data to be displayed
    await waitFor(() => {
      expect(screen.getByDisplayValue('Fail Product')).toBeInTheDocument();
    });

    // Trigger update
    const updateButton = screen.getByRole('button', {
      name: /update product/i,
    });
    fireEvent.click(updateButton);

    // Wait for the error toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to update product',
        expect.any(Object)
      );
    });

    // Optionally, you can verify that console.error was called
    expect(console.error).toHaveBeenCalledWith(
      'Error updating product:',
      expect.any(Error)
    );
  });
});
