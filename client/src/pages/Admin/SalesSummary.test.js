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
      return;
    }
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

    expect(screen.getByTestId('loader')).toBeInTheDocument();

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

    await waitFor(() => {
      expect(screen.getByText('Sales Summary')).toBeInTheDocument();
      expect(screen.getByText('Total Sales')).toBeInTheDocument();

      // Use regex to match text across multiple nodes (USD 5000)
      expect(
        screen.getByText(
          (content, element) => element.textContent === 'USD 5000'
        )
      ).toBeInTheDocument();

      expect(screen.getByText('Total Orders')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('Average Order Value')).toBeInTheDocument();

      // Use regex to match text across multiple nodes (USD 250.00)
      expect(
        screen.getByText(
          (content, element) => element.textContent === 'USD 250.00'
        )
      ).toBeInTheDocument();
    });

    const expectedChartData = {
      labels: ['January', 'February', 'March'],
      datasets: [
        {
          label: 'Sales Growth (USD)',
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
