const mongoose = require('mongoose');
const { signup, signin } = require('../../controllers/userAuthController');
const User = require('../../models/User');
const httpMocks = require('node-mocks-http');

describe('UserAuthController', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST);
    });

    beforeEach(async () => {
        await mongoose.connection.db.dropDatabase(); // Clear database before each test
    });

    afterAll(async () => {
        await mongoose.connection.close(); // Close MongoDB connection
    });

    it('should not allow signup with an email that already exists', async () => {
        const user = new User({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        });
        await user.save();

        const req = httpMocks.createRequest({
            method: 'POST',
            body: { name: 'Test User', email: 'test@example.com', password: 'password123' },
        });
        const res = httpMocks.createResponse();

        await signup(req, res);

        expect(res.statusCode).toBe(400);
        expect(JSON.parse(res._getData())).toEqual({ message: 'User already exists' });
    });

    it('should signup a new user', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            body: {
                name: 'New User',
                email: 'new@example.com',
                password: 'password123',
            },
        });
        const res = httpMocks.createResponse();

        await signup(req, res);

        expect(res.statusCode).toBe(201);
        expect(JSON.parse(res._getData())).toHaveProperty('token');
    });

    it('should signin an existing user with correct credentials', async () => {
        const user = new User({
            name: 'Test User',
            email: 'signin@example.com',
            password: 'password123',
        });
        await user.save();

        const req = httpMocks.createRequest({
            method: 'POST',
            body: {
                email: 'signin@example.com',
                password: 'password123',
            },
        });
        const res = httpMocks.createResponse();

        await signin(req, res);

        expect(res.statusCode).toBe(200);
        expect(JSON.parse(res._getData())).toHaveProperty('token');
    });

    it('should not signin a user with incorrect credentials', async () => {
        const user = new User({
            name: 'Test User',
            email: 'wrong@example.com',
            password: 'password123',
        });
        await user.save();

        const req = httpMocks.createRequest({
            method: 'POST',
            body: {
                email: 'wrong@example.com',
                password: 'wrongpassword',
            },
        });
        const res = httpMocks.createResponse();

        await signin(req, res);

        expect(res.statusCode).toBe(401);
        expect(JSON.parse(res._getData())).toEqual({ message: 'Invalid email or password' });
    });

    it('should not signin a user that does not exist', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            body: {
                email: 'nonexistent@example.com',
                password: 'password123',
            },
        });
        const res = httpMocks.createResponse();

        await signin(req, res);

        expect(res.statusCode).toBe(401); // Adjusted from 404 to 401
        expect(JSON.parse(res._getData())).toEqual({ message: 'Invalid email or password' }); // Adjusted message
    });
});
