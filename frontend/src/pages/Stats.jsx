import React, { useEffect, useState } from "react";
import axios from "axios";
import ActionMenu from "../components/ActionMenu";
import { useForm } from "react-hook-form";

const API_BASE = "/api";
const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };

const Stats = () => {
	const [posts, setPosts] = useState([]);
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [editingUserId, setEditingUserId] = useState(null);

	const role = localStorage.getItem("role");
	const currentUser = localStorage.getItem("username");
	const isAdmin = role === "admin";

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				const postsRes = await axios.get(`${API_BASE}/posts`, { headers });
				setPosts(postsRes.data);

				if (isAdmin) {
					const usersRes = await axios.get(`${API_BASE}/users`, { headers });
					setUsers(usersRes.data);
				}
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [isAdmin]);
	const handleEditPost = (post) => {
		console.log("Edit post:", post);
	};

	const handleDeletePost = async (post) => {
		try {
			await axios.delete(`${API_BASE}/posts/${post._id}`, { headers });
			setPosts((prev) => prev.filter((p) => p._id !== post._id));
		} catch (err) {
			console.error(err);
		}
	};

	const handleEditUser = (user) => {
		setEditingUserId(user._id);
		reset({
			username: user.username,
			password: "",
			role: user.role,
		});
	};

	const handleDeleteUser = async (user) => {
		try {
			await axios.delete(`${API_BASE}/users/${user._id}`, { headers });
			setUsers((prev) => prev.filter((u) => u._id !== user._id));
      console.log(users);
		} catch (err) {
			console.error(err);
		}
	};

	const onSubmit = async (data) => {
		try {
			const payload = {
				username: data.username,
				role: data.role,
			};

			if (data.password) {
				payload.password = data.password;
			}

			const res = await axios.put(
				`${API_BASE}/users/${editingUserId}`,
				payload,
				{ headers }
			);

			setUsers((prev) =>
				prev.map((u) => (u._id === editingUserId ? res.data : u)),
			);

			setEditingUserId(null);
		} catch (err) {
			console.error(err);
		}
	};

	const handleCancel = () => {
		setEditingUserId(null);
	};

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
							<th>STT</th>
							<th>Title</th>
							<th>Summary</th>
							<th>CreatedAt</th>
							<th>Actions</th>
						</tr>
					</thead>

					<tbody>
						{posts
							.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
							.map((post, index) => {
								const canEdit = isAdmin || post.author === currentUser;

								return (
									<tr key={post._id}>
										<td>{index + 1}</td>
										<td>{post.title}</td>
										<td>
											{post.summary.length > 100
												? post.summary.slice(0, 100) + "..."
												: post.summary}
										</td>
										<td>{new Date(post.createdAt).toLocaleString("vi-VN")}</td>
										<td>
											{canEdit && (
												<ActionMenu
													item={post}
													onEdit={handleEditPost}
													onDelete={handleDeletePost}
												/>
											)}
										</td>
									</tr>
								);
							})}
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
								<th>Password</th>
								<th>Actions</th>
							</tr>
						</thead>

						<tbody>
							{users.map((u) => {
								const canModifyUser = isAdmin && u.role !== "admin";
								const isEditing = editingUserId === u._id;

								return (
									<tr key={u._id}>
										<td>
											{isEditing ? (
												<>
													<input
														{...register("username", {
															required: "Username không được để trống",
														})}
													/>
													{errors.username && (
														<p style={{ color: "red" }}>
															{errors.username.message}
														</p>
													)}
												</>
											) : (
												u.username
											)}
										</td>
										<td>
											{isEditing ? (
												<select
													{...register("role", {
														required: "Role là bắt buộc",
													})}
												>
													<option value="user">user</option>
													<option value="admin">admin</option>
												</select>
											) : (
												u.role
											)}
										</td>
										<td>
											{isEditing ? (
												<>
													<input
														type="password"
														placeholder="Mật khẩu mới"
														{...register("password", {
															minLength: {
																value: 6,
																message: "Mật khẩu tối thiểu 6 ký tự",
															},
														})}
													/>
													{errors.password && (
														<p style={{ color: "red" }}>
															{errors.password.message}
														</p>
													)}
												</>
											) : (
												""
											)}
										</td>
										<td>
											{isEditing ? (
												<>
													<button onClick={handleSubmit(onSubmit)}>Lưu</button>
													<button onClick={handleCancel}>Hủy</button>
												</>
											) : (
												canModifyUser && (
													<ActionMenu
														item={u}
														onEdit={handleEditUser}
														onDelete={handleDeleteUser}
													/>
												)
											)}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</section>
			)}
		</div>
	);
};

export default Stats;
