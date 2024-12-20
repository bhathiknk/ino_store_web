const mongoose = require('mongoose');
const httpMocks = require('node-mocks-http');
const Product = require('../../models/Product');
const {
    addProduct,
    getProductsByAdmin,
    getProductById,
    updateProduct,
    deleteProduct,
    getAllProducts,
} = require('../../controllers/productController');

describe('Product Controller', () => {
    let adminId, productId;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        adminId = new mongoose.Types.ObjectId(); // Simulating admin ID
    });

    beforeEach(async () => {
        await Product.deleteMany();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    // Test: Add product
    it('should add a new product successfully', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            body: {
                title: 'iPhone 13',
                categoryDescription: 'Mobile',
                description: 'Latest iPhone model',
                basePrice: 999,
                discountPrice: 899,
                isDiscount: 'true',
                isFreeShipping: 'false',
                shippingCost: 10,
                quantity: 5, // Ensure quantity is included
            },
            files: [{ filename: 'iphone.jpg' }],
            admin: { _id: adminId },
        });
        const res = httpMocks.createResponse();

        await addProduct(req, res);

        expect(res.statusCode).toBe(201);
        const product = JSON.parse(res._getData());
        expect(product.name).toBe('iPhone 13');
        expect(product.categoryDescription).toBe('Mobile');
        expect(product.images.length).toBe(1);
    });

    // Test: Get products by admin ID
    it('should retrieve products by admin ID', async () => {
        await Product.create({
            name: 'Samsung Galaxy',
            categoryDescription: 'Mobile',
            basePrice: 899,
            quantity: 10, // Include quantity
            admin: adminId,
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
        expect(products[0].name).toBe('Samsung Galaxy');
    });

    // Test: Get product by ID
    it('should retrieve a product by ID', async () => {
        const product = await Product.create({
            name: 'iPhone 13',
            categoryDescription: 'Mobile',
            basePrice: 999,
            quantity: 10, // Include quantity
            admin: adminId,
        });
        productId = product._id;

        const req = httpMocks.createRequest({
            method: 'GET',
            params: { id: productId },
        });
        const res = httpMocks.createResponse();

        await getProductById(req, res);

        expect(res.statusCode).toBe(200);
        const retrievedProduct = JSON.parse(res._getData());
        expect(retrievedProduct.name).toBe('iPhone 13');
    });

    // Test: Update product
    it('should update product details successfully', async () => {
        const product = await Product.create({
            name: 'Old iPhone',
            categoryDescription: 'Mobile',
            basePrice: 899,
            quantity: 5, // Include quantity
            admin: adminId,
        });

        const req = httpMocks.createRequest({
            method: 'PUT',
            params: { id: product._id },
            body: {
                name: 'Updated iPhone',
                basePrice: 999,
                quantity: 10, // Update quantity
            },
        });
        const res = httpMocks.createResponse();

        await updateProduct(req, res);

        expect(res.statusCode).toBe(200);
        const updatedProduct = JSON.parse(res._getData());
        expect(updatedProduct.name).toBe('Updated iPhone');
        expect(updatedProduct.basePrice).toBe(999);
        expect(updatedProduct.quantity).toBe(10);
    });

    // Test: Delete product
    it('should delete a product successfully', async () => {
        const product = await Product.create({
            name: 'Test Product',
            categoryDescription: 'Mobile',
            basePrice: 699,
            quantity: 3, // Include quantity
            admin: adminId,
        });

        const req = httpMocks.createRequest({
            method: 'DELETE',
            params: { id: product._id },
        });
        const res = httpMocks.createResponse();

        await deleteProduct(req, res);

        expect(res.statusCode).toBe(200);
        const deletedProduct = await Product.findById(product._id);
        expect(deletedProduct).toBeNull();
    });

    // Test: Get all products
    it('should retrieve all products', async () => {
        await Product.create([
            {
                name: 'Product 1',
                categoryDescription: 'Category 1',
                basePrice: 500,
                quantity: 5, // Include quantity
                admin: adminId,
            },
            {
                name: 'Product 2',
                categoryDescription: 'Category 2',
                basePrice: 300,
                quantity: 3, // Include quantity
                admin: adminId,
            },
        ]);

        const req = httpMocks.createRequest({
            method: 'GET',
        });
        const res = httpMocks.createResponse();

        await getAllProducts(req, res);

        expect(res.statusCode).toBe(200);
        const products = JSON.parse(res._getData());
        expect(products.length).toBe(2);
    });

});
