// src/pages/Admin/CreateProduct/CreateProduct.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

import CreateProduct from './CreateProduct';

// Mock axios and react-toastify
jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div>ToastContainer Mock</div>,
}));

// Mock IntersectionObserver to prevent errors during tests
beforeAll(() => {
  class MockIntersectionObserver {
    constructor() {
      this.observe = jest.fn();
      this.unobserve = jest.fn();
      this.disconnect = jest.fn();
    }
  }
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
});

describe('CreateProduct Component', () => {
  const mockCategories = [
    { _id: '1', name: 'Electronics' },
    { _id: '2', name: 'Books' },
  ];

  let originalConsoleWarn;
  let originalConsoleError;

  beforeAll(() => {
    // Preserve the original console.warn and console.error
    originalConsoleWarn = console.warn;
    originalConsoleError = console.error;

    // Mock console.warn to suppress specific React Router warnings
    console.warn = jest.fn((message, ...args) => {
      if (
        message.includes('React Router Future Flag Warning') &&
        (message.includes('v7_startTransition') ||
          message.includes('v7_relativeSplatPath'))
      ) {
        // Suppress these specific warnings
        return;
      }
      // Otherwise, call the original console.warn
      originalConsoleWarn(message, ...args);
    });

    // Mock console.error to suppress act warnings (if necessary)
    console.error = jest.fn((message, ...args) => {
      if (
        message.includes(
          'Warning: An update to CreateProduct inside a test was not wrapped in act(...)'
        )
      ) {
        // Suppress act warnings
        return;
      }
      // Otherwise, call the original console.error
      originalConsoleError(message, ...args);
    });
  });

  afterAll(() => {
    // Restore the original console methods after all tests
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage token
    localStorage.setItem('token', 'mock-token');
    // Mock axios.get for fetching categories
    axios.get.mockResolvedValueOnce({ data: mockCategories });
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <CreateProduct />
      </BrowserRouter>
    );

  test('renders the form and navigational buttons', async () => {
    renderComponent();

    // Wait for the categories to be fetched and state to be updated
    await waitFor(() => {
      // Since the categories are fetched but not directly rendered,
      // waiting ensures that the state update from setCategories is processed.
      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:5000/api/categories/get'
      );
    });

    // Basic fields
    expect(screen.getByLabelText(/product title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/product description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/product images/i)).toBeInTheDocument();

    // Price details
    expect(screen.getByLabelText(/base price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/apply discount/i)).toBeInTheDocument();

    // Shipping info
    expect(screen.getByLabelText(/free shipping/i)).toBeInTheDocument();

    // Stock
    expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();

    // "Next" button
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  test('fills out form, opens confirmation popup, and cancels', async () => {
    renderComponent();

    // Wait for categories to be fetched
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:5000/api/categories/get'
      );
    });

    // Fill out some fields
    fireEvent.change(screen.getByLabelText(/product title/i), {
      target: { value: 'New Awesome Product' },
    });

    // Click "Next"
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Confirmation popup should appear
    expect(
      screen.getByRole('heading', { name: /confirm save/i })
    ).toBeInTheDocument();

    // Click "Cancel"
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    // Popup should disappear
    expect(
      screen.queryByRole('heading', { name: /confirm save/i })
    ).not.toBeInTheDocument();
  });

  test('handles product creation success', async () => {
    axios.post.mockResolvedValueOnce({ status: 201 });

    renderComponent();

    // Wait for categories to be fetched
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:5000/api/categories/get'
      );
    });

    // Fill out required fields
    fireEvent.change(screen.getByLabelText(/product title/i), {
      target: { value: 'New Awesome Product' },
    });
    fireEvent.change(screen.getByLabelText(/base price/i), {
      target: { value: '100' },
    });
    fireEvent.change(screen.getByLabelText(/quantity/i), {
      target: { value: '50' },
    });

    // Click Next
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // "Confirm Save" popup
    expect(
      screen.getByRole('heading', { name: /confirm save/i })
    ).toBeInTheDocument();

    // Click Save
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // Wait for axios post to finish and toast to be called
    await waitFor(() => {
      // Check axios was called
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/products/add',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer mock-token',
          },
        }
      );
      // Check success toast
      expect(toast.success).toHaveBeenCalledWith(
        'Product added successfully',
        expect.any(Object)
      );
    });
  });

  test('handles product creation failure', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network error'));

    renderComponent();

    // Wait for categories to be fetched
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:5000/api/categories/get'
      );
    });

    // Fill out required fields
    fireEvent.change(screen.getByLabelText(/product title/i), {
      target: { value: 'Fail Product' },
    });
    fireEvent.change(screen.getByLabelText(/base price/i), {
      target: { value: '999' },
    });
    fireEvent.change(screen.getByLabelText(/quantity/i), {
      target: { value: '10' },
    });

    // Click Next -> then Save
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // Wait for the error toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Product addition failed',
        expect.any(Object)
      );
    });
  });
});
