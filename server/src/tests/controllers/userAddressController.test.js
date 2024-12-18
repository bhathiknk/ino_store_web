const mongoose = require('mongoose');
const httpMocks = require('node-mocks-http');
const UserAddress = require('../../models/UserAddress'); // Adjust model path
const {
    saveAddress,
    updateAddress,
    getUserAddresses,
} = require('../../controllers/UserAddressController'); // Adjust controller path

describe('User Address Controller', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    beforeEach(async () => {
        await UserAddress.deleteMany(); // Clean up UserAddress collection before each test
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    // Test for saving a user address
    it('should save a user address successfully', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            body: {
                address: '123 Test Street',
                province: 'Test Province',
                zipcode: '12345',
                contactNumber: '1234567890',
            },
            user: { _id: new mongoose.Types.ObjectId() }, // Simulated logged-in user ID
        });
        const res = httpMocks.createResponse();

        await saveAddress(req, res);

        expect(res.statusCode).toBe(201);
        const address = JSON.parse(res._getData());
        expect(address.address).toBe('123 Test Street');
        expect(address.province).toBe('Test Province');
        expect(address.zipcode).toBe('12345');
        expect(address.contactNumber).toBe('1234567890');
    });

    // Test for updating a user address
    it('should update a user address successfully', async () => {
        const existingAddress = await UserAddress.create({
            user: new mongoose.Types.ObjectId(),
            address: '123 Old Street',
            province: 'Old Province',
            zipcode: '54321',
            contactNumber: '0987654321',
        });

        const req = httpMocks.createRequest({
            method: 'PUT',
            params: { id: existingAddress._id },
            body: {
                address: '456 New Street',
                province: 'New Province',
                zipcode: '67890',
                contactNumber: '1122334455',
            },
        });
        const res = httpMocks.createResponse();

        await updateAddress(req, res);

        expect(res.statusCode).toBe(200);
        const updatedAddress = JSON.parse(res._getData());
        expect(updatedAddress.address).toBe('456 New Street');
        expect(updatedAddress.province).toBe('New Province');
        expect(updatedAddress.zipcode).toBe('67890');
        expect(updatedAddress.contactNumber).toBe('1122334455');
    });

    // Test for retrieving all addresses for a user
    it('should retrieve all user addresses', async () => {
        const userId = new mongoose.Types.ObjectId();
        await UserAddress.create([
            {
                user: userId,
                address: '123 Test Street',
                province: 'Test Province',
                zipcode: '12345',
                contactNumber: '1234567890',
            },
            {
                user: userId,
                address: '456 Another Street',
                province: 'Another Province',
                zipcode: '67890',
                contactNumber: '0987654321',
            },
        ]);

        const req = httpMocks.createRequest({
            method: 'GET',
            user: { _id: userId },
        });
        const res = httpMocks.createResponse();

        await getUserAddresses(req, res);

        expect(res.statusCode).toBe(200);
        const addresses = JSON.parse(res._getData());
        expect(addresses.length).toBe(2);
        expect(addresses[0].address).toBe('123 Test Street');
        expect(addresses[1].address).toBe('456 Another Street');
    });
});
