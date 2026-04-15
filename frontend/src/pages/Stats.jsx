import React, { useEffect, useState } from "react";

const API_BASE = "/api";

const Stats = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  useEffect(() => {
    const controller = new AbortController();

    async function loadAll() {
      try {
        const requests = [
          fetch(`${API_BASE}/posts`, { signal: controller.signal }),
        ];

        if (isAdmin) {
          requests.push(fetch(`${API_BASE}/users`, { signal: controller.signal }));
        }

        const responses = await Promise.all(requests);

        if (!responses[0].ok) throw new Error(`Lỗi posts ${responses[0].status}`);
        if (isAdmin && !responses[1].ok) throw new Error(`Lỗi users ${responses[1].status}`);

        const postsData = await responses[0].json();
        setPosts(postsData);

        if (isAdmin) {
          const usersData = await responses[1].json();
          setUsers(usersData);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    loadAll();
    return () => controller.abort();
  }, [isAdmin]);

  if (loading) return <p>Đang tải thống kê...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div>
      <h1>Stats</h1>

      <section style={{ marginBottom: "24px" }}>
        <h2>Danh sách bài viết</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #ccc" }}>
              <th style={{ padding: "8px", textAlign: "left" }}>ID</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Title</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Slug</th>
              <th style={{ padding: "8px", textAlign: "left" }}>CreatedAt</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "8px" }}>{post.id}</td>
                <td style={{ padding: "8px" }}>{post.title}</td>
                <td style={{ padding: "8px" }}>{post.slug}</td>
                <td style={{ padding: "8px" }}>{post.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {isAdmin && (
        <section>
          <h2>Danh sách người dùng</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #ccc" }}>
                <th style={{ padding: "8px", textAlign: "left" }}>Username</th>
                <th style={{ padding: "8px", textAlign: "left" }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "8px" }}>{u.username}</td>
                  <td style={{ padding: "8px" }}>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};

export default Stats;
