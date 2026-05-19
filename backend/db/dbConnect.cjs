const mongoose = require("mongoose");

async function dbConnect() {
  try {
    await mongoose.connect(process.env.DB_URL, {
      dbName: "SimpleBlog",
    });
    console.log("✅ Đã kết nối thành công tới Database: SimpleBlog");
  } catch (error) {
    console.error("❌ Lỗi kết nối MongoDB:", error.message);
  }
}

module.exports = dbConnect;