// src/pages/Admin/AdminLoging/Signin.test.js

import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Signin from './Signin';

// Mock axios
jest.mock('axios');

// Mock useNavigate from react-router-dom
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

    // Check for the heading
    expect(
      screen.getByRole('heading', { name: /admin signin/i })
    ).toBeInTheDocument();

    // Check for email and password input fields
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // **FIX:** Update the button name matcher to match "Sign In" with a space
    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument();
  });

  test('submits the form and handles successful login (with setTimeout)', async () => {
    // Use fake timers to handle setTimeout
    jest.useFakeTimers();

    // Mock successful POST request
    axios.post.mockResolvedValueOnce({
      data: { token: 'mockToken', _id: 'mockAdminId' },
    });

    render(<Signin />);

    // Fill in the email and password fields
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password' },
    });

    // **FIX:** Update the button name matcher to match "Sign In" with a space
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Wait for the axios POST request to be called and handled
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/admin/signin',
        { email: 'test@example.com', password: 'password' }
      );
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mockToken');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'adminId',
        'mockAdminId'
      );
      expect(toast.success).toHaveBeenCalledWith('Signin successful!', {
        position: 'top-right',
        autoClose: 3000,
      });
    });

    // Fast-forward the setTimeout to trigger navigation
    await act(async () => {
      jest.runAllTimers();
    });

    // Verify that navigation was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/Admin/ProductPage');

    // Restore real timers
    jest.useRealTimers();
  });

  test('handles login failure', async () => {
    // Mock failed POST request
    axios.post.mockRejectedValueOnce(new Error('Invalid credentials'));

    render(<Signin />);

    // Fill in the email and password fields with wrong credentials
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });

    // **FIX:** Update the button name matcher to match "Sign In" with a space
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Wait for the error toast to be called
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Signin failed! Invalid credentials.',
        {
          position: 'top-right',
          autoClose: 5000,
        }
      );
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
