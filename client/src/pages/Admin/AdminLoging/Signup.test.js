// Signup.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Signup from './Signup';

// Mock axios
jest.mock('axios');

// Mock react-router-dom's useNavigate
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
    ToastContainer: () => <div>ToastContainer Mock</div>,
}));

describe('Signup Component', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useNavigate.mockReturnValue(mockNavigate);
    });

    test('renders the Signup form', () => {
        render(<Signup />);

        // Check form fields
        expect(screen.getByRole('heading', { name: /signup/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /signup/i })).toBeInTheDocument();
    });

    test('submits form and handles successful signup', async () => {
        // We'll use fake timers to handle setTimeout
        jest.useFakeTimers();

        // Mock a successful POST
        axios.post.mockResolvedValueOnce({});

        render(<Signup />);

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123456' } });

        // Submit
        fireEvent.click(screen.getByRole('button', { name: /signup/i }));

        // Wait for axios call
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:5000/api/admin/signup',
                {
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: '123456',
                }
            );
            // toast success
            expect(toast.success).toHaveBeenCalledWith(
                'Signup successful! You can now signin.',
                expect.any(Object)
            );
        });

        // Fast-forward the 3s setTimeout
        jest.runAllTimers();

        // Check navigation after the timeout
        expect(mockNavigate).toHaveBeenCalledWith('/signin');
    });

    test('handles signup failure', async () => {
        // Mock a failed POST
        axios.post.mockRejectedValueOnce(new Error('Email already exists'));

        render(<Signup />);

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '654321' } });

        // Submit
        fireEvent.click(screen.getByRole('button', { name: /signup/i }));

        // Wait for axios call
        await waitFor(() => {
            // toast error
            expect(toast.error).toHaveBeenCalledWith(
                'Signup failed! Email may already exist.',
                expect.any(Object)
            );
            // Should NOT navigate
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });
});