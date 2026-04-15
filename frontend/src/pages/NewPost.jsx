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
    <div className="new-post-container">
      <h2>Tạo bài viết mới</h2>
      <form onSubmit={handleSubmit}>
        <div className="new-post-form-group">
          <label htmlFor="title">Tiêu đề *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Nhập tiêu đề bài viết"
            className="new-post-input"
          />
        </div>

        <div className="new-post-form-group">
          <label htmlFor="summary">Mô tả ngắn *</label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
            placeholder="Nhập mô tả ngắn về bài viết"
            rows={3}
            className="new-post-textarea"
          />
        </div>

        <div className="new-post-form-group">
          <label htmlFor="content">Nội dung *</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Nhập nội dung chi tiết của bài viết"
            rows={8}
            className="new-post-textarea"
          />
        </div>

        <div className="new-post-form-group">
          <label htmlFor="thumbnail">Ảnh đại diện (URL)</label>
          <input
            id="thumbnail"
            type="url"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="new-post-input"
          />
        </div>

        {error && (
          <p className="new-post-error">
            Lỗi: {error}
          </p>
        )}
        {success && (
          <p className="new-post-success">
            ✓ {success}
          </p>
        )}

        <div className="new-post-buttons">
          <button
            type="submit"
            className="new-post-submit-btn"
            disabled={loading}
          >
            {loading ? "Đang tạo..." : "Tạo bài viết"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="new-post-cancel-btn"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPost;
