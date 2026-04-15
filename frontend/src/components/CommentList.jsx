import React, { useState } from "react";
import CommentMenu from "./CommentMenu";

const CommentList = ({ comments = [], currentUser, onEdit, onDelete }) => {
	const [editingId, setEditingId] = useState(null);
	const [editContent, setEditContent] = useState("");

	const formatDate = (date) => {
		if (!date) return "";
		return new Date(date).toLocaleString("vi-VN");
	};

	const startEdit = (comment) => {
		setEditingId(comment._id);
		setEditContent(comment.content);
	};

	const cancelEdit = () => {
		setEditingId(null);
		setEditContent("");
	};

	const saveEdit = (commentId) => {
		if (!editContent.trim()) return;
		onEdit(commentId, editContent);
		cancelEdit();
	};

	if (comments.length === 0) {
		return (
			<p className="comment-list-empty">
				Chưa có bình luận nào. Hãy là người đầu tiên!
			</p>
		);
	}

	return (
		<div className="comment-list-container">
			<h3 className="comment-list-title">
				Bình luận ({comments.length})
			</h3>

			<div className="comment-list">
				{comments.map((comment) => {
					const isOwner = currentUser && comment.author === currentUser;

					const isEditing = editingId === comment._id;

					return (
						<div
							key={comment._id}
							className="comment-item"
						>
							<div className="comment-header">
								<div>
									<span className="comment-author">
										{comment.author || "Khách"}
									</span>
									<span className="comment-date">
										{formatDate(comment.createdAt)}
									</span>
								</div>

								{isOwner && !isEditing && (
									<CommentMenu
										comment={comment}
										onEdit={startEdit}
										onDelete={(c) => onDelete(c._id)}
									/>
								)}
							</div>

							{isEditing ? (
								<div>
									<textarea
										value={editContent}
										onChange={(e) => setEditContent(e.target.value)}
										className="comment-edit-textarea"
									/>
									<div className="comment-actions">
										<button
											onClick={() => saveEdit(comment._id)}
											className="comment-save-btn"
										>
											Lưu
										</button>
										<button
											onClick={cancelEdit}
											className="comment-cancel-btn"
										>
											Hủy
										</button>
									</div>
								</div>
							) : (
								<p className="comment-content">
									{comment.content}
								</p>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default CommentList;
