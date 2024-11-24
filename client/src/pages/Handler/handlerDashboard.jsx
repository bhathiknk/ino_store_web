import React from 'react';

const HandlerDashboard = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded shadow-md">
                <h1 className="text-3xl font-bold text-center">Handler Dashboard</h1>
                <p className="text-center">This is where handlers can manage admin approvals, view pending requests, and more.</p>
            </div>
        </div>
    );
};

export default HandlerDashboard;
