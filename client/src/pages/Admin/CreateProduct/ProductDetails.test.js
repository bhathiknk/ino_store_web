// ProductDetails.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// We'll mock the slider to avoid dealing with actual carousel logic
jest.mock('react-slick', () => () => <div>Slider Mock</div>);

import ProductDetails from './ProductDetails';

// Mock axios so we don't do real HTTP requests
jest.mock('axios');

// Mock react-router hooks
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
    useNavigate: jest.fn(),
}));

// Optional: mock global alert
global.alert = jest.fn();

describe('ProductDetails Component', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useParams.mockReturnValue({ id: '123' }); // The product ID
        useNavigate.mockReturnValue(mockNavigate);
    });

    test('shows loading while fetching product', () => {
        // By default, product is null initially, so "Loading..." should appear
        axios.get.mockResolvedValueOnce({
            data: {
                _id: '123',
                name: 'Test Product',
                quantity: 10,
                images: [],
            },
        });

        render(<ProductDetails />);

        // "Loading..." should be in the document before the useEffect resolves
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    test('fetches and displays product details, and handles update click', async () => {
        // Mock the GET response
        axios.get.mockResolvedValueOnce({
            data: {
                _id: '123',
                name: 'Test Product',
                quantity: 10,
                images: ['/uploads/test.jpg'],
                description: 'A test product',
                categoryDescription: 'Test Category',
                basePrice: 1000,
                isDiscount: false,
                isFreeShipping: true,
            },
        });

        render(<ProductDetails />);

        // Wait for the product to load and render
        await waitFor(() => {
            // The heading "Test Product" should appear
            expect(screen.getByText('Test Product')).toBeInTheDocument();
        });

        // Check that the update button is present
        const updateButton = screen.getByRole('button', { name: /update product/i });
        expect(updateButton).toBeInTheDocument();

        // Click the update button
        fireEvent.click(updateButton);
        expect(mockNavigate).toHaveBeenCalledWith('/Admin/update-product/123');
    });

    test('handles delete product success', async () => {
        // Mock the GET response (so the product is displayed)
        axios.get.mockResolvedValueOnce({
            data: {
                _id: '123',
                name: 'Test Product',
                quantity: 10,
                images: [],
                description: 'A test product',
                categoryDescription: 'Test Category',
                basePrice: 1000,
                isDiscount: false,
                isFreeShipping: true,
            },
        });

        // Mock the DELETE response
        axios.delete.mockResolvedValueOnce({ data: { message: 'Deleted' } });

        // Mock localStorage token
        const mockToken = 'mock-jwt-token';
        localStorage.setItem('token', mockToken);

        render(<ProductDetails />);

        // Wait for the product to load
        await waitFor(() => {
            expect(screen.getByText('Test Product')).toBeInTheDocument();
        });

        // Find and click "Delete Product" button
        const deleteButton = screen.getByRole('button', { name: /delete product/i });
        fireEvent.click(deleteButton);

        // Check axios.delete was called with correct URL and headers
        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalledWith(
                'http://localhost:5000/api/products/products/delete/123',
                {
                    headers: {
                        Authorization: `Bearer ${mockToken}`,
                    },
                }
            );
        });

        // Check that alert is called
        expect(global.alert).toHaveBeenCalledWith('Product deleted successfully');

        // Check navigation to /Admin/ProductPage
        expect(mockNavigate).toHaveBeenCalledWith('/Admin/ProductPage');
    });

    test('handles delete product failure', async () => {
        // Mock GET to load the product
        axios.get.mockResolvedValueOnce({
            data: {
                _id: '123',
                name: 'Fail Product',
                quantity: 1,
                images: [],
                description: 'A test product',
                categoryDescription: 'Test Category',
                basePrice: 1000,
                isDiscount: false,
                isFreeShipping: true,
            },
        });

        // Mock DELETE to fail
        axios.delete.mockRejectedValueOnce(new Error('Delete failed'));

        // Mock localStorage token
        localStorage.setItem('token', 'mock-jwt-token');

        render(<ProductDetails />);

        // Wait for product to appear
        await waitFor(() => {
            expect(screen.getByText('Fail Product')).toBeInTheDocument();
        });

        // Click "Delete Product"
        fireEvent.click(screen.getByRole('button', { name: /delete product/i }));

        // Wait for the async delete call
        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith('Failed to delete product');
        });

        // Should NOT navigate on error
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
