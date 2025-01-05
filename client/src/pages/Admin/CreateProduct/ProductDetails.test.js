// ProductDetails.test.js

import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

import ProductDetails from './ProductDetails';

jest.mock(
  'react-slick',
  () =>
    function () {
      return <div>Slider Mock</div>;
    }
);
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

global.alert = jest.fn();

describe('ProductDetails Component', () => {
  const mockNavigate = jest.fn();

  beforeAll(() => {
    // Mock console.error to suppress error messages in test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    // Restore console.error after tests complete
    console.error.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ id: '123' });
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('shows loading while fetching product', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        _id: '123',
        name: 'Test Product',
        quantity: 10,
        images: [],
      },
    });

    render(<ProductDetails />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  test('fetches and displays product details', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        _id: '123',
        name: 'Test Product',
        quantity: 10,
        images: ['/uploads/test.jpg'],
        description: 'A test product',
      },
    });

    await act(async () => {
      render(<ProductDetails />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });

  test('handles delete product success', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        _id: '123',
        name: 'Test Product',
        images: [],
      },
    });

    axios.delete.mockResolvedValueOnce({ data: { message: 'Deleted' } });
    localStorage.setItem('token', 'mock-token');

    await act(async () => {
      render(<ProductDetails />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/delete product/i));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Product deleted successfully');
      expect(mockNavigate).toHaveBeenCalledWith('/Admin/ProductPage');
    });
  });

  test('handles delete product failure', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        _id: '123',
        name: 'Test Product',
        images: [],
      },
    });

    axios.delete.mockRejectedValueOnce(new Error('Delete failed'));
    localStorage.setItem('token', 'mock-token');

    await act(async () => {
      render(<ProductDetails />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/delete product/i));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Failed to delete product');
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
