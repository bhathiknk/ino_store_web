const mongoose = require('mongoose');
const httpMocks = require('node-mocks-http');
const Order = require('../../models/Order');
const Product = require('../../models/Product');
const Admin = require('../../models/Admin');
const { createOrder, getOrdersBySeller, updateOrderStatus } = require('../../controllers/orderController');

describe('Order Controller', () => {
    let adminId, buyerId, productId;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST, {});

        const admin = await Admin.create({
            name: 'Test Admin',
            email: 'admin@test.com',
            password: 'hashedpassword',
        });

        adminId = admin._id;

        const product = await Product.create({
            name: 'Test Product',
            categoryDescription: 'Test Category',
            basePrice: 100,
            images: ['/uploads/products/test.jpg'],
            quantity: 10,
            admin: adminId,
        });

        productId = product._id;
        buyerId = new mongoose.Types.ObjectId();
    });

    beforeEach(async () => {
        await Order.deleteMany();
    });

    afterAll(async () => {
        await Product.deleteMany();
        await Admin.deleteMany();
        await Order.deleteMany();
        await mongoose.connection.close();
    });

    it('should create an order successfully with valid data', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            body: {
                products: [{ product: productId, quantity: 2 }],
                paymentMethod: 'PayPal',
                shippingDetails: {
                    address: '123 Test Street',
                    province: 'Test Province',
                    zipcode: '12345',
                    contactNumber: '1234567890',
                },
                paymentId: 'PAY123456',
                payerId: 'PAYER123',
            },
            user: { _id: buyerId },
            app: { get: jest.fn(() => ({ emit: jest.fn() })) }, // Mock WebSocket instance
        });

        const res = httpMocks.createResponse();

        await createOrder(req, res);

        expect(res.statusCode).toBe(201);
        const orders = JSON.parse(res._getData());
        expect(orders.length).toBeGreaterThan(0);
        expect(orders[0].buyer).toBe(buyerId.toString());
        expect(orders[0].products[0].product).toBe(productId.toString());
    });

    it('should retrieve orders filtered by seller/admin', async () => {
        await Order.create({
            buyer: buyerId,
            products: [{ product: productId, quantity: 1 }],
            totalAmount: 100,
            paymentMethod: 'PayPal',
            isPaid: true,
            paymentId: 'PAY123456',
            payerId: 'PAYER123',
            orderStatus: 'Processing',
            shippingDetails: {
                address: '123 Test Street',
                province: 'Test Province',
                zipcode: '12345',
                contactNumber: '1234567890',
            },
        });

        const req = httpMocks.createRequest({
            method: 'GET',
            admin: { _id: adminId },
        });

        const res = httpMocks.createResponse();

        await getOrdersBySeller(req, res);

        expect(res.statusCode).toBe(200);
        const orders = JSON.parse(res._getData());
        expect(orders.length).toBe(1);
        expect(orders[0].products[0].product._id.toString()).toBe(productId.toString()); // Compare _id
    });

    it('should update the status of an order successfully', async () => {
        const order = await Order.create({
            buyer: buyerId,
            products: [{ product: productId, quantity: 1 }],
            totalAmount: 100,
            paymentMethod: 'PayPal',
            isPaid: true,
            paymentId: 'PAY123456',
            payerId: 'PAYER123',
            orderStatus: 'Processing',
            shippingDetails: {
                address: '123 Test Street',
                province: 'Test Province',
                zipcode: '12345',
                contactNumber: '1234567890',
            },
        });

        const req = httpMocks.createRequest({
            method: 'PUT',
            body: {
                orderId: order._id,
                status: 'Shipped',
            },
        });

        const res = httpMocks.createResponse();

        await updateOrderStatus(req, res);

        expect(res.statusCode).toBe(200);
        const response = JSON.parse(res._getData());
        expect(response.message).toBe('Order status updated successfully');

        const updatedOrder = await Order.findById(order._id);
        expect(updatedOrder.orderStatus).toBe('Shipped');
    });
});
