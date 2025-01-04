// src/pages/Admin/SalesSummary.test.js

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import SalesSummary from './SalesSummary';

// Mock Navbar to prevent actual API calls or side effects
jest.mock(
  './Navbar',
  () =>
    function () {
      return <div>Mock Navbar</div>;
    }
);

// Mock react-chartjs-2's Bar component
jest.mock('react-chartjs-2', () => ({
  Bar: (props) => (
    <div data-testid="mock-bar-chart">{JSON.stringify(props.data)}</div>
  ),
}));

// Suppress specific React Router Future Flag warnings
beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation((msg, ...args) => {
    if (
      typeof msg === 'string' &&
      (msg.includes('React Router Future Flag Warning') ||
        msg.includes('Relative route resolution within Splat routes'))
    ) {
      // Ignore these specific warnings
      return;
    }
    // Otherwise, call original console.warn
    console.warn(msg, ...args);
  });
});

afterAll(() => {
  console.warn.mockRestore();
});

jest.mock('axios');

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

    // Ensure the loading state is shown by checking for the loader
    expect(screen.getByTestId('loader')).toBeInTheDocument();

    // Resolve the promise to move past loading
    await act(async () => {
      resolvePromise({
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
    });

    // Wait for the loading to disappear
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });
  });

  test('renders error state', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch sales summary'));

    render(
      <MemoryRouter>
        <SalesSummary />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Check for the presence of both "Error:" and "Failed to fetch sales summary"
      expect(screen.getByText('Error:')).toBeInTheDocument();
      expect(
        screen.getByText('Failed to fetch sales summary')
      ).toBeInTheDocument();
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
      expect(screen.getByText('Total Sales')).toBeInTheDocument();
      expect(screen.getByText('LKR 5000')).toBeInTheDocument();
      expect(screen.getByText('Total Orders')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('Average Order Value')).toBeInTheDocument();
      expect(screen.getByText('LKR 250')).toBeInTheDocument();
    });

    // Verify chart data matches the component's configuration
    const expectedChartData = {
      labels: ['January', 'February', 'March'],
      datasets: [
        {
          label: 'Sales Growth (LKR)',
          data: [1000, 1500, 2500],
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
        },
      ],
    };

    expect(screen.getByTestId('mock-bar-chart')).toHaveTextContent(
      JSON.stringify(expectedChartData)
    );
  });
});
