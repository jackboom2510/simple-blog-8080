const express = require("express");
const router = express.Router();
const User = require("../db/userModel.cjs");

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách người dùng" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });

    if (user) {
      const { password, ...userWithoutPassword } = user.toObject();
      res.status(200).json({ success: true, user: userWithoutPassword });
    } else {
      res.status(401).json({ success: false, error: "Sai tài khoản hoặc mật khẩu" });
    }
  } catch (error) {
    res.status(500).json({ error: "Lỗi đăng nhập" });
  }
});

module.exports = router;