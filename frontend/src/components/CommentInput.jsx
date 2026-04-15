import React from "react";
import { useForm } from "react-hook-form";

const CommentInput = ({ onSend, isLoading }) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	const onSubmit = (data) => {
		onSend(data.commentText);
		reset();
	};

	return (
		<div className="comment-input-container">
			<h3 className="comment-input-title">Bình luận</h3>

			<form onSubmit={handleSubmit(onSubmit)}>
				<textarea
					{...register("commentText", {
						required: true
					})}
					placeholder="Viết bình luận của bạn..."
					rows="3"
					disabled={isLoading}
					className="comment-input-textarea"
				/>

				{errors.commentText && (
					<span className="comment-input-error">
						{errors.commentText.message}
					</span>
				)}

				<button
					type="submit"
					disabled={isLoading}
					className="comment-input-submit-btn"
				>
					{isLoading ? "Đang gửi..." : "Gửi bình luận"}
				</button>
			</form>
		</div>
	);
};

export default CommentInput;
