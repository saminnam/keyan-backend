const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Blog = require('../models/blog');

const router = express.Router();

// Configure multer for file uploads with file type validation
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/Images'); // Folder where images will be saved
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname)); // Append extension
    }
});

// File type validation
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only JPEG, JPG, and PNG image files are allowed!'));
    }
};

// Set up multer instance with storage and fileFilter configurations
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});

// Create a new blog post
router.post('/', upload.single('image'), async (req, res) => {
    const { title, category, content, subContent, author } = req.body;
    const imagePath = req.file ? req.file.filename : null; // Save only the filename

    const newBlog = new Blog({
        title,
        category,
        image: imagePath, // Store only the filename in the DB
        content,
        subContent, // Added subContent to the data
        author,
    });

    try {
        await newBlog.save();
        res.status(201).json({ message: "Blog created successfully", blog: newBlog });
    } catch (error) {
        res.status(500).json({ message: "Error creating blog", error });
    }
});

// Get all blog posts
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs); // This should return an array of blogs, including subContent
    } catch (error) {
        res.status(500).json({ message: "Error fetching blogs", error });
    }
});

// Update a blog post
router.put('/:id', upload.single('image'), async (req, res) => {
    const { title, category, content, subContent, author } = req.body;
    const updateData = { title, category, content, subContent, author }; // Included subContent in the update

    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        // If new image is uploaded, remove the old one and update the image path
        if (req.file) {
            if (blog.image) {
                fs.unlink(path.join('public/Images', blog.image), (err) => {
                    if (err) console.error('Error removing old image:', err); // Handle the error gracefully
                });
            }
            updateData.image = req.file.filename; // Store only the filename in the DB
        }

        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json({ message: "Blog updated successfully", blog: updatedBlog });
    } catch (error) {
        res.status(500).json({ message: "Error updating blog", error });
    }
});

// Delete a blog post
router.delete('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        // Remove image file if it exists
        if (blog.image) {
            fs.unlink(path.join('public/Images', blog.image), (err) => {
                if (err) console.error('Error removing image:', err); // Handle the error gracefully
            });
        }

        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting blog", error });
    }
});

module.exports = router;
