import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import ActionMenu from "./ActionMenu";

const API_BASE = "/api";
const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };

const PostDetail = () => {
	const { slug } = useParams();
	const navigate = useNavigate();

	const [post, setPost] = useState(null);
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [commentLoading, setCommentLoading] = useState(false);
	const [commentError, setCommentError] = useState("");
	const [commentSuccess, setCommentSuccess] = useState("");

	const [isEditing, setIsEditing] = useState(false);
	const [editForm, setEditForm] = useState({
		title: "",
		content: "",
	});

	const storedUsername = localStorage.getItem("username");
	const role = localStorage.getItem("role");
	const isAuth = localStorage.getItem("isAuth") === "true";

	const isOwner = post?.author === storedUsername;
	const isAdmin = role === "admin";
	const canEditPost = isOwner || isAdmin;

	const formatDate = (date) => {
		if (!date) return "";

		const d = new Date(date);
		if (isNaN(d.getTime())) return "";

		const now = new Date();
		const diff = (now - d) / 1000;

		if (diff < 60) return "vừa xong";
		if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
		if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;

		return d.toLocaleDateString("vi-VN");
	};

	useEffect(() => {
		let canceled = false;

		async function fetchDetail() {
			try {
				const resp = await axios.get(`${API_BASE}/posts/${slug}`);
				if (!canceled) {
					setPost(resp.data);
					setComments(resp.data.comments || []);
				}
			} catch (err) {
				if (!canceled) {
					setError(
						err?.response?.status === 404
							? "Không tìm thấy bài viết"
							: "Lỗi khi gọi API",
					);
				}
			} finally {
				if (!canceled) setLoading(false);
			}
		}

		fetchDetail();
		return () => {
			canceled = true;
		};
	}, [slug]);

	const startEdit = () => {
		setIsEditing(true);
		setEditForm({
			title: post.title,
			content: post.content,
		});
	};

	const handleChange = (e) => {
		setEditForm({
			...editForm,
			[e.target.name]: e.target.value,
		});
	};

	const handleSavePost = async () => {
		try {
			const res = await axios.put(`${API_BASE}/posts/${post._id}`, {
				title: editForm.title,
				content: editForm.content,
			}, { headers });

			setPost(res.data);
			setIsEditing(false);
		} catch (err) {
			alert("Không thể cập nhật bài viết");
		}
	};

	const handleDeletePost = async () => {
		try {
			await axios.delete(`${API_BASE}/posts/${post._id}`, { headers });
			navigate("/");
		} catch (err) {
			alert("Không thể xoá bài viết");
		}
	};

	const handleEditComment = async (commentId, newContent) => {
		try {
			const res = await axios.put(
				`${API_BASE}/posts/${slug}/comments/${commentId}`,
				{ content: newContent },
				{ headers }
			);

			setComments((prev) =>
				prev.map((c) => (c._id === commentId ? res.data : c)),
			);
		} catch (err) {
			alert("Không thể sửa comment");
		}
	};

	const handleDeleteComment = async (commentId) => {
		try {
			await axios.delete(`${API_BASE}/posts/${slug}/comments/${commentId}`, { headers });
			setComments((prev) => prev.filter((c) => c._id !== commentId));
		} catch (err) {
			alert("Không thể xoá comment");
		}
	};

	const handleSendComment = async (commentText) => {
		setCommentLoading(true);
		setCommentError("");
		setCommentSuccess("");

		try {
			const response = await axios.post(`${API_BASE}/posts/${slug}/comments`, {
				content: commentText,
				author: isAuth ? storedUsername : "Anonymous",
				createdAt: new Date().toISOString(),
			}, { headers });

			if (response.status === 201) {
				setCommentSuccess("Bình luận thành công!");
				setComments((prev) => [response.data, ...prev]);
				setTimeout(() => setCommentSuccess(""), 3000);
			}
		} catch (err) {
			setCommentError(err.response?.data?.error || "Không thể gửi bình luận");
		} finally {
			setCommentLoading(false);
		}
	};

	if (loading) return <p>Đang tải bài viết...</p>;
	if (error) return <p>Lỗi: {error}</p>;
	if (!post) return <p>Không tìm thấy bài viết.</p>;

	return (
		<div className="post-detail-container">
			<section>
				<div className="comment-header">
					{isEditing ? (
						<input
							name="title"
							value={editForm.title}
							onChange={handleChange}
							className="edit-title-input"
						/>
					) : (
						<h2>{post.title}</h2>
					)}

					{canEditPost && !isEditing && (
						<ActionMenu
							item={post}
							onEdit={startEdit}
							onDelete={handleDeletePost}
						/>
					)}
				</div>

				<p className="post-detail-date">
					<strong>Ngày đăng:</strong> {formatDate(post.createdAt)}
				</p>

				<img
					src={post.thumbnail}
					alt={post.title}
					className="post-detail-image"
				/>

				{isEditing ? (
					<>
						<textarea
							name="content"
							value={editForm.content}
							onChange={handleChange}
							className="edit-content-textarea"
						/>
						<div>
							<button onClick={handleSavePost}>Lưu</button>
							<button onClick={() => setIsEditing(false)}>Hủy</button>
						</div>
					</>
				) : (
					<p className="post-detail-content">{post.content}</p>
				)}
			</section>

			<hr className="post-detail-hr" />

			<section>
				<CommentInput onSend={handleSendComment} isLoading={commentLoading} />

				{commentError && (
					<p className="post-detail-comment-error">{commentError}</p>
				)}

				{commentSuccess && (
					<p className="post-detail-comment-success">✓ {commentSuccess}</p>
				)}

				<CommentList
					comments={comments}
					currentUser={storedUsername}
					onEdit={handleEditComment}
					onDelete={handleDeleteComment}
				/>
			</section>
		</div>
	);
};

export default PostDetail;
