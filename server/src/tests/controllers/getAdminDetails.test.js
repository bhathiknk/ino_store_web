const mongoose = require('mongoose');
const httpMocks = require('node-mocks-http');
const Admin = require('../../models/Admin'); // Adjust model path
const { getAdminDetails } = require('../../controllers/adminDetailsController'); // Adjust controller path

describe('Admin Details Controller', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterEach(async () => {
        await Admin.deleteMany(); // Clean up
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should retrieve admin details successfully with a valid token', async () => {
        // Create an admin in the database
        const admin = await Admin.create({
            name: 'Test Admin',
            email: 'admin@test.com',
            password: 'hashedpassword', // Simulating hashed password
        });

        // Simulate the request and response
        const req = httpMocks.createRequest({
            method: 'GET',
            admin: { _id: admin._id }, // Correctly pass req.admin
        });
        const res = httpMocks.createResponse();

        await getAdminDetails(req, res);

        // Assert the status code and response
        expect(res.statusCode).toBe(200);
        const adminDetails = JSON.parse(res._getData());
        expect(adminDetails.email).toBe('admin@test.com');
        expect(adminDetails.name).toBe('Test Admin');
    });
});
