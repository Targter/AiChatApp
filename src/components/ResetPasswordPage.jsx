import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ResetPasswordPage() {
  const [step, setStep] = useState(1); // To handle step progress
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/forgetPassword",
        { email }
      );

      if (response.status === 200) {
        setOtpSent(true);
        setStep(2); // Move to OTP verification step
        toast.info("OTP sent to you email");
        // alert("OTP sent to your email!");
      } else {
        toast.error("Error sending OTP. Please try again. ");
        setErrorMessage("Error sending OTP. Please try again.");
      }
    } catch (error) {
      toast.error(error);
      setErrorMessage("Error sending OTP. Please try again.");
      console.error(error);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      try {
        console.log("this called", otp);
        const response = await axios.post("http://localhost:3000/varifymail", {
          email,
          otp,
        });
        console.log("response:", response);
        if (response.status === 200) {
          setOtpVerified(true);
          setStep(3); // Move to the password reset step
          toast.info("OTP verified! You can now set a new password.");
        } else {
          setErrorMessage("Invalid OTP. Please try again.");
          console.log("error");
        }
      } catch (error) {
        setErrorMessage("Error verifying OTP. Please try again.");
        console.error(error);
        toast.error("error Occured try again");
        // console.log("errrolewakrj");
      }
    } else {
      toast.error("Please enter a valid 6-digit OTP.");
      setErrorMessage("Please enter a valid 6-digit OTP.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      try {
        const response = await axios.post(
          "http://localhost:3000/updatePassword",
          {
            email,
            newPassword,
          }
        );

        if (response.status === 200) {
          //   alert("Password reset successfully!");
          toast.success("Password reset successfully!");
          navigate("/login"); // Redirect to login page after password reset
        } else {
          setErrorMessage("Error resetting password. Please try again.");
        }
      } catch (error) {
        setErrorMessage("Error resetting password. Please try again.");
        // console.error(error);
        toast.error("Error Occured while login try again ");
      }
    } else {
      setErrorMessage("Passwords do not match.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-black">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Reset Password
        </h2>

        {step === 1 && (
          <form onSubmit={handleRequestOtp}>
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
            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
            >
              Request OTP
            </button>
          </form>
        )}

        {step === 2 && otpSent && (
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-2">
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
            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
            >
              Verify OTP
            </button>
          </form>
        )}

        {step === 3 && otpVerified && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-2">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
