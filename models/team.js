// models/blog.js

const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    image: { type: String, required: true }, // Path to the uploaded image
    Role: { type: String, required: true },

}, { timestamps: true });

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
