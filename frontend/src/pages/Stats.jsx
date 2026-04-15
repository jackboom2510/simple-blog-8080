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

      <section className="stats-container">
        <h2>Danh sách bài viết</h2>
        <table className="stats-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Slug</th>
              <th>CreatedAt</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>{post.title}</td>
                <td>{post.slug}</td>
                <td>{post.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {isAdmin && (
        <section className="stats-container">
          <h2>Danh sách người dùng</h2>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr key={index}>
                  <td>{u.username}</td>
                  <td>{u.role}</td>
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
