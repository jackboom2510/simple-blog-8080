import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";

const API_BASE = "/api";

const PostDetail = () => {
	const { slug } = useParams();
	const [post, setPost] = useState(null);
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [commentLoading, setCommentLoading] = useState(false);
	const [commentError, setCommentError] = useState("");
	const [commentSuccess, setCommentSuccess] = useState("");
  const storedUsername = localStorage.getItem("username");
  const isAuth = localStorage.getItem("isAuth") === "true";

  const handleEditComment = async (commentId, newContent) => {
		try {
			const res = await axios.put(
				`${API_BASE}/posts/${slug}/comments/${commentId}`,
				{ content: newContent },
			);

			setComments((prev) =>
				prev.map((c) => (c._id === commentId ? res.data : c)),
			);
		} catch (err) {
			alert("Không thể sửa comment");
		}
	};

	const handleDeleteComment = async (commentId) => {
		// if (!window.confirm("Bạn có chắc muốn xoá?")) return;

		try {
			await axios.delete(`${API_BASE}/posts/${slug}/comments/${commentId}`);

			setComments((prev) => prev.filter((c) => c._id !== commentId));
		} catch (err) {
			alert("Không thể xoá comment");
		}
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

	const handleSendComment = async (commentText) => {
		setCommentLoading(true);
		setCommentError("");
		setCommentSuccess("");
		try {
			const response = await axios.post(`${API_BASE}/posts/${slug}/comments`, {
				content: commentText,
				author: isAuth ? storedUsername : "Anonymous",
			});

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
				<h2>{post.title}</h2>
				<p className="post-detail-date">
					<strong>Ngày đăng:</strong> {post.createdAt}
				</p>
				<img
					src={post.thumbnail}
					alt={post.title}
					className="post-detail-image"
				/>
				<p className="post-detail-content">
					{post.content}
				</p>
			</section>

			<hr className="post-detail-hr" />

			<section>
				<CommentInput onSend={handleSendComment} isLoading={commentLoading} />
				{commentError && <p className="post-detail-comment-error">{commentError}</p>}
				{commentSuccess && <p className="post-detail-comment-success">✓ {commentSuccess}</p>}
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
