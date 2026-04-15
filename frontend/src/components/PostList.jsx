import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "./PostCard";

const API_BASE = "/api";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let canceled = false;

    async function fetchPosts() {
      try {
        const resp = await axios.get(`${API_BASE}/posts`);
        if (!canceled) {
          setPosts(resp.data);
        }
      } catch (err) {
        if (!canceled) {
          setError(err?.message || "Lỗi khi gọi API");
        }
      } finally {
        if (!canceled) {
          setLoading(false);
        }
      }
    }

    fetchPosts();
    return () => {
      canceled = true;
    };
  }, []);

  if (loading) {
    return <p>Đang tải danh sách bài viết...</p>;
  }

  if (error) {
    return <p>Lỗi khi tải danh sách bài viết: {error}</p>;
  }

  if (!posts.length) {
    return <p>Chưa có bài viết nào.</p>;
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostCard key={post.slug} data={post} />
      ))}
    </div>
  );
};

export default PostList;
