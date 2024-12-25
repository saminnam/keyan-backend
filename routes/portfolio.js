const express = require('express');
const multer = require('multer');
const path = require('path');
const Portfolio = require('../models/portfolio'); // Portfolio model

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

// Create a new portfolio item
router.post('/', upload.single('image'), async (req, res) => {
    const { title, websiteUrl } = req.body;
    const imagePath = req.file ? req.file.filename : null; // Save only the image filename

    const newPortfolio = new Portfolio({
        title,
        websiteUrl,
        image: imagePath
    });

    try {
        await newPortfolio.save();
        res.status(201).json({ message: "Portfolio item added successfully", portfolio: newPortfolio });
    } catch (error) {
        res.status(500).json({ message: "Error adding portfolio item", error });
    }
});

// Get all portfolio items
router.get('/', async (req, res) => {
    try {
        const portfolioItems = await Portfolio.find();
        res.json(portfolioItems);
    } catch (error) {
        res.status(500).json({ message: "Error fetching portfolio items", error });
    }
});

// Update a portfolio item
router.put('/:id', upload.single('image'), async (req, res) => {
    const { title, websiteUrl } = req.body;
    const imagePath = req.file ? req.file.filename : null; // Get new image filename if uploaded

    try {
        const updatedPortfolio = await Portfolio.findByIdAndUpdate(req.params.id, {
            title,
            websiteUrl,
            image: imagePath // Only update if a new image is uploaded
        }, { new: true }); // Return the updated document

        if (!updatedPortfolio) {
            return res.status(404).json({ message: "Portfolio item not found" });
        }

        res.status(200).json({ message: "Portfolio item updated successfully", portfolio: updatedPortfolio });
    } catch (error) {
        res.status(500).json({ message: "Error updating portfolio item", error });
    }
});

// Delete a portfolio item
router.delete('/:id', async (req, res) => {
    try {
        const deletedPortfolio = await Portfolio.findByIdAndDelete(req.params.id);
        if (!deletedPortfolio) {
            return res.status(404).json({ message: "Portfolio item not found" });
        }

        res.status(200).json({ message: "Portfolio item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting portfolio item", error });
    }
});

module.exports = router;
