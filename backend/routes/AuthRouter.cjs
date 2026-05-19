const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../db/userModel.cjs");

const JWT_SECRET = process.env.JWT_SECRET || "va8K66XzI4CEG6NWytAdHKaECibVblCd1Pnq9J6rccm";
const JWT_EXPIRES_IN = "8h";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Thiếu hoặc sai định dạng Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  if (!JWT_SECRET) {
    console.error("JWT_SECRET chưa được cấu hình");
    return res.status(500).json({ error: "Server config error" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT Error:", err);

      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token đã hết hạn" });
      }

      return res.status(403).json({ error: "Token không hợp lệ" });
    }

    req.user = user;
    next();
  });
};

router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Thiếu thông tin" });
    }

    const existedUser = await User.findOne({ username });
    if (existedUser) {
      return res.status(400).json({ error: "Username đã tồn tại" });
    }

    const newUser = new User({
      username,
      password,
      role: role || "user",
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Lỗi đăng ký" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Sai tài khoản hoặc mật khẩu",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      success: true,
      user: user,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi đăng nhập" });
  }
});


router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Không thể lấy user" });
  }
});

router.get("/users", authenticateToken, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy users" });
  }
});

router.put("/users/:userId", authenticateToken, async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "Không tìm thấy user" });
    }

    if (username) user.username = username;
    if (password) user.password = password;
    if (role) user.role = role;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Không thể cập nhật user" });
  }
});

router.delete("/users/:userId", authenticateToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: "Không tìm thấy user" });
    }

    res.status(200).json({
      message: "Xoá thành công",
      user
    });
  } catch (error) {
    res.status(500).json({ error: "Không thể xoá user" });
  }
});

module.exports = router;