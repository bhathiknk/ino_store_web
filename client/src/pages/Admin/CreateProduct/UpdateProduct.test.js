// UpdateProduct.test.js

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { toast } from 'react-toastify';

import UpdateProduct from './UpdateProduct';

jest.mock('axios');
jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
    ToastContainer: () => <div>ToastContainer Mock</div>,
}));

describe('UpdateProduct Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.setItem('token', 'mock-token');
    });

    test('fetches existing product data and displays it', async () => {
        // Product fetch
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
                    images: ['/images/test.jpg'], // array to avoid .concat error
                },
            })
            // Categories fetch
            .mockResolvedValueOnce({
                data: [
                    { name: 'Category 1', description: 'cat1, cat2' },
                ],
            });

        render(
            <MemoryRouter initialEntries={['/Admin/update-product/123']}>
                <Routes>
                    <Route path="/Admin/update-product/:id" element={<UpdateProduct />} />
                    {/* Add route for /Admin/ProductPage to avoid "No routes matched" warning */}
                    <Route path="/Admin/ProductPage" element={<div>Mock ProductPage</div>} />
                </Routes>
            </MemoryRouter>
        );

        // Wait for the product data
        await waitFor(() => {
            expect(screen.getByDisplayValue('Old Product Name')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Old Category')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Old Description')).toBeInTheDocument();
        });
    });

    test('handles update product success', async () => {
        // Product fetch
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
            // Categories fetch
            .mockResolvedValueOnce({ data: [] });

        // Mock PUT success
        axios.put.mockResolvedValueOnce({});

        render(
            <MemoryRouter initialEntries={['/Admin/update-product/123']}>
                <Routes>
                    <Route path="/Admin/update-product/:id" element={<UpdateProduct />} />
                    <Route path="/Admin/ProductPage" element={<div>Mock ProductPage</div>} />
                </Routes>
            </MemoryRouter>
        );

        // Wait for product data
        await waitFor(() => {
            expect(screen.getByDisplayValue('Old Product Name')).toBeInTheDocument();
        });

        // Click "Update Product"
        const updateButton = screen.getByRole('button', { name: /update product/i });
        updateButton.click();

        // Wait for the PUT call & toast
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
            // Check success toast with second arg
            expect(toast.success).toHaveBeenCalledWith(
                'Product updated successfully!',
                expect.any(Object)
            );
        });
    });

    test('handles update product failure', async () => {
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
            .mockResolvedValueOnce({ data: [] });

        // Mock PUT failure
        axios.put.mockRejectedValueOnce(new Error('Update error'));

        render(
            <MemoryRouter initialEntries={['/Admin/update-product/123']}>
                <Routes>
                    <Route path="/Admin/update-product/:id" element={<UpdateProduct />} />
                    <Route path="/Admin/ProductPage" element={<div>Mock ProductPage</div>} />
                </Routes>
            </MemoryRouter>
        );

        // Wait for product data
        await waitFor(() => {
            expect(screen.getByDisplayValue('Fail Product')).toBeInTheDocument();
        });

        // Trigger update
        const updateButton = screen.getByRole('button', { name: /update product/i });
        updateButton.click();

        await waitFor(() => {
            // Check error toast with second arg
            expect(toast.error).toHaveBeenCalledWith(
                'Failed to update product',
                expect.any(Object)
            );
        });
    });
});
