import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import ViewOrder from './ViewOrder';

jest.mock('axios');

beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockImplementation((url) => {
        if (url === 'http://localhost:5000/api/admin') {
            return Promise.resolve({
                data: {
                    name: 'Admin User',
                    email: 'admin@example.com',
                },
            });
        }
        if (url === 'http://localhost:5000/api/orders/seller') {
            return Promise.resolve({
                data: [
                    {
                        _id: 'order123',
                        buyer: {
                            name: 'John Doe',
                            email: 'john@example.com',
                        },
                        totalAmount: 200,
                        paymentMethod: 'Card',
                        paidAt: '2025-01-01T15:30:00',
                        orderStatus: 'Processing',
                        products: [
                            {
                                product: {
                                    _id: 'product123',
                                    name: 'Sample Product',
                                    images: ['/images/sample.jpg'],
                                },
                                quantity: 2,
                            },
                        ],
                        shippingDetails: {
                            address: '123 Main Street',
                            province: 'Province A',
                            zipcode: '10000',
                            contactNumber: '1234567890',
                        },
                    },
                ],
            });
        }
        return Promise.reject(new Error('Not Found'));
    });
});

test('renders orders and handles status change correctly', async () => {
    render(
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<ViewOrder />} />
            </Routes>
        </MemoryRouter>
    );

    // Wait for orders to load
    await waitFor(() => {
        expect(screen.getByText((content, element) => {
            return element.textContent === 'Order ID: order123';
        })).toBeInTheDocument();
    });

    // Simulate status change
    const statusDropdown = screen.getByRole('combobox');
    fireEvent.change(statusDropdown, { target: { value: 'Packed' } });

    const updateButton = screen.getByRole('button', { name: /update/i });
    fireEvent.click(updateButton);

    // Mock the status change API
    axios.put.mockResolvedValueOnce({});

    // Wait for success message
    await waitFor(() => {
        expect(screen.getByText(/order status updated successfully/i)).toBeInTheDocument();
    });
});

test('searches for an order correctly', async () => {
    render(
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<ViewOrder />} />
            </Routes>
        </MemoryRouter>
    );

    // Wait for orders to load
    await waitFor(() => {
        expect(screen.getByText((content, element) => {
            return element.textContent === 'Order ID: order123';
        })).toBeInTheDocument();
    });

    // Simulate search
    const searchInput = screen.getByPlaceholderText('Search by Order ID');
    fireEvent.change(searchInput, { target: { value: 'order123' } });

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    // Verify modal shows the searched order
    await waitFor(() => {
        expect(screen.getByText(/order id: order123/i)).toBeInTheDocument();
    });
});
