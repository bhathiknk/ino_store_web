const { signup } = require('../../controllers/userAuthController');
const User = require('../../models/User');
const httpMocks = require('node-mocks-http');
const mongoose = require('mongoose');

describe('UserAuthController', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST);
    });

    beforeEach(async () => {
        // Clears the database and adds some testing data.
        await User.deleteMany({});
    });

    afterAll(async () => {
        // Closes the Mongoose connection
        await mongoose.disconnect();
    });

    it('should not allow signup with an email that already exists', async () => {
        const user = new User({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        });
        await user.save();

        const req = httpMocks.createRequest({
            method: 'POST',
            body: user
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
                password: 'password123'
            }
        });
        const res = httpMocks.createResponse();

        await signup(req, res);

        expect(res.statusCode).toBe(201);
        expect(JSON.parse(res._getData())).toHaveProperty('token');
    });
});
