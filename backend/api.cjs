const express = require("express");
const app = express();

app.use(express.json());

const cors = require('cors');

// Helper function to create slug from title
function createSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

app.use(cors({
  origin: ["*"], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const posts = [
  {
    id: 1,
    title: "Bài viết đầu tiên",
    slug: "bai-viet-dau-tien",
    summary: "Đây là mô tả ngắn của bài viết đầu tiên...",
    thumbnail: "https://picsum.photos/seed/picsum/600/300",
    content:
      "Nội dung chi tiết của bài viết đầu tiên. Đây là phần nội dung đầy đủ, có thể gồm nhiều đoạn text và hình ảnh.",
    createdAt: "2026-03-19",
  },
  {
    id: 2,
    title: "Bài viết thứ hai",
    slug: "bai-viet-thu-hai",
    summary: "Đây là mô tả ngắn của bài viết thứ 2...",
    thumbnail: "https://picsum.photos/seed/picsum2/600/300",
    content:
      "Nội dung chi tiết của bài viết thứ hai với nhiều ý tưởng và thông tin hữu ích cho người đọc.",
    createdAt: "2026-03-20",
  },
];

const users = [
  { username: "admin", password: "123456", role: "admin" },
  { username: "user", password: "123456", role: "user" },
];

app.get("/api/posts", (req, res) => {
  const list = posts.map(({ content, ...item }) => item);
  res.status(200).json(list);
});

app.get("/api/posts/:slug", (req, res) => {
  const { slug } = req.params;
  const post = posts.find((p) => p.slug === slug || String(p.id) === slug);
  if (!post) {
    return res.status(404).json({ error: "Không tìm thấy bài viết" });
  }
  res.status(200).json(post);
});

app.post("/api/posts", (req, res) => {
  const { title, summary, content, thumbnail } = req.body;

  if (!title || !summary || !content) {
    return res.status(400).json({ error: "Tiêu đề, mô tả và nội dung là bắt buộc" });
  }

  const slug = createSlug(title);
  const newPost = {
    id: Math.max(...posts.map(p => p.id), 0) + 1,
    title,
    slug,
    summary,
    content,
    thumbnail: thumbnail || "https://picsum.photos/seed/default/600/300",
    createdAt: new Date().toISOString().split('T')[0],
  };

  posts.push(newPost);
  res.status(201).json(newPost);
});

app.get("/api/users", (req, res) => {
  const list = users.map(({ password, ...item }) => item);
  res.status(200).json(list);
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({ success: true, user: userWithoutPassword });
  } else {
    res.status(401).json({ success: false, error: "Tên đăng nhập hoặc mật khẩu không đúng." });
  }
});

app.get("/", (req, res) => {
  res.status(200).send("Blog API online");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
