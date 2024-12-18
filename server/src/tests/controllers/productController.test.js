const mongoose = require('mongoose');
const Product = require('../../models/Product');
const { addProduct, getProductsByAdmin } = require('../../controllers/productController');
const httpMocks = require('node-mocks-http');

describe('Product Controller', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST);
    });

    beforeEach(async () => {
        await Product.deleteMany();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should add a product successfully', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            body: {
                title: 'New Product',
                categoryDescription: 'Electronics',
                description: 'A brand new product',
                basePrice: 200,
                discountPrice: 180,
                isDiscount: 'true',
                isFreeShipping: 'true',
                shippingCost: 0,
                quantity: 5,
            },
            files: [{ filename: 'image1.jpg' }],
            admin: { _id: new mongoose.Types.ObjectId() },
        });
        const res = httpMocks.createResponse();

        await addProduct(req, res);

        expect(res.statusCode).toBe(201);
        const product = JSON.parse(res._getData());
        expect(product.name).toBe('New Product');
        expect(product.images.length).toBe(1);
        expect(product.isDiscount).toBe(true);
    });

    it('should return products by admin ID', async () => {
        const adminId = new mongoose.Types.ObjectId();
        await Product.create({
            name: 'Admin Product',
            categoryDescription: 'Electronics',
            basePrice: 150,
            images: ['/uploads/products/admin.jpg'],
            admin: adminId,
            quantity: 10,
        });

        const req = httpMocks.createRequest({
            method: 'GET',
            admin: { _id: adminId },
        });
        const res = httpMocks.createResponse();

        await getProductsByAdmin(req, res);

        expect(res.statusCode).toBe(200);
        const products = JSON.parse(res._getData());
        expect(products.length).toBe(1);
        expect(products[0].name).toBe('Admin Product');
    });
});
