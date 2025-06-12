import React, { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { Link, useNavigate } from "react-router-dom";

interface SignUpData {
  name: string;
  email: string;
  password: string;
}

const SignUpPage: React.FC = () => {
  const [data, setData] = useState<SignUpData>({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        localStorage.setItem("token", responseData.token);
        localStorage.setItem("userName", responseData.user.name);

        navigate("/");
      } else {
        alert(responseData.error || responseData.message || "Register failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }

    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div>
      <div className="auth">
        <div className="auth-main">
          <div className="auth-header">
            <div>Sticky Wall</div>
            <span>FuelBuddy - Shared To-Do Task</span>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form-h1">Welcome!</div>
            <div className="auth-form-h2">Create your account.</div>

            <div className="auth-form-field">
              <label htmlFor="name">
                <i className="fa-solid fa-user"></i>
              </label>
              <input
                required
                type="text"
                name="name"
                id="name"
                placeholder="Your Name"
                onChange={handleChange}
              />
            </div>

            <div className="auth-form-field">
              <label htmlFor="email">
                <i className="fa-solid fa-envelope"></i>
              </label>
              <input
                required
                type="email"
                name="email"
                id="email"
                placeholder="Email ID"
                onChange={handleChange}
              />
            </div>

            <div className="auth-form-field">
              <label htmlFor="password">
                <i className="fa-solid fa-lock"></i>
              </label>
              <input
                required
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                onChange={handleChange}
              />
            </div>

            {loading ? (
              <div className="auth-form-button-disable">Sign Up</div>
            ) : (
              <button type="submit">Sign Up</button>
            )}

            <div className="auth-form-option">
              Already have an account? <Link to="/login">Login here</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
