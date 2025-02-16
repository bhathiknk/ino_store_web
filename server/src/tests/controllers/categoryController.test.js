const mongoose = require('mongoose');
const httpMocks = require('node-mocks-http');
const Category = require('../../models/Category');
const Product = require('../../models/Product');
const {
    getAllCategories,
    createCategory,
    getSubcategoriesByCategoryName,
    getProductsBySubcategory,
} = require('../../controllers/categoryController');

describe('Category Controller', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    beforeEach(async () => {
        await Category.deleteMany();
        await Product.deleteMany();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should retrieve all categories successfully', async () => {
        await Category.create([
            { name: 'Electronics', description: 'Gadgets, devices' },
            { name: 'Furniture', description: 'Home furniture' },
        ]);

        const req = httpMocks.createRequest({
            method: 'GET',
        });
        const res = httpMocks.createResponse();

        await getAllCategories(req, res);

        expect(res.statusCode).toBe(200);

        const categories = JSON.parse(res._getData()).sort((a, b) => a.name.localeCompare(b.name));
        expect(categories.length).toBe(2);
        expect(categories[0].name).toBe('Electronics');
        expect(categories[1].name).toBe('Furniture');
    });

    it('should create a new category with valid data', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            body: {
                name: 'Books',
                description: 'All kinds of books',
            },
        });
        const res = httpMocks.createResponse();

        await createCategory(req, res);

        expect(res.statusCode).toBe(201);
        const category = JSON.parse(res._getData());
        expect(category.name).toBe('Books');
        expect(category.description).toBe('All kinds of books');
    });

    it('should return 400 if category data is invalid', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            body: { description: 'Missing name field' },
        });
        const res = httpMocks.createResponse();

        await createCategory(req, res);

        expect(res.statusCode).toBe(400);
        const response = JSON.parse(res._getData());
        expect(response.message).toBeDefined();
    });

    it('should retrieve subcategories for a given category name', async () => {
        await Category.create({
            name: 'Electronics',
            description: 'Mobile, Laptop, Accessories',
        });

        const req = httpMocks.createRequest({
            method: 'GET',
            params: { categoryName: 'Electronics' },
        });
        const res = httpMocks.createResponse();

        await getSubcategoriesByCategoryName(req, res);

        expect(res.statusCode).toBe(200);

        const response = JSON.parse(res._getData());
        expect(response.category).toBe('Electronics');
        expect(response.subcategories).toEqual(expect.arrayContaining(['Mobile', 'Laptop', 'Accessories']));
    });

    it('should retrieve products for a given subcategory', async () => {
        const subcategory = 'Mobile';
        const adminId = new mongoose.Types.ObjectId();

        await Product.create([
            {
                name: 'iPhone 13',
                categoryDescription: subcategory,
                basePrice: 999,
                images: ['/uploads/products/iphone.jpg'],
                quantity: 5,
                admin: adminId,
            },
            {
                name: 'Samsung Galaxy',
                categoryDescription: subcategory,
                basePrice: 899,
                images: ['/uploads/products/samsung.jpg'],
                quantity: 10,
                admin: adminId,
            },
        ]);

        const req = httpMocks.createRequest({
            method: 'GET',
            params: { subcategoryName: subcategory },
        });
        const res = httpMocks.createResponse();

        await getProductsBySubcategory(req, res);

        expect(res.statusCode).toBe(200);

        const products = JSON.parse(res._getData()).sort((a, b) => a.name.localeCompare(b.name));
        expect(products.length).toBe(2);
        expect(products[0].name).toBe('iPhone 13');
        expect(products[1].name).toBe('Samsung Galaxy');
    });
});
