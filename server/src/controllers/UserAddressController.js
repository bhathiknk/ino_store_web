// controllers/addressController.js
const Address = require('../models/UserAddress');

exports.saveAddress = async (req, res) => {
    const { address, province, zipcode, contactNumber } = req.body;

    try {
        const user = req.user._id;

        const newAddress = new Address({
            user,
            address,
            province,
            zipcode,
            contactNumber,
        });

        const savedAddress = await newAddress.save();
        res.status(201).json(savedAddress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updateAddress = async (req, res) => {
    const { address, province, zipcode, contactNumber } = req.body;

    try {
        const updatedAddress = await Address.findByIdAndUpdate(
            req.params.id,
            { address, province, zipcode, contactNumber },
            { new: true, runValidators: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.status(200).json(updatedAddress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};