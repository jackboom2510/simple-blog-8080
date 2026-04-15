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
		<div className="login-container">
			<h2>Đăng nhập</h2>

			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="login-form-group">
					<label>Username</label>
					<input
						type="text"
						{...register("username", {
							required: "Vui lòng nhập username",
						})}
						className="login-input"
					/>
					{errors.username && (
						<p className="login-error">
							{errors.username.message}
						</p>
					)}
				</div>
				<div className="login-form-group">
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
						className="login-input"
					/>
					{errors.password && (
						<p className="login-error">
							{errors.password.message}
						</p>
					)}
				</div>

				{error && <p className="login-error">{error}</p>}
				<button
					type="submit"
					className="login-submit-btn"
					disabled={isSubmitting}
				>
					{isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
				</button>
			</form>
		</div>
	);
};

export default Login;