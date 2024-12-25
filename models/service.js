const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    // You can add more fields as per your requirements
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);
