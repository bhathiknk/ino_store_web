import React from "react";
import ClientNavBar from "../../Nav/ClientNabBar";
import ClientFooter from "../../Footer/ClientFooter";

export default function Orders() {
    // Define the orders array
    const orders = [
        {
            id: 1,
            product: "Wireless Mouse",
            status: "Shipped",
            date: "2024-12-10",
        },
        {
            id: 2,
            product: "Bluetooth Headphones",
            status: "Delivered",
            date: "2024-12-12",
        },
        {
            id: 3,
            product: "Laptop Stand",
            status: "Processing",
            date: "2024-12-15",
        },
    ];

    return (
        <div>
            <div className="bg-gray-100">
                <div className="flex flex-col min-h-screen">
                    <ClientNavBar />
                    <main className="flex-grow">
                        {/* Editable area start */}
                        <div className="max-w-6xl mx-auto px-4 py-6">
                            <h1 className="text-2xl font-bold mb-4 text-gray-800">
                                Your Orders
                            </h1>

                            {orders.length === 0 ? (
                                <p className="text-gray-600 text-center">No orders found.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                                        <thead className="bg-gray-100 border-b">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                                Order ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                                Product
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                                Order Date
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {orders.map((order) => (
                                            <tr
                                                key={order.id}
                                                className="border-b hover:bg-gray-50 transition"
                                            >
                                                <td className="px-6 py-4 text-sm text-gray-800">
                                                    {order.id}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-800">
                                                    {order.product}
                                                </td>
                                                <td
                                                    className={`px-6 py-4 text-sm font-semibold ${
                                                        order.status === "Delivered"
                                                            ? "text-green-600"
                                                            : order.status === "Shipped"
                                                                ? "text-blue-600"
                                                                : "text-yellow-600"
                                                    }`}
                                                >
                                                    {order.status}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-800">
                                                    {order.date}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                        {/* Editable area end */}
                    </main>
                    <ClientFooter />
                </div>
            </div>
        </div>
    );
}