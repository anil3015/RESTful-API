const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

mongoose.connect("mongodb://localhost/blog-api", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

const BlogSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  createdAt: { type: Date, default: Date.now },
});

const Blog = mongoose.model("Blog", BlogSchema);

app.post("/api/blogs", async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const newBlog = new Blog({ title, content, author });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(500).json({ message: "Error creating blog post" });
  }
});

app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching blog posts" });
  }
});
app.put("/api/blogs/:id", async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, { title, content, author }, { new: true });
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(500).json({ message: "Error updating blog post" });
  }
});

app.delete("/api/blogs/:id", async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.status(200).json({ message: "Blog post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting blog post" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
