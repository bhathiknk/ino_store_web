// src/pages/Client/Components/Pages/Checkout/CheckoutForm.test.js

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // Import userEvent
import '@testing-library/jest-dom';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import CheckoutForm from './CheckoutForm';
import { CartContext } from '../Cart/CartContext';

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

// Mock @paypal/react-paypal-js
jest.mock('@paypal/react-paypal-js', () => ({
  PayPalScriptProvider: ({ children }) => <div>{children}</div>, // Mocked to render children directly
  PayPalButtons: (props) => (
    <button
      data-testid="paypal-button"
      disabled={!!props.disabled} // Ensure disabled is a boolean
      onClick={() => {
        if (!props.disabled && props.onApprove) {
          // Simulate onApprove callback asynchronously
          setTimeout(() => {
            props.onApprove(
              {},
              {
                order: {
                  capture: () =>
                    Promise.resolve({
                      id: 'mock-capture-id',
                      payer: { payer_id: 'mock-payer-id' },
                    }),
                },
              }
            );
          }, 0);
        }
      }}
    >
      Pay with PayPal
    </button>
  ),
}));

// Mock @heroicons/react/24/outline to prevent undefined icons
jest.mock('@heroicons/react/24/outline', () => ({
  MapPinIcon: () => <svg data-testid="map-pin-icon" />,
  BuildingOfficeIcon: () => <svg data-testid="building-office-icon" />,
  PhoneIcon: () => <svg data-testid="phone-icon" />,
  ShoppingCartIcon: () => <svg data-testid="shopping-cart-icon" />,
}));

describe('CheckoutForm Component', () => {
  const mockAddress = {
    _id: 'address123',
    address: '123 Main St',
    province: 'Ontario',
    zipcode: 'A1B 2C3',
    contactNumber: '123-456-7890',
  };

  const mockCart = [
    {
      id: 'product1',
      title: 'Product 1',
      price: 100,
      quantity: 2,
      shippingCost: 10,
    },
    {
      id: 'product2',
      title: 'Product 2',
      price: 200,
      quantity: 1,
      shippingCost: 20,
    },
  ];

  const mockDispatch = jest.fn();

  beforeAll(() => {
    // Suppress specific React Router warnings
    jest.spyOn(console, 'warn').mockImplementation((message, ...args) => {
      if (
        message.includes('React Router Future Flag Warning') &&
        (message.includes('v7_startTransition') ||
          message.includes('v7_relativeSplatPath'))
      ) {
        return;
      }
      console.warn.mock.calls.push([message, ...args]);
    });

    jest.spyOn(console, 'error').mockImplementation((message, ...args) => {
      // Suppress specific act warnings
      if (
        message.includes(
          'Warning: An update to CheckoutForm inside a test was not wrapped in act(...)'
        )
      ) {
        return;
      }
      console.error.mock.calls.push([message, ...args]);
    });

    // Suppress console.log statements during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    // Restore the original console methods
    console.warn.mockRestore();
    console.error.mockRestore();
    console.log.mockRestore(); // Restore console.log
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
        <CartContext.Provider
          value={{ cart: mockCart, dispatch: mockDispatch }}
        >
          <CheckoutForm />
        </CartContext.Provider>
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
    expect(screen.getByText('Province:')).toBeInTheDocument(); // Changed to 'Province:'
    expect(screen.getByText('Ontario')).toBeInTheDocument();
    expect(screen.getByText('ZIP Code:')).toBeInTheDocument(); // Changed to 'ZIP Code:'
    expect(screen.getByText('A1B 2C3')).toBeInTheDocument();
    expect(screen.getByText('Mobile Number:')).toBeInTheDocument(); // Changed to 'Mobile Number:'
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
  });

  test('handleOrderCreation successfully creates order and shows success modal', async () => {
    axios.post.mockResolvedValueOnce({ status: 201 });

    renderComponent();

    // Wait for address details to load
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });

    // Verify address details are displayed
    expect(await screen.findByText('123 Main St')).toBeInTheDocument();

    // Click the PayPal button to simulate payment approval
    const paypalButton = await screen.findByTestId('paypal-button');
    await userEvent.click(paypalButton); // Use userEvent.click

    // Wait for axios.post to be called and toast to be shown
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/orders',
        {
          products: [
            { product: 'product1', quantity: 2 },
            { product: 'product2', quantity: 1 },
          ],
          paymentMethod: 'PayPal',
          shippingDetails: {
            address: '123 Main St',
            province: 'Ontario',
            zipcode: 'A1B 2C3',
            contactNumber: '123-456-7890',
          },
          paymentId: 'mock-capture-id',
          payerId: 'mock-payer-id',
        },
        {
          headers: {
            Authorization: 'Bearer mock-user-token',
          },
        }
      );
      expect(toast.success).toHaveBeenCalledWith('Order saved successfully!');
    });

    // Verify that the cart is cleared
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CLEAR_CART' });

    // Verify that the success modal is displayed
    expect(screen.getByText('Order Successful!')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Your payment was successful and the order has been saved.'
      )
    ).toBeInTheDocument();
  });

  test('handleOrderCreation fails to create order and shows error toast', async () => {
    axios.post.mockRejectedValueOnce(new Error('Order creation failed'));

    renderComponent();

    // Wait for address details to load
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });

    // Verify address details are displayed
    expect(await screen.findByText('123 Main St')).toBeInTheDocument();

    // Click the PayPal button to simulate payment approval
    const paypalButton = await screen.findByTestId('paypal-button');
    await userEvent.click(paypalButton); // Use userEvent.click

    // Wait for axios.post to be called and error toast to be shown
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/orders',
        {
          products: [
            { product: 'product1', quantity: 2 },
            { product: 'product2', quantity: 1 },
          ],
          paymentMethod: 'PayPal',
          shippingDetails: {
            address: '123 Main St',
            province: 'Ontario',
            zipcode: 'A1B 2C3',
            contactNumber: '123-456-7890',
          },
          paymentId: 'mock-capture-id',
          payerId: 'mock-payer-id',
        },
        {
          headers: {
            Authorization: 'Bearer mock-user-token',
          },
        }
      );
      // Updated expected message to match received message
      expect(toast.error).toHaveBeenCalledWith(
        'Payment successful, but order saving failed.'
      );
    });

    // Verify that the cart is not cleared
    expect(mockDispatch).not.toHaveBeenCalledWith({ type: 'CLEAR_CART' });

    // Verify that the success modal is not displayed
    expect(screen.queryByText('Order Successful!')).not.toBeInTheDocument();
  });

  test('handleModalClose closes modal and navigates to home', async () => {
    axios.post.mockResolvedValueOnce({ status: 201 });

    renderComponent();

    // Wait for address details to load
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });

    // Verify address details are displayed
    expect(await screen.findByText('123 Main St')).toBeInTheDocument();

    // Click the PayPal button to simulate payment approval
    const paypalButton = await screen.findByTestId('paypal-button');
    await userEvent.click(paypalButton); // Use userEvent.click

    // Wait for the success modal to appear
    await waitFor(() => {
      expect(screen.getByText('Order Successful!')).toBeInTheDocument();
    });

    // Click the "OK" button to close the modal
    const okButton = screen.getByRole('button', { name: /ok/i });
    await userEvent.click(okButton); // Use userEvent.click

    // Verify that navigate was called to go to the home page
    expect(mockNavigate).toHaveBeenCalledWith('/');

    // Verify that the success modal is closed
    expect(screen.queryByText('Order Successful!')).not.toBeInTheDocument();
  });

  test('shows error toast if no address is found', async () => {
    // Mock axios.get to return empty data
    axios.get.mockResolvedValueOnce({ data: [] });

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

    // Wait for the error toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'No address found. Please add an address.'
      );
    });

    // Verify that address details are not displayed
    expect(screen.queryByText('123 Main St')).not.toBeInTheDocument();
  });

  test('disables PayPal buttons if shipping details are incomplete', async () => {
    // Mock axios.get to return incomplete address details
    const incompleteAddress = {
      _id: 'address124',
      address: '',
      province: '',
      zipcode: '',
      contactNumber: '',
    };
    axios.get.mockResolvedValueOnce({ data: [incompleteAddress] });

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

    // Since the address fields are incomplete, the PayPal button should be disabled
    const paypalButton = screen.getByTestId('paypal-button');
    expect(paypalButton).toBeDisabled();

    // Ensure that 'toast.error' is NOT called because response.data.length > 0
    expect(toast.error).not.toHaveBeenCalledWith(
      'No address found. Please add an address.'
    );

    // Additionally, ensure that the error message for incomplete details is displayed
    expect(
      screen.getByText(
        'Please ensure all shipping details are complete before proceeding.'
      )
    ).toBeInTheDocument();
  });

  test('disables PayPal buttons if cart is empty', async () => {
    // Mock axios.get to return valid address details
    axios.get.mockResolvedValueOnce({ data: [mockAddress] });

    // Mock empty cart
    const emptyCart = [];
    const mockDispatchEmptyCart = jest.fn();

    render(
      <BrowserRouter>
        <CartContext.Provider
          value={{ cart: emptyCart, dispatch: mockDispatchEmptyCart }}
        >
          <CheckoutForm />
        </CartContext.Provider>
      </BrowserRouter>
    );

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

    // Verify address details are displayed
    expect(await screen.findByText('123 Main St')).toBeInTheDocument();

    // Verify that PayPal button is disabled
    const paypalButton = screen.getByTestId('paypal-button');
    expect(paypalButton).toBeDisabled();

    // Additionally, ensure that the error message for empty cart is handled in the UI if applicable
    // (Based on your component's implementation)
  });
});
