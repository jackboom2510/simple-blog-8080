import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";

const Login = () => {
	const navigate = useNavigate();
	const [error, setError] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm();

	useEffect(() => {
		if (localStorage.getItem("isAuth") === "true") {
			navigate("/");
		}
	}, [navigate]);

	const onSubmit = async (data) => {
		setError("");

		try {
			const response = await axios.post("/api/login", data);

			if (response.data.success) {
				localStorage.setItem("isAuth", "true");
				localStorage.setItem("username", response.data.user.username);
				localStorage.setItem("role", response.data.user.role);
				localStorage.setItem("token", response.data.token);
				navigate("/");
			}
		} catch (err) {
			if (err.response?.data?.error) {
				setError(err.response.data.error);
			} else {
				setError("Đã xảy ra lỗi. Vui lòng thử lại.");
			}
		}
	};

	return (
		<div className="auth-container">
			<h2>Đăng nhập</h2>

			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="auth-form-group">
					<label>Username</label>
					<input
						type="text"
						{...register("username", {
							required: "Vui lòng nhập username",
						})}
						className="auth-input"
					/>
					{errors.username && (
						<p className="auth-error">{errors.username.message}</p>
					)}
				</div>
				<div className="auth-form-group">
					<label>Password</label>
					<input
						type="password"
						{...register("password", {
							required: "Vui lòng nhập mật khẩu",
							minLength: {
								value: 4,
								message: "Mật khẩu phải có ít nhất 4 ký tự",
							},
						})}
						className="auth-input"
					/>
					{errors.password && (
						<p className="auth-error">{errors.password.message}</p>
					)}
				</div>

				{error && <p className="auth-error">{error}</p>}
				<button
					type="submit"
					className="auth-submit-btn"
					disabled={isSubmitting}
				>
					{isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
				</button>
			</form>
		</div>
	);
};

export default Login;
