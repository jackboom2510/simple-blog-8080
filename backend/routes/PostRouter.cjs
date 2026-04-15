const express = require("express");
const router = express.Router();
const Post = require("../db/postModel.cjs");

function createSlug(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function generateUniqueSlug(title) {
  let baseSlug = createSlug(title);
  let slug = baseSlug;
  let count = 1;
  while (await Post.findOne({ slug })) {
    slug = `${baseSlug}-${count++}`;
  }
  return slug;
}

router.get("/", async (req, res) => {
  try {
    const list = await Post.find()
      .select("-content")
      .sort({ createdAt: -1 });

    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách bài viết" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ error: "Không tìm thấy bài viết" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, summary, content, thumbnail } = req.body;

    if (!title || !summary || !content) {
      return res.status(400).json({ error: "Vui lòng điền đủ thông tin" });
    }

    const slug = await generateUniqueSlug(title);

    const newPost = new Post({
      title,
      slug,
      summary,
      content,
      thumbnail: thumbnail || "https://picsum.photos/seed/default/600/300"
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: "Dữ liệu không hợp lệ" });
  }
});

router.put("/:slug", async (req, res) => {
  try {
    const { title, summary, content, thumbnail } = req.body;

    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ error: "Không tìm thấy bài viết" });
    }

    if (title && title !== post.title) {
      post.title = title;
      post.slug = await generateUniqueSlug(title);
    }

    if (summary) post.summary = summary;
    if (content) post.content = content;
    if (thumbnail) post.thumbnail = thumbnail;

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Không thể cập nhật bài viết" });
  }
});

router.delete("/:slug", async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ slug: req.params.slug });

    if (!post) {
      return res.status(404).json({ error: "Không tìm thấy bài viết" });
    }

    res.status(200).json({ message: "Xoá bài viết thành công" });
  } catch (error) {
    res.status(500).json({ error: "Không thể xoá bài viết" });
  }
});

router.post("/:slug/comments", async (req, res) => {
  try {
    const { content, author } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Nội dung comment không được trống" });
    }

    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ error: "Bài viết không tồn tại" });
    }

    const newComment = {
      author: author || "Khách",
      content
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json(post.comments[post.comments.length - 1]);
  } catch (error) {
    res.status(500).json({ error: "Không thể gửi bình luận" });
  }
});

router.put("/:slug/comments/:commentId", async (req, res) => {
  try {
    const { content } = req.body;

    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ error: "Bài viết không tồn tại" });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: "Không tìm thấy comment" });
    }

    if (content) comment.content = content;

    await post.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Không thể cập nhật comment" });
  }
});

router.delete("/:slug/comments/:commentId", async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ error: "Bài viết không tồn tại" });
    }
    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: "Không tìm thấy comment" });
    }
    post.comments.pull(req.params.commentId);
    await post.save();

    res.status(200).json({ message: "Xoá comment thành công" });
  } catch (error) {
    res.status(500).json({ error: "Không thể xoá comment" });
  }
});

module.exports = router;