const mongoose = require('mongoose');
const Product = require('../../models/Product');

describe('Product Model', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a product successfully', async () => {
        const productData = {
            name: 'Test Product',
            categoryDescription: 'Electronics',
            description: 'A test product description',
            images: ['/uploads/products/test-image.jpg'],
            admin: new mongoose.Types.ObjectId(),
            basePrice: 100,
            isDiscount: false,
            quantity: 10,
        };

        const product = new Product(productData);
        const savedProduct = await product.save();

        expect(savedProduct._id).toBeDefined();
        expect(savedProduct.name).toBe(productData.name);
        expect(savedProduct.inStock).toBe(true);
    });

    it('should throw validation error without required fields', async () => {
        const product = new Product({}); // Missing required fields

        let err;
        try {
            await product.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeDefined();
        expect(err.errors.name).toBeDefined();
        expect(err.errors.categoryDescription).toBeDefined();
        expect(err.errors.basePrice).toBeDefined();
    });
});
