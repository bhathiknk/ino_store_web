import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import SalesSummary from './SalesSummary';

jest.mock('axios');
jest.mock('../Admin/Navbar', () => () => <div>Mock Navbar</div>);
jest.mock('react-chartjs-2', () => ({
    Bar: (props) => <div data-testid="mock-bar-chart">{JSON.stringify(props.data)}</div>,
}));

describe('SalesSummary Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading state', async () => {
        // Simulate a pending promise to show the loading state
        let resolvePromise;
        axios.get.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    resolvePromise = resolve;
                })
        );

        render(
            <MemoryRouter>
                <SalesSummary />
            </MemoryRouter>
        );

        // Ensure the loading state is shown
        expect(screen.getByText('Loading...')).toBeInTheDocument();

        // Resolve the promise to move past loading
        act(() => resolvePromise({ data: {} }));
    });

    test('renders error state', async () => {
        axios.get.mockRejectedValueOnce(new Error('Failed to fetch sales summary'));
        render(
            <MemoryRouter>
                <SalesSummary />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Error: Failed to fetch sales summary/i)).toBeInTheDocument();
        });
    });

    test('renders sales summary and chart data correctly', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                totalSales: 5000,
                totalOrders: 20,
                averageOrderValue: 250,
                salesGrowth: {
                    January: 1000,
                    February: 1500,
                    March: 2500,
                },
            },
        });

        render(
            <MemoryRouter>
                <SalesSummary />
            </MemoryRouter>
        );

        // Wait for the data to load
        await waitFor(() => {
            expect(screen.getByText('Sales Summary')).toBeInTheDocument();
            expect(screen.getByText('Total Sales:')).toBeInTheDocument();
            expect(screen.getByText('LKR 5000')).toBeInTheDocument();
            expect(screen.getByText('Total Orders:')).toBeInTheDocument();
            expect(screen.getByText('20')).toBeInTheDocument();
            expect(screen.getByText('Average Order Value:')).toBeInTheDocument();
            expect(screen.getByText('LKR 250')).toBeInTheDocument();
        });

        // Verify chart data
        const chartData = {
            labels: ['January', 'February', 'March'],
            datasets: [
                {
                    label: 'Sales Growth',
                    data: [1000, 1500, 2500],
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        };
        expect(screen.getByTestId('mock-bar-chart')).toHaveTextContent(JSON.stringify(chartData));
    });
});
