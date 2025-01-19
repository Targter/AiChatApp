import React, { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      // alert("Please enter both email and password.");
      toast.error("Please enter both email and passord");
      return;
    }

    try {
      // Send POST request to the backend
      const response = await axios.post(
        "http://localhost:3000/Login",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true, // Include cookies
        }
      );
      console.log("loginResponse:", response);
      if (response.status === 200) {
        // Redirect to home or dashboard after successful login
        // alert("Login Successful!");
        toast.success("login Successful");
        const { AccessToken } = response.data;
        localStorage.setItem("AccessToken", AccessToken);
        navigate("/"); // Redirect to home or dashboard
      } else {
        toast.error("Login failed. Please check your credentials. ");
        // alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error:", error);
      // alert("An error occurred. Please try again.");
      toast("Invalid username or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        <form onSubmit={handleLoginSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="current-password"
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="current-password"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>

        {/* Forgot Password & Register Links */}
        <div className="flex justify-between mt-4">
          <Link
            to="/ForgetPassword"
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot Password?
          </Link>
          <Link
            to="/Register"
            className="text-sm text-blue-500 hover:underline"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
