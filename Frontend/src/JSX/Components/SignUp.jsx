import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import axios from "axios";
import { useTheme } from "../Context/ThemeContext";
import BACKEND_URL from "../../Config/index.js";
import toast from "react-hot-toast";

const ResendVerification = ({ email, isSignUpOnce }) => {
  const [resendTimer, setResendTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleResend = async () => {
    if (resendTimer > 0 || !email || !isSignUpOnce) return;

    try {
      setIsLoading(true);
      await axios.post(`${BACKEND_URL}/api/v1/users/resend-email-verification`, { email });
      toast.success("Verification mail resent to your email.");
      setResendTimer(60);
    } catch (err) {
      toast.error("Failed to send verification mail. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      disabled={resendTimer > 0 || !email || !isSignUpOnce || isLoading}
      onClick={handleResend}
      className={`cursor-pointer mt-3 flex items-center gap-1 text-sm text-blue-500 hover:underline focus:outline-none ${isSignUpOnce ? "block" : "hidden"
        }`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
          <span>Sending...</span>
        </>
      ) : resendTimer > 0 ? (
        `Resend verification mail in ${resendTimer}s`
      ) : (
        "Resend verification mail"
      )}
    </button>
  );
};

const SignUp = () => {
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUpOnce, setIsSignUpOnce] = useState(false);

  const { darkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("The passwords you entered do not match. Please try again.");
      return;
    }

    if (!fullName || !email || !password || !userName) {
      toast.error("All fields are required. Please ensure no field is left blank.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/users/register`,
        { userName, fullName, email, password },
        { withCredentials: true }
      );

      console.log("Sign up successful:", res.data);
      setIsSignUpOnce(true);
      toast.success("Please verify your email address to continue.", { duration: 6000 });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred. Please try again later.";

      console.error("Signup failed:", errorMessage);
      toast.error(`Signup failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className={`transition-colors duration-300 min-h-screen flex flex-col items-center justify-center p-4 ${darkMode
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900"
        : "bg-gradient-to-br from-indigo-50 via-white to-purple-50"}`}>

        <div className="mb-8">
          <img src="/logo.png" alt="CKsEdu Logo" className="h-20 w-auto" />
        </div>

        <div className={`w-full max-w-md p-8 space-y-8 ${darkMode ? "bg-gray-800/30" : "bg-white/30"} backdrop-blur-lg rounded-2xl shadow-lg border ${darkMode ? "border-gray-700/40" : "border-white/40"}`}>
          <div className="text-center">
            <h2 className={`text-3xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-800"}`}>
              Create an Account
            </h2>
            <p className={`mt-2 text-sm ${darkMode ? "text-gray-300" : "text-slate-600"}`}>
              Join us and start your journey today.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-gray-400" : "text-slate-400"}`} />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`peer w-full bg-transparent border-b-2 ${darkMode ? "border-gray-600 text-white placeholder:text-gray-400" : "border-slate-300 text-slate-800 placeholder:text-slate-500"} pl-10 pr-3 py-2 focus:outline-none focus:border-blue-600`}
                placeholder="Full Name"
              />
            </div>

            <div className="relative">
              <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-gray-400" : "text-slate-400"}`} />
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className={`peer w-full bg-transparent border-b-2 ${darkMode ? "border-gray-600 text-white placeholder:text-gray-400" : "border-slate-300 text-slate-800 placeholder:text-slate-500"} pl-10 pr-3 py-2 focus:outline-none focus:border-blue-600`}
                placeholder="User Name"
              />
            </div>

            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-gray-400" : "text-slate-400"}`} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`peer w-full bg-transparent border-b-2 ${darkMode ? "border-gray-600 text-white placeholder:text-gray-400" : "border-slate-300 text-slate-800 placeholder:text-slate-500"} pl-10 pr-3 py-2 focus:outline-none focus:border-blue-600`}
                placeholder="Email address"
              />
            </div>

            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-gray-400" : "text-slate-400"}`} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`peer w-full bg-transparent border-b-2 ${darkMode ? "border-gray-600 text-white placeholder:text-gray-400" : "border-slate-300 text-slate-800 placeholder:text-slate-500"} pl-10 pr-3 py-2 focus:outline-none focus:border-blue-600`}
                placeholder="Password"
              />
            </div>

            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-gray-400" : "text-slate-400"}`} />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`peer w-full bg-transparent border-b-2 ${darkMode ? "border-gray-600 text-white placeholder:text-gray-400" : "border-slate-300 text-slate-800 placeholder:text-slate-500"} pl-10 pr-3 py-2 focus:outline-none focus:border-blue-600`}
                placeholder="Confirm Password"
              />
            </div>

            <ResendVerification email={email} isSignUpOnce={isSignUpOnce} />

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-300 ${isLoading && 'cursor-not-allowed'}`}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Sign Up'}
              </button>
            </div>
          </form>

          <p className={`text-center text-sm ${darkMode ? "text-gray-300" : "text-slate-600"}`}>
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
