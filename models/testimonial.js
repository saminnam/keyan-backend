const mongoose = require('mongoose');

const testimonialsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true }, // Path to the uploaded image
    content: { type: String, required: true },
    rating: {
        type: Number,
        required: true,
        min: 1, // Minimum rating
        max: 5  // Maximum rating
    },
}, { timestamps: true });

const Testimonials = mongoose.model('Testimonials', testimonialsSchema); // Updated collection name to 'Testimonials'

module.exports = Testimonials;
