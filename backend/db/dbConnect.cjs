const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  mongoose.connect(process.env.DB_URL, {
    dbName: "SimpleBlog"
  })
    .then(() => {
      console.log("✅ Đã kết nối thành công tới Database: SimpleBlog");
    })
    .catch((error) => {
      console.error("❌ Lỗi kết nối MongoDB:", error);
    });
}

module.exports = dbConnect;