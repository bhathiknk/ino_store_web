import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProductPage from './Dashboard';

jest.mock('axios');

beforeEach(() => {
    jest.clearAllMocks();
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
        return Promise.reject(new Error('Not Found'));
    });
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
    expect(firstProductImage).toHaveAttribute('src', 'http://localhost:5000/images/sample1.jpg');

    // Navigate to the next image for the first product
    const nextButton = screen.getByText('>').closest('button');
    fireEvent.click(nextButton);

    // Check that the image changes
    await waitFor(() => {
        expect(firstProductImage).toHaveAttribute('src', 'http://localhost:5000/images/sample2.jpg');
    });

    // Navigate back to the previous image
    const prevButton = screen.getByText('<').closest('button');
    fireEvent.click(prevButton);

    // Check that the image reverts to the first one
    await waitFor(() => {
        expect(firstProductImage).toHaveAttribute('src', 'http://localhost:5000/images/sample1.jpg');
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

    // Check discounted price display for the first product
    expect(screen.getByText('Discounted Price: LKR 800')).toBeInTheDocument();
    expect(screen.getByText('LKR 1000')).toHaveClass('line-through');

    // Check stock status for both products
    expect(screen.getByText('In Stock')).toHaveClass('text-green-500');
    expect(screen.getByText('Out of Stock')).toHaveClass('text-red-500');
});
