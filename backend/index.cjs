const express = require("express");
const cors = require("cors");
const dbConnect = require("./db/dbConnect.cjs");
const postRoutes = require("./routes/PostRouter.cjs");
const authRoutes = require("./routes/AuthRouter.cjs");

const app = express();

dbConnect();
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use("/api/posts", postRoutes);
app.use("/api", authRoutes);
app.get("/", (req, res) => res.send("Blog API MongoDB is running with split routes..."));

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});