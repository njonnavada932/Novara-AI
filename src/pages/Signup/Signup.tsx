import { useState, useEffect, FormEvent } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Logo from "../../components/common/Logo";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../../services/authservice";
import { db } from "../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { signInWithGoogle } from "../../services/authservice";
import { toast } from "react-hot-toast";

interface SignupFormProps {
  //   onToggleView: () => void;
  //   onGoogleSignIn: () => void;
  //   onSignupSuccess: (user: { name: string; email: string }) => void;
  //   addToast: (msg: string, type: "success" | "error" | "info") => void;
}

export default function SignupForm(
  {
    //   onToggleView,
    //   onGoogleSignIn,
    //   onSignupSuccess,
    //   addToast,
  }: SignupFormProps,
) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  useEffect(() => {
    setName("");
    setPhone("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }, []);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const validate = () => {
    const nextErrors: typeof errors = {};

    if (!name.trim()) {
      nextErrors.name = "Full name is required";
    }

    if (!email) {
      nextErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        nextErrors.email = "Please enter a valid email address";
      }
    }
    if (!phone) {
      nextErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
      nextErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!password) {
      nextErrors.password = "Password is required";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Confirm password is required";
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.success("Please correct the form errors");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signupUser(email, password);

      //   setIsLoading(false);

      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        phone: phone,
        createdAt: new Date(),
        streak: 0,
        aiPoints: 0,
        premium: false,
        notificationEnabled: true,
      });
      //   onSignupSuccess({
      //     name: name,
      //     email: user.email || "",
      //   });

      alert("Account created successfully!");

      console.log("Before navigate");
      navigate("/login", {
        state: {
          email: email,
        },
      });
      console.log("After navigate");
    } catch (error: any) {
      setIsLoading(false);

      alert(error.message);
    }

    // Simulate signup request
    // setTimeout(() => {
    //   setIsLoading(false);
    //   //   onSignupSuccess({
    //   //     name: name.trim(),
    //   //     email: email,
    //   //   });
    //   navigate("/dashboard");
    //   alert(`Welcome ${name}`);
    // }, 1800);
  };

  return (
    <motion.div
      id="signup-form-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/60 p-6 sm:p-8 flex flex-col"
    >
      {/* Novara AI Brand & Logo */}
      <div className="mb-8">
        <Logo showTagline={true} />
      </div>

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-4 flex-1">
        {/* Full Name Input */}
        <div className="space-y-1.5">
          <label
            htmlFor="signup-name"
            className="text-xs font-semibold text-slate-700 block"
          >
            Full Name
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <User className="h-4.5 w-4.5" />
            </span>
            <input
              id="signup-name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name)
                  setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              className={`w-full pl-10.5 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium placeholder-slate-400 transition-all outline-none focus:bg-white ${
                errors.name
                  ? "border-rose-300 focus:ring-4 focus:ring-rose-50"
                  : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              }`}
              disabled={isLoading}
            />
          </div>
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-semibold text-rose-500"
            >
              {errors.name}
            </motion.p>
          )}
        </div>

        {/* Email Input */}
        <div className="space-y-1.5">
          <label
            htmlFor="signup-email"
            className="text-xs font-semibold text-slate-700 block"
          >
            Email Address
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Mail className="h-4.5 w-4.5" />
            </span>
            <input
              id="signup-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email)
                  setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              className={`w-full pl-10.5 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium placeholder-slate-400 transition-all outline-none focus:bg-white ${
                errors.email
                  ? "border-rose-300 focus:ring-4 focus:ring-rose-50"
                  : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              }`}
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-semibold text-rose-500"
            >
              {errors.email}
            </motion.p>
          )}
        </div>
        {/*Phone number*/}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Phone Number
          </label>

          <input
            type="tel"
            placeholder="9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full pl-3 pr-3 py-2.5 bg-slate-50 border rounded-xl"
          />

          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone}</p>
          )}
        </div>
        {/* Password Input */}
        <div className="space-y-1.5">
          <label
            htmlFor="signup-password"
            className="text-xs font-semibold text-slate-700 block"
          >
            Password
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Lock className="h-4.5 w-4.5" />
            </span>
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              className={`w-full pl-10.5 pr-10.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium placeholder-slate-400 transition-all outline-none focus:bg-white ${
                errors.password
                  ? "border-rose-300 focus:ring-4 focus:ring-rose-50"
                  : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              }`}
              disabled={isLoading}
            />
            <button
              id="toggle-signup-password"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-semibold text-rose-500"
            >
              {errors.password}
            </motion.p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-1.5">
          <label
            htmlFor="signup-confirm-password"
            className="text-xs font-semibold text-slate-700 block"
          >
            Confirm Password
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Lock className="h-4.5 w-4.5" />
            </span>
            <input
              id="signup-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword)
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: undefined,
                  }));
              }}
              className={`w-full pl-10.5 pr-10.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium placeholder-slate-400 transition-all outline-none focus:bg-white ${
                errors.confirmPassword
                  ? "border-rose-300 focus:ring-4 focus:ring-rose-50"
                  : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              }`}
              disabled={isLoading}
            />
            <button
              id="toggle-signup-confirm-password"
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-semibold text-rose-500"
            >
              {errors.confirmPassword}
            </motion.p>
          )}
        </div>

        {/* Submit button */}
        <button
          id="signup-submit-btn"
          type="submit"
          disabled={isLoading}
          className="w-full relative flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200 transition-all cursor-pointer disabled:opacity-80"
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Sign Up
              <ArrowRight className="h-4.5 w-4.5" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-slate-100" />
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          Or continue with
        </span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>

      {/* Google OAuth Button */}
      <button
        id="signup-google-btn"
        // onClick={onGoogleSignIn}
        onClick={async () => {
          try {
            await signInWithGoogle();
            navigate("/dashboard");
          } catch (err) {
            toast.error("Google sign-in failed");
          }
        }}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-60"
      >
        <svg
          className="h-5 w-5 shrink-0"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="matrix(1, 0, 0, 1, 0, 0)">
            <path
              d="M21.35,11.1H12v2.7h5.38C16.88,16.03,14.73,17.1,12,17.1C9.18,17.1,6.8,15,6.1,12.35c-0.18-0.53-0.28-1.1-0.28-1.7s0.1-1.17,0.28-1.7C6.8,6.3,9.18,4.2,12,4.2c1.8,0,3.34,0.7,4.52,1.86l2.02-2.02C16.85,2.4,14.58,1.5,12,1.5C7.45,1.5,3.61,4.45,2.22,8.53c-0.29,0.85-0.45,1.77-0.45,2.72s0.16,1.87,0.45,2.72c1.39,4.08,5.23,7.03,9.78,7.03c2.9,0,5.65-1.07,7.6-2.93c2.05-1.95,2.83-4.75,2.54-7.25H21.35z"
              fill="#4285F4"
            />
            <path
              d="M2.22,8.53L5.47,11C6.27,8.6,8.5,7,11.1,7c1.4,0,2.6,0.5,3.5,1.3l2.6-2.6C15.6,4.3,13.5,3,11.1,3C7.5,3,4.4,5.3,2.22,8.53z"
              fill="#EA4335"
            />
            <path
              d="M11.1,21c2.4,0,4.5-1.3,5.6-3.4l-2.6-2.6C13.2,16.1,12,16.5,11.1,16.5c-2.6,0-4.8-1.6-5.6-4L2.22,15C4.4,18.2,7.5,21,11.1,21z"
              fill="#34A853"
            />
            <path
              d="M2.22,15l3.25-2.5C5.29,11.97,5.2,11.49,5.2,11c0-0.49,0.09-0.97,0.27-1.47L2.22,7C1.4,8.6,1,10.4,1,12.2C1,14,1.4,15.8,2.22,17.4V15z"
              fill="#FBBC05"
            />
          </g>
        </svg>
        Continue with Google
      </button>

      {/* Login Link */}
      <p className="text-center text-xs text-slate-500 font-medium mt-8">
        Already have an account?{" "}
        <button
          id="toggle-to-login-btn"
          type="button"
          //   onClick={onToggleView}
          onClick={() => navigate("/login")}
          className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-all cursor-pointer"
        >
          Sign In
        </button>
      </p>
    </motion.div>
  );
}
