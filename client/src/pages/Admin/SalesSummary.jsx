import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Admin/Navbar';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const SalesSummary = () => {
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

                const { data } = await axios.get('http://localhost:5000/api/sales/summary', config);
                setSummary(data);
                setLoading(false);
            } catch (error) {
                setError(error.response?.data?.message || error.message);
                setLoading(false);
            }
        };

        fetchSalesSummary();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="text-red-500 text-center mt-4">Error: {error}</div>;

    const salesGrowthLabels = Object.keys(summary.salesGrowth || {});
    const salesGrowthData = Object.values(summary.salesGrowth || {}).map(item => item.total);

    return (
        <div className="bg-gray-100 min-h-screen p-4">
            <Navbar />
            <div className="container mx-auto p-4">
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4">Sales Summary</h2>
                    <p><strong>Total Sales:</strong> LKR {summary.totalSales}</p>
                    <p><strong>Total Orders:</strong> {summary.totalOrders}</p>
                    <p><strong>Average Order Value:</strong> LKR {summary.averageOrderValue}</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">Sales Growth</h2>
                    <div className="w-full max-w-xl mx-auto"> {/* Adjust the max-width to control the size */}
                        <Bar
                            data={{
                                labels: salesGrowthLabels,
                                datasets: [
                                    {
                                        label: 'Sales Growth',
                                        data: salesGrowthData,
                                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                        borderColor: 'rgba(75, 192, 192, 1)',
                                        borderWidth: 1,
                                    },
                                ],
                            }}
                            width={600} // Set the width
                            height={400} // Set the height
                            options={{
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesSummary;
