// models/blog.js

const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true }, // Path to the uploaded image
    content: { type: String, required: true },
    subContent: { type: String, required: true },
    author: { type: String, required: true },
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
