import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import Navbar from './Navbar';
import 'chart.js/auto';

function SalesSummary() {
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesSummary = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.get(
          'http://localhost:5000/api/sales/sales-summary',
          config
        );
        setSummary(data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
        setLoading(false);
      }
    };

    fetchSalesSummary();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="loader" />
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 bg-white p-4 rounded-lg shadow-md text-center max-w-md mx-auto mt-12">
        <strong>Error:</strong> {error}
      </div>
    );

  // Prepare data for the chart
  const salesGrowthLabels = Object.keys(summary.salesGrowth || {});
  const salesGrowthData = salesGrowthLabels.map(
    (label) => summary.salesGrowth[label] || 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Navbar />

      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Sales Summary Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
            Sales Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-100 text-blue-900 p-4 rounded-lg text-center shadow-md">
              <h3 className="text-xl font-bold">Total Sales</h3>
              <p className="text-2xl font-semibold">LKR {summary.totalSales}</p>
            </div>
            <div className="bg-green-100 text-green-900 p-4 rounded-lg text-center shadow-md">
              <h3 className="text-xl font-bold">Total Orders</h3>
              <p className="text-2xl font-semibold">{summary.totalOrders}</p>
            </div>
            <div className="bg-yellow-100 text-yellow-900 p-4 rounded-lg text-center shadow-md">
              <h3 className="text-xl font-bold">Average Order Value</h3>
              <p className="text-2xl font-semibold">
                LKR {summary.averageOrderValue}
              </p>
            </div>
          </div>
        </div>

        {/* Sales Growth Chart Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
            Sales Growth
          </h2>
          <div className="w-full max-w-4xl mx-auto">
            <Bar
              data={{
                labels: salesGrowthLabels,
                datasets: [
                  {
                    label: 'Sales Growth (LKR)',
                    data: salesGrowthData,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                  },
                ],
              }}
              width={800}
              height={500}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    beginAtZero: true,
                    ticks: {
                      color: '#333',
                    },
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      color: '#333',
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label(context) {
                        const label = context.dataset.label || '';
                        const value = context.raw;
                        return `${label}: LKR ${value}`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesSummary;
