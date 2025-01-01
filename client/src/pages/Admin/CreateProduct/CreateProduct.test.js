// CreateProduct.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

import CreateProduct from './CreateProduct';

jest.mock('axios');
jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
    ToastContainer: () => <div>ToastContainer Mock</div>,
}));

// 1) Mock IntersectionObserver here
beforeAll(() => {
    class MockIntersectionObserver {
        constructor(callback, options) {
            // You can store these if needed for tests
            this.callback = callback;
            this.options = options;
        }
        observe(target) {
            // If needed, you can invoke the callback here to simulate an intersection
        }
        unobserve() {}
        disconnect() {}
    }
    Object.defineProperty(window, 'IntersectionObserver', {
        writable: true,
        configurable: true,
        value: MockIntersectionObserver,
    });
});

describe('CreateProduct Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock localStorage token
        localStorage.setItem('token', 'mock-token');
    });

    const renderComponent = () => {
        return render(
            <BrowserRouter>
                <CreateProduct />
            </BrowserRouter>
        );
    };

    test('renders the form and navigational buttons', () => {
        renderComponent();

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

    test('fills out form, opens confirmation popup, and cancels', () => {
        renderComponent();

        // Fill out some fields
        fireEvent.change(screen.getByLabelText(/product title/i), {
            target: { value: 'New Awesome Product' },
        });

        // Click "Next"
        fireEvent.click(screen.getByRole('button', { name: /next/i }));

        // Confirmation popup should appear
        expect(screen.getByRole('heading', { name: /confirm save/i })).toBeInTheDocument();

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
        expect(screen.getByRole('heading', { name: /confirm save/i })).toBeInTheDocument();

        // Click Save
        fireEvent.click(screen.getByRole('button', { name: /save/i }));

        // Wait for axios post to finish
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
            expect(toast.success).toHaveBeenCalledWith('Product added successfully', expect.any(Object));
        });
    });

    test('handles product creation failure', async () => {
        axios.post.mockRejectedValueOnce(new Error('Network error'));

        renderComponent();

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

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Product addition failed', expect.any(Object));
        });
    });
});
