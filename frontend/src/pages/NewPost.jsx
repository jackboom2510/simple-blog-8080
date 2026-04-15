import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "/api";

const NewPost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(`${API_BASE}/posts`, {
        title,
        summary,
        content,
        thumbnail: thumbnail || undefined,
      });

      if (response.status === 201) {
        setSuccess("Bài viết được tạo thành công!");
        setTitle("");
        setSummary("");
        setContent("");
        setThumbnail("");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      const message = err.response?.data?.error || "Lỗi khi tạo bài viết";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto" }}>
      <h2>Tạo bài viết mới</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="title">Tiêu đề *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Nhập tiêu đề bài viết"
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="summary">Mô tả ngắn *</label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
            placeholder="Nhập mô tả ngắn về bài viết"
            rows={3}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontFamily: "inherit",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="content">Nội dung *</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Nhập nội dung chi tiết của bài viết"
            rows={8}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontFamily: "inherit",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="thumbnail">Ảnh đại diện (URL)</label>
          <input
            id="thumbnail"
            type="url"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="https://example.com/image.jpg"
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {error && (
          <p style={{ color: "#d32f2f", marginBottom: "16px" }}>
            Lỗi: {error}
          </p>
        )}
        {success && (
          <p style={{ color: "#388e3c", marginBottom: "16px" }}>
            ✓ {success}
          </p>
        )}

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            disabled={loading}
          >
            {loading ? "Đang tạo..." : "Tạo bài viết"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#ccc",
              color: "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPost;
