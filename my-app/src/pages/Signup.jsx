import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    general: "",
    email: "",
    password: "",
    otp: ""
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: ""
  });

  // Timer countdown effect
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear specific field error when the user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const validateForm = () => {
    const newErrors = {
      general: "",
      email: "",
      password: "",
      otp: ""
    };
    
    let isValid = true;

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters with 1 uppercase letter, 1 lowercase letter, and 1 number";
      isValid = false;
    }

    if (otpSent && !formData.otp) {
      newErrors.otp = "Verification code is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const requestOtp = async () => {
    if (timer > 0) return;
    
    // Validate email before requesting OTP
    if (!validateEmail(formData.email)) {
      setErrors(prev => ({ 
        ...prev, 
        email: "Please enter a valid email address" 
      }));
      return;
    }
    
    setLoading(true);
    setErrors({ general: "", email: "", password: "", otp: "" });
    
    try {
      const response = await fetch("http://127.0.0.1:8000/admin/request-otp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        setOtpEmail(data.email || formData.email);
        setTimer(120); // 2 minutes countdown
      } else {
        setErrors(prev => ({
          ...prev,
          general: data.detail || "Unable to send verification code. Please try again."
        }));
      }
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        general: "Network error. Please check your connection and try again."
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setErrors({ general: "", email: "", password: "", otp: "" });

    // Check if max OTP attempts reached
    if (otpAttempts >= 4) { // 5th attempt (0-based index)
      setErrors(prev => ({
        ...prev,
        general: "Maximum verification attempts reached. Please request a new code."
      }));
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/admin/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          otp: formData.otp
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // On successful signup - redirect to login page
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 100);
      } else {
        setOtpAttempts(prevAttempts => prevAttempts + 1);
        
        // Provide user-friendly error message for OTP issues
        if (data.detail && data.detail.toLowerCase().includes("otp")) {
          setErrors(prev => ({ ...prev, otp: "Invalid verification code. Please try again." }));
          // Only clear the OTP field
          setFormData(prev => ({...prev, otp: ""}));
        } else {
          setErrors(prev => ({ 
            ...prev, 
            general: data.detail || "Account creation failed. Please try again." 
          }));
        }
      }
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        general: "Network error. Please check your connection and try again."
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-6 bg-gradient-to-r from-green-600 to-blue-600">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-96 max-w-[90%] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">Create Account</h2>
        {errors.general && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-3 py-2 rounded relative mb-3">
            <p className="text-sm">{errors.general}</p>
          </div>
        )}
        
        {otpSent && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded relative mb-3">
            <p className="text-sm">
              Verification code sent to <strong>{otpEmail}</strong>
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
  <div className="flex-grow">
    <label className="block text-gray-700 text-sm font-semibold mb-1">Verification Code</label>
    <input
      type="text"
      name="otp"
      value={formData.otp}
      onChange={handleChange}
      className={`w-full px-3 py-2 border ${errors.otp ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-10`}
      placeholder="6-digit code"
      required
    />
    {errors.otp && (
      <div className="border-l-2 border-red-500 pl-2 mt-1">
        <p className="text-red-600 text-xs">{errors.otp}</p>
      </div>
    )}
  </div>
  <div className="self-end mb-[1px]">
    <button 
      type="button" 
      onClick={requestOtp}
      disabled={loading || timer > 0}
      className={`whitespace-nowrap h-10 ${timer > 0 ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white font-medium px-3 rounded-lg transition duration-300 shadow-md text-sm min-w-[90px]`}
    >
      {loading ? "Sending..." : timer > 0 ? `${formatTime(timer)}` : otpSent ? "Resend" : "Get Code"}
    </button>
  </div>
</div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300 shadow-md mt-3"
            disabled={submitting || otpAttempts >= 5}
          >
            {submitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-600 text-sm">
            Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;