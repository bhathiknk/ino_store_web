const mongoose = require('mongoose');
const httpMocks = require('node-mocks-http');
const Order = require('../../models/Order'); // Adjust the path to Order model
const Product = require('../../models/Product'); // Adjust the path to Product model
const Admin = require('../../models/Admin'); // Adjust the path to Admin model
const { getSalesSummary } = require('../../controllers/salesController'); // Adjust the path to the controller

describe('Sales Controller', () => {
    let adminId, productId;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

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
    });

    beforeEach(async () => {
        await Order.deleteMany(); // Clean up Orders before each test
    });

    afterAll(async () => {
        await Product.deleteMany();
        await Admin.deleteMany();
        await Order.deleteMany();
        await mongoose.connection.close();
    });

    it('should retrieve sales summary', async () => {
        // Mock orders
        await Order.create([
            {
                products: [{ product: productId, quantity: 2 }],
                totalAmount: 200,
                paymentMethod: 'PayPal',
                paymentId: 'PAY123456',
                payerId: 'PAYER123',
                buyer: new mongoose.Types.ObjectId(),
                shippingDetails: {
                    address: '123 Test Street',
                    province: 'Test Province',
                    zipcode: '12345',
                    contactNumber: '1234567890',
                },
                createdAt: new Date('2024-01-15'),
            },
            {
                products: [{ product: productId, quantity: 1 }],
                totalAmount: 100,
                paymentMethod: 'PayPal',
                paymentId: 'PAY123457',
                payerId: 'PAYER124',
                buyer: new mongoose.Types.ObjectId(),
                shippingDetails: {
                    address: '456 Another Street',
                    province: 'Another Province',
                    zipcode: '67890',
                    contactNumber: '0987654321',
                },
                createdAt: new Date('2024-02-15'),
            },
        ]);

        const req = httpMocks.createRequest({
            method: 'GET',
            admin: { _id: adminId }, // Simulated admin data
        });
        const res = httpMocks.createResponse();

        await getSalesSummary(req, res);

        expect(res.statusCode).toBe(200);
        const data = JSON.parse(res._getData());

        expect(data.totalSales).toBe(300);
        expect(data.totalOrders).toBe(2);
        expect(data.averageOrderValue).toBe(150);
        expect(Object.keys(data.salesGrowth).length).toBe(2);
        expect(data.salesGrowth['2024-01']).toBe(200);
        expect(data.salesGrowth['2024-02']).toBe(100);
    });
});
