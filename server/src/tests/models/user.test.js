const mongoose = require('mongoose');
const User = require('../../models/User');

describe('User Model', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    beforeEach(async () => {
        // Clears the database and adds some testing data.
        await User.deleteMany({});
    });

    afterAll(async () => {
        // Closes the Mongoose connection
        await mongoose.disconnect();
    });

    it('should hash the user password before saving', async () => {
        const user = new User({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123'
        });

        await user.save();

        expect(user.password).not.toBe('password123');
        expect(user.password.length).toBeGreaterThan(10);
    });
});
