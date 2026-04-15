const dbConnect = require("./dbConnect.cjs");
const Post = require("./postModel.cjs");
const User = require("./userModel.cjs");

const seedData = async () => {
  try {
    await dbConnect();

    const mockPosts = [
      {
        title: "Bài viết đầu tiên",
        slug: "bai-viet-dau-tien",
        summary: "Đây là mô tả ngắn của bài viết đầu tiên...",
        thumbnail: "https://picsum.photos/seed/picsum/600/300",
        content: "Nội dung chi tiết của bài viết đầu tiên...",
        createdAt: "2026-03-19",
      },
      {
        title: "Bài viết thứ hai",
        slug: "bai-viet-thu-hai",
        summary: "Đây là mô tả ngắn của bài viết thứ 2...",
        thumbnail: "https://picsum.photos/seed/picsum2/600/300",
        content: "Nội dung chi tiết của bài viết thứ hai...",
        createdAt: "2026-03-20",
      }
    ];

    const mockUsers = [
      { username: "admin", password: "123456", role: "admin" },
      { username: "user", password: "123456", role: "user" }
    ];

    await Post.deleteMany();
    await User.deleteMany();

    await Post.insertMany(mockPosts);
    await User.insertMany(mockUsers);

    console.log("✅ Database seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedData();