const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');

// POST: Create a new contact message
router.post('/', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Create a new contact instance
    const newContact = new Contact({
        name,
        email,
        subject,
        message,
        status: 'unread'  // Default status is 'unread'
    });

    try {
        const savedContact = await newContact.save();  // Save the new contact message
        res.status(201).json(savedContact);  // Return the saved contact
    } catch (error) {
        res.status(400).json({ message: 'Error creating contact message' });
    }
});

// GET: Get all contacts (optional, useful for admin to see all messages)
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find();  // Fetch all contact messages
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts' });
    }
});

// PUT: Mark a contact message as read
router.put('/:id/read', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        contact.status = 'read';  // Change status to 'read'
        const updatedContact = await contact.save();  // Save the updated status

        res.json(updatedContact);  // Return the updated contact
    } catch (error) {
        res.status(500).json({ message: 'Error marking contact as read' });
    }
});

// DELETE: Delete a contact
router.delete('/:id', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        await Contact.findByIdAndDelete(req.params.id);  // Delete the contact message
        res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contact' });
    }
});

module.exports = router;
