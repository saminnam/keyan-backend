const express = require('express');
const multer = require('multer');
const path = require('path');
const Testimonials = require('../models/testimonial'); // Testimonials model

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/Images'); // Folder where images will be saved
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname)); // Append file extension
    }
});

const upload = multer({ 
    storage: storage
});

// Create a new testimonial
router.post('/', upload.single('image'), async (req, res) => {
    const { name, content, rating } = req.body;
    const imagePath = req.file ? req.file.filename : null; // Save only the image filename

    const newTestimonial = new Testimonials({
        name,
        image: imagePath,
        content,
        rating
    });

    try {
        await newTestimonial.save();
        res.status(201).json({ message: "Testimonial added successfully", testimonial: newTestimonial });
    } catch (error) {
        res.status(500).json({ message: "Error adding testimonial", error });
    }
});

// Get all testimonials
router.get('/', async (req, res) => {
    try {
        const testimonials = await Testimonials.find();
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: "Error fetching testimonials", error });
    }
});

// Update a testimonial
router.put('/:id', upload.single('image'), async (req, res) => {
    const { name, content, rating } = req.body;
    const imagePath = req.file ? req.file.filename : null; // Get new image filename if uploaded

    try {
        const updatedTestimonial = await Testimonials.findByIdAndUpdate(req.params.id, {
            name,
            image: imagePath, // Update image if a new one is provided
            content,
            rating
        }, { new: true }); // Return the updated document

        if (!updatedTestimonial) {
            return res.status(404).json({ message: "Testimonial not found" });
        }

        res.status(200).json({ message: "Testimonial updated successfully", testimonial: updatedTestimonial });
    } catch (error) {
        res.status(500).json({ message: "Error updating testimonial", error });
    }
});

// Delete a testimonial
router.delete('/:id', async (req, res) => {
    try {
        const deletedTestimonial = await Testimonials.findByIdAndDelete(req.params.id);
        if (!deletedTestimonial) {
            return res.status(404).json({ message: "Testimonial not found" });
        }

        res.status(200).json({ message: "Testimonial deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting testimonial", error });
    }
});

module.exports = router;
