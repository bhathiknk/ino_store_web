import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/admin/signup', { name, email, password });
            setMessage('Signup successful!');
            localStorage.setItem('adminId', response.data._id);
            toast.success('Signup successful!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setTimeout(() => navigate('/signin'), 2000);
        } catch (error) {
            setMessage('Signup failed!');
            toast.error('Signup failed!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold text-center">Signup</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <button type="submit"
                            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600">
                        Signup
                    </button>
                </form>
                {message && <p className="mt-4 text-center">{message}</p>}
                <div className="text-center">
                    <button
                        onClick={() => navigate('/signin')}
                        className="mt-4 text-blue-500 hover:underline"
                    >
                        Already have an account? Signin
                    </button>
                </div>
                <ToastContainer/>
            </div>
        </div>
    );
};

export default Signup;
