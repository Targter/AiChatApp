import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
function RegisterUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  //
  const [otpSentTime, setOtpSentTime] = useState(null); // Store OTP sent time
  const [remainingTime, setRemainingTime] = useState(0);
  const navigate = useNavigate();

  //
  useEffect(() => {
    if (otpSentTime) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - otpSentTime) / 1000); // Time in seconds
        const timeLeft = Math.max(0, 30 - elapsed); // 300 seconds = 5 minutes
        setRemainingTime(timeLeft);

        if (timeLeft === 0) {
          clearInterval(interval); // Stop the interval when 5 minutes are up
        }
      }, 1000);

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [otpSentTime]);

  //
  const handleOtpRequestOrVerify = async (e) => {
    e.preventDefault();
    if (!otpSent) {
      // Request OTP
      if (name && email && password) {
        try {
          const response = await axios.post(
            "http://localhost:3000/Register",
            {
              email: email,
            },
            {
              withCredentials: true, // Include cookies
            }
          );
          console.log(response);
          if (response.status === 200) {
            setOtpSent(true);
            setOtpSentTime(Date.now());
            toast(response.data.message);
            // alert("OTP sent to your email.");
          } else {
            alert(`Error: ${response.data.message}`);
          }
        } catch (error) {
          console.error("Error:", error);
          // toast(error.response.data.message);
          alert("An erry again.");
        }
      } else {
        alert("Please fill in all fields.");
      }
    } else {
      // Verify OTP
      if (otp.length === 6) {
        try {
          const response = await axios.post(
            "http://localhost:3000/verifyOtp",
            {
              email: email,
              otp: otp,
              username: name,
              password: password,
            },
            {
              withCredentials: true, // Include cookies
            }
          );
          console.log(response);
          if (response.status === 200) {
            setOtpVerified(true);
            toast(response.data.message);
            if (response.data.user.emailVerified) {
              navigate("/");
            }

            // alert("OTP Verified! You can now submit the form.");
          } else {
            toast(response.data.message);
            // alert("Invalid OTP. Please try again.");
          }
        } catch (error) {
          console.error("Error:", error.response.data.message);
          // toast(response.data.message);
          // alert("An error occu.");
          toast(error.response.data.message);
        }
      } else {
        // alert("Please enter a valid 6-digit OTP.");
        toast.error("Please enter a valid otp");
      }
    }
  };

  const handleResendOtp = async () => {
    if (remainingTime === 0) {
      // Resend OTP
      setOtpSent(false); // Reset OTP sent state
      setOtp(""); // Clear OTP field
      setOtpSentTime(null); // Reset OTP sent time
      setRemainingTime(0); // Reset remaining time
      handleOtpRequestOrVerify(); // Request OTP again
    } else {
      toast.info(`You can resend the OTP in ${remainingTime} seconds.`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-black">
        <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
        <form onSubmit={handleOtpRequestOrVerify}>
          <div className="mb-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-2">
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
            />
          </div>
          <div className="mb-4">
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
            />
          </div>

          {otpSent && (
            <div className="mb-4 mt-4">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            {otpSent ? "Verify OTP" : "Get OTP"}
          </button>
        </form>

        {/* <form onSubmit={handleFinalSubmit}>
          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
            disabled={!otpVerified}
          >
            Register
          </button>
        </form> */}
        {/*
         */}
        {otpSent && remainingTime === 0 && (
          <button
            onClick={handleResendOtp}
            className="w-full py-3 bg-gray-500 text-white font-semibold rounded-lg mt-4 hover:bg-gray-600 transition"
          >
            Resend OTP
          </button>
        )}
        {remainingTime > 0 && (
          <p className="text-center text-sm mt-2 text-gray-500">
            Resend OTP in {remainingTime} seconds.
          </p>
        )}

        {/*  */}
        <div className="flex justify-between mt-4">
          <Link to="/Login" className="text-sm text-blue-500 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterUser;
