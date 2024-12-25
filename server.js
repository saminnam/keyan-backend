// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const contacts = require('./routes/contact'); // Existing contact routes
const services = require('./routes/service'); // Existing service routes
const blogs = require('./routes/blog'); // New blog routes
const team = require('./routes/team')
const portfolio = require('./routes/portfolio')
const path = require('path'); 
const testimonials = require('./routes/testimonial');
const auth = require('./routes/auth');
const authenticateToken = require('./middleware/auth');


const app = express();
const port = 3000; // Hardcoded port
const dburl = 'mongodb://localhost:27017/keyantechdata'; // Hardcoded DB URL

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/Images', express.static(path.join(__dirname, 'public/Images')));
 // Serve static files from uploads

// Connect to MongoDB
mongoose.connect(dburl)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB", error);
    });

// Correctly set up your routes
app.use('/api/contacts', contacts); // Contact routes
app.use('/api/services', services); // Service routes
app.use('/api/blogs', blogs); // Blog routes
app.use('/api/team', team); // Team routes
app.use('/api/portfolio', portfolio); // Portfolio routes
app.use('/api/testimonials', testimonials); 
app.use('/api/auth', auth);


// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
