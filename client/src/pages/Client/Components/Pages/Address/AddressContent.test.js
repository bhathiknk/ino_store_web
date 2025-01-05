// src/pages/Client/Components/Pages/Address/AddressContent.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

import AddressContent from './AddressContent';

// Mock axios and react-toastify
jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div>ToastContainer Mock</div>,
}));

// Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('AddressContent Component', () => {
  const mockAddress = {
    _id: 'address123',
    address: '123 Main St',
    province: 'Ontario',
    zipcode: 'A1B 2C3',
    contactNumber: '123-456-7890',
  };

  beforeAll(() => {
    // Preserve the original console.warn and console.error
    jest.spyOn(console, 'warn').mockImplementation((message, ...args) => {
      if (
        message.includes('React Router Future Flag Warning') &&
        (message.includes('v7_startTransition') ||
          message.includes('v7_relativeSplatPath'))
      ) {
        // Suppress specific React Router warnings
        return;
      }
      // Otherwise, log the warning
      console.warn.mock.calls.push([message, ...args]);
    });

    jest.spyOn(console, 'error').mockImplementation((message, ...args) => {
      // Suppress specific act warnings
      if (
        message.includes(
          'Warning: An update to AddressContent inside a test was not wrapped in act(...)'
        )
      ) {
        return;
      }
      // Otherwise, log the error
      console.error.mock.calls.push([message, ...args]);
    });
  });

  afterAll(() => {
    // Restore the original console methods
    console.warn.mockRestore();
    console.error.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage token
    localStorage.setItem('userToken', 'mock-user-token');
    // Mock axios.get for fetching address details
    axios.get.mockResolvedValue({ data: [mockAddress] });
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <AddressContent />
      </BrowserRouter>
    );

  test('fetches and displays address details on mount', async () => {
    renderComponent();

    // Wait for axios.get to be called and state to be updated
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:5000/api/address/user',
        {
          headers: {
            Authorization: 'Bearer mock-user-token',
          },
        }
      );
    });

    // Use findByText to wait for the address to appear
    expect(await screen.findByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('Province')).toBeInTheDocument();
    expect(screen.getByText('Ontario')).toBeInTheDocument();
    expect(screen.getByText('ZIP Code')).toBeInTheDocument();
    expect(screen.getByText('A1B 2C3')).toBeInTheDocument();
    expect(screen.getByText('Mobile Number')).toBeInTheDocument();
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
  });

  test('handleEditClick toggles editing mode', async () => {
    renderComponent();

    // Wait for data fetching
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });

    // Click the "Edit" button
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    // Check that the editing form appears
    expect(screen.getByText('Edit Address')).toBeInTheDocument();

    // Use getByDisplayValue to find inputs
    expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Ontario')).toBeInTheDocument();
    expect(screen.getByDisplayValue('A1B 2C3')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123-456-7890')).toBeInTheDocument();
  });

  test('handleCancelClick exits editing mode', async () => {
    renderComponent();

    // Wait for data fetching
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });

    // Enter editing mode
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    // Click the "Cancel" button
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    // Check that the editing form is no longer present
    expect(screen.queryByText('Edit Address')).not.toBeInTheDocument();
    // Ensure the address details are still displayed
    expect(screen.getByText('Shipping Details')).toBeInTheDocument();
  });

  test('handleCheckoutClick navigates to checkout with address details', async () => {
    renderComponent();

    // Wait for axios.get to be called and state to be updated
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:5000/api/address/user',
        {
          headers: {
            Authorization: 'Bearer mock-user-token',
          },
        }
      );
    });

    // Wait for the address to be rendered to ensure state is updated
    expect(await screen.findByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('Province')).toBeInTheDocument();
    expect(screen.getByText('Ontario')).toBeInTheDocument();
    expect(screen.getByText('ZIP Code')).toBeInTheDocument();
    expect(screen.getByText('A1B 2C3')).toBeInTheDocument();
    expect(screen.getByText('Mobile Number')).toBeInTheDocument();
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();

    // Click the "Checkout" button
    const checkoutButton = screen.getByRole('button', { name: /checkout/i });
    fireEvent.click(checkoutButton);

    // Check that navigate was called with correct arguments
    expect(mockNavigate).toHaveBeenCalledWith('/checkout', {
      state: {
        address: {
          id: 'address123',
          address: '123 Main St',
          province: 'Ontario',
          zip: 'A1B 2C3',
          mobile: '123-456-7890',
        },
      },
    });
  });

  test('handleSaveClick successfully updates address and shows success toast', async () => {
    axios.put.mockResolvedValueOnce({ status: 200 });

    renderComponent();

    // Wait for data fetching
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });

    // Enter editing mode
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    // Update address fields
    const addressInput = screen.getByDisplayValue('123 Main St');
    const provinceInput = screen.getByDisplayValue('Ontario');
    const zipInput = screen.getByDisplayValue('A1B 2C3');
    const mobileInput = screen.getByDisplayValue('123-456-7890');

    fireEvent.change(addressInput, { target: { value: '456 Elm St' } });
    fireEvent.change(provinceInput, { target: { value: 'Quebec' } });
    fireEvent.change(zipInput, { target: { value: 'D4E 5F6' } });
    fireEvent.change(mobileInput, { target: { value: '987-654-3210' } });

    // Click the "Save" button
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    // Wait for the PUT request and toast
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:5000/api/address/update/address123',
        {
          address: '456 Elm St',
          province: 'Quebec',
          zipcode: 'D4E 5F6',
          contactNumber: '987-654-3210',
        },
        {
          headers: {
            Authorization: 'Bearer mock-user-token',
          },
        }
      );
      expect(toast.success).toHaveBeenCalledWith(
        'Address updated successfully!'
      );
    });

    // Check that editing mode is exited
    expect(screen.queryByText('Edit Address')).not.toBeInTheDocument();

    // Verify that updated address details are displayed
    expect(screen.getByText('456 Elm St')).toBeInTheDocument();
    expect(screen.getByText('Quebec')).toBeInTheDocument();
    expect(screen.getByText('D4E 5F6')).toBeInTheDocument();
    expect(screen.getByText('987-654-3210')).toBeInTheDocument();
  });

  test('handleSaveClick fails to update address and shows error toast', async () => {
    axios.put.mockRejectedValueOnce(new Error('Update failed'));

    renderComponent();

    // Wait for data fetching
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });

    // Enter editing mode
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    // Update address fields
    const addressInput = screen.getByDisplayValue('123 Main St');
    const provinceInput = screen.getByDisplayValue('Ontario');
    const zipInput = screen.getByDisplayValue('A1B 2C3');
    const mobileInput = screen.getByDisplayValue('123-456-7890');

    fireEvent.change(addressInput, { target: { value: '789 Oak St' } });
    fireEvent.change(provinceInput, { target: { value: 'British Columbia' } });
    fireEvent.change(zipInput, { target: { value: 'G7H 8I9' } });
    fireEvent.change(mobileInput, { target: { value: '555-555-5555' } });

    // Click the "Save" button
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    // Wait for the PUT request and toast
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:5000/api/address/update/address123',
        {
          address: '789 Oak St',
          province: 'British Columbia',
          zipcode: 'G7H 8I9',
          contactNumber: '555-555-5555',
        },
        {
          headers: {
            Authorization: 'Bearer mock-user-token',
          },
        }
      );
      expect(toast.error).toHaveBeenCalledWith('Failed to update address');
    });

    // Ensure that editing mode is still active
    expect(screen.getByText('Edit Address')).toBeInTheDocument();
  });
});
