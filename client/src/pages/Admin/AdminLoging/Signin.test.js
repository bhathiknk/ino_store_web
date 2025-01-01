// Signin.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Signin from './Signin';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));
jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
    ToastContainer: () => <div>ToastContainer Mock</div>,
}));

describe('Signin Component', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useNavigate.mockReturnValue(mockNavigate);

        // Mock localStorage
        Object.defineProperty(window, 'localStorage', {
            value: {
                setItem: jest.fn(),
                getItem: jest.fn(),
                removeItem: jest.fn(),
                clear: jest.fn(),
            },
            writable: true,
        });
    });

    test('renders the Signin form', () => {
        render(<Signin />);

        expect(screen.getByRole('heading', { name: /signin/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /signin/i })).toBeInTheDocument();
    });

    test('submits the form and handles successful login (with setTimeout)', async () => {
        // Use fake timers
        jest.useFakeTimers();

        axios.post.mockResolvedValueOnce({
            data: { token: 'mockToken', _id: 'mockAdminId' },
        });

        render(<Signin />);

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'password' },
        });
        fireEvent.click(screen.getByRole('button', { name: /signin/i }));

        // Wait for the axios POST response to be handled
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:5000/api/admin/signin',
                { email: 'test@example.com', password: 'password' }
            );
            expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mockToken');
            expect(localStorage.setItem).toHaveBeenCalledWith('adminId', 'mockAdminId');
            expect(toast.success).toHaveBeenCalledWith(
                'Signin successful!',
                expect.any(Object)
            );
        });

        // Now fast-forward time so setTimeout finishes
        jest.runAllTimers();

        // Verify navigation
        expect(mockNavigate).toHaveBeenCalledWith('/Admin/ProductPage');
    });

    test('handles login failure', async () => {
        axios.post.mockRejectedValueOnce(new Error('Invalid credentials'));

        render(<Signin />);

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'wrong@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'wrongpassword' },
        });
        fireEvent.click(screen.getByRole('button', { name: /signin/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                'Signin failed! Invalid credentials.',
                expect.any(Object)
            );
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });
});
