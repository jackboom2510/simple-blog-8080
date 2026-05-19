import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";

const API_BASE = "/api";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  useEffect(() => {
    if (localStorage.getItem("isAuth") === "true") {
      navigate("/");
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    setError("");

    try {
      await axios.post(`${API_BASE}/register`, {
        username: data.username,
        password: data.password,
        role: "user",
      });
      navigate("/login");
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
      <h2>Đăng ký</h2>

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

        <div className="auth-form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Vui lòng xác nhận mật khẩu",
              validate: (value) => value === password || "Mật khẩu không khớp",
            })}
            className="auth-input"
          />
          {errors.confirmPassword && (
            <p className="auth-error">{errors.confirmPassword.message}</p>
          )}
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button
          type="submit"
          className="auth-submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </form>
    </div>
  );
};

export default Register;
