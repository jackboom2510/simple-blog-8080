import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_BASE = "/api";

const PostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let canceled = false;

    async function fetchDetail() {
      try {
        const resp = await axios.get(`${API_BASE}/posts/${slug}`);
        if (!canceled) {
          setPost(resp.data);
        }
      } catch (err) {
        if   (!canceled) {
          setError(err?.response?.status === 404 ? "Không tìm thấy bài viết" : err?.message || "Lỗi khi gọi API");
        }
      } finally {
        if (!canceled) {
          setLoading(false);
        }
      }
    }

    fetchDetail();
    return () => {
      canceled = true;
    };
  }, [slug]);

  if (loading) return <p>Đang tải bài viết...</p>;
  if (error) return <p>Lỗi: {error}</p>;
  if (!post) return <p>Không tìm thấy bài viết.</p>;

  return (
    <div>
      <h2>{post.title}</h2>
      <p><strong>Ngày đăng:</strong> {post.createdAt}</p>
      <img src={post.thumbnail} alt={post.title} style={{ width: "100%", maxWidth: "700px", marginBottom: "16px" }} />
      <p>{post.content}</p>
    </div>
  );
};

export default PostDetail;
