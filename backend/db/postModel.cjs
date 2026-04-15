const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  author: { type: String, default: "Khách" },
  content: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString().split("T")[0] }
});

const PostSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Please provide a title!"] },
  slug: { type: String, required: true, unique: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  thumbnail: { type: String, default: "https://picsum.photos/seed/default/600/300" },
  createdAt: { type: String, default: () => new Date().toISOString().split("T")[0] },
  comments: [CommentSchema]
});

module.exports = mongoose.models.Posts || mongoose.model("Posts", PostSchema);