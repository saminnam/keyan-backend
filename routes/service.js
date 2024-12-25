const express = require('express');
const router = express.Router();
const Service = require('../models/service');

// Create a new service
router.post('/', async (req, res) => {
    try {
        const newService = new Service(req.body);
        const savedService = await newService.save();
        res.status(201).json(savedService);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: error.message });
    }
});

// Get all services
router.get('/', async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: error.message });
    }
});

// Update a service by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedService) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json(updatedService);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: error.message });
    }
});

// Delete a service by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedService = await Service.findByIdAndDelete(req.params.id);
        if (!deletedService) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(204).send(); // No content
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
