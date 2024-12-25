const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Team = require('../models/team'); // Updated model import

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

// Create a new team member
router.post('/', upload.single('image'), async (req, res) => {
    const { Name, Role } = req.body;
    const imagePath = req.file ? req.file.filename : null; // Save only the filename

    const newTeamMember = new Team({
        Name,
        Role,
        image: imagePath, // Store only the filename in the DB
    });

    try {
        await newTeamMember.save();
        res.status(201).json({ message: "Team member added successfully", teamMember: newTeamMember });
    } catch (error) {
        res.status(500).json({ message: "Error adding team member", error });
    }
});

// Get all team members
router.get('/', async (req, res) => {
    try {
        const teamMembers = await Team.find();
        res.json(teamMembers); // This should return an array of team members
    } catch (error) {
        res.status(500).json({ message: "Error fetching team members", error });
    }
});

// Update a team member
router.put('/:id', upload.single('image'), async (req, res) => {
    const { Name, Role } = req.body;
    const updateData = { Name, Role };

    try {
        const teamMember = await Team.findById(req.params.id);
        if (!teamMember) return res.status(404).json({ message: "Team member not found" });

        // If a new image is uploaded, remove the old one and update the image path
        if (req.file) {
            if (teamMember.image) {
                fs.unlink(path.join('public/Images', teamMember.image), (err) => {
                    if (err) console.error('Error removing old image:', err); // Handle the error gracefully
                });
            }
            updateData.image = req.file.filename; // Store only the filename in the DB
        }

        const updatedTeamMember = await Team.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json({ message: "Team member updated successfully", teamMember: updatedTeamMember });
    } catch (error) {
        res.status(500).json({ message: "Error updating team member", error });
    }
});

// Delete a team member
router.delete('/:id', async (req, res) => {
    try {
        const teamMember = await Team.findById(req.params.id);
        if (!teamMember) return res.status(404).json({ message: "Team member not found" });

        // Remove image file if it exists
        if (teamMember.image) {
            fs.unlink(path.join('public/Images', teamMember.image), (err) => {
                if (err) console.error('Error removing image:', err); // Handle the error gracefully
            });
        }

        await Team.findByIdAndDelete(req.params.id);
        res.json({ message: "Team member deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting team member", error });
    }
});

module.exports = router;
