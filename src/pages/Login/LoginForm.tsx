// import { useState, FormEvent } from "react";
// import { motion } from "motion/react";
// import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
// import Logo from "../../components/common/Logo";
// import { loginUser } from "../../services/authservice";
// // import {};

// interface LoginFormProps {
//   onToggleView: () => void;
//   onForgotPassword: () => void;
//   onGoogleSignIn: () => void;
//   onLoginSuccess: (user: { name: string; email: string }) => void;
//   addToast: (msg: string, type: "success" | "error" | "info") => void;
// }

// export default function LoginForm({
//   onToggleView,
//   onForgotPassword,
//   onGoogleSignIn,
//   onLoginSuccess,
//   addToast,
// }: LoginFormProps) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState<{ email?: string; password?: string }>(
//     {},
//   );
//   const [isLoading, setIsLoading] = useState(false);

//   const validate = () => {
//     const nextErrors: { email?: string; password?: string } = {};

//     if (!email) {
//       nextErrors.email = "Email is required";
//     } else {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email)) {
//         nextErrors.email = "Please enter a valid email address";
//       }
//     }

//     if (!password) {
//       nextErrors.password = "Password is required";
//     } else if (password.length < 6) {
//       nextErrors.password = "Password must be at least 6 characters";
//     }

//     setErrors(nextErrors);
//     return Object.keys(nextErrors).length === 0;
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!validate()) {
//       addToast("Please fix the validation errors", "error");
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const userCredential = await loginUser(email, password);

//       setIsLoading(false);

//       const user = userCredential.user;

//       onLoginSuccess({
//         name: user.displayName || user.email?.split("@")[0] || "User",
//         email: user.email || "",
//       });

//       addToast("Login Successful!", "success");
//     } catch (error: any) {
//       console.log(error);
//       console.log(error.code);
//       console.log(error.message);
//       setIsLoading(false);

//       switch (error.code) {
//         case "auth/user-not-found":
//           alert("User does not exist.");
//           break;

//         case "auth/invalid-credential":
//           alert("Invalid email or password.");
//           break;

//         case "auth/wrong-password":
//           alert("Incorrect password.");
//           break;

//         case "auth/invalid-email":
//           alert("Please enter a valid email.");
//           break;

//         case "auth/too-many-requests":
//           alert("Too many failed attempts. Please try again later.");
//           break;

//         default:
//           alert(error.message);

//           addToast(error.message, "error");
//       }

//       // Simulate login loading delay
//       // setTimeout(() => {
//       //   setIsLoading(false);

//       //   // Extract first part of email for name
//       //   const displayName = email.split("@")[0];
//       //   const capitalizedName =
//       //     displayName.charAt(0).toUpperCase() + displayName.slice(1);

//       //   onLoginSuccess({
//       //     name: capitalizedName,
//       //     email: email,
//       //   });
//       //   addToast(`Successfully logged in as ${capitalizedName}!`, "success");
//       // }, 1800);
//     }
//   };

//   return (
//     <motion.div
//       id="login-form-card"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       transition={{ duration: 0.35, ease: "easeOut" }}
//       className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/60 p-6 sm:p-8 flex flex-col"
//     >
//       {/* Novara AI Brand & Logo */}
//       <div className="mb-8">
//         <Logo showTagline={true} />
//       </div>

//       {/* Login Form */}
//       <form onSubmit={handleSubmit} className="space-y-4 flex-1">
//         {/* Email Input */}
//         <div className="space-y-1.5">
//           <label
//             htmlFor="login-email"
//             className="text-xs font-semibold text-slate-700 block"
//           >
//             Email Address
//           </label>
//           <div className="relative">
//             <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
//               <Mail className="h-4.5 w-4.5" />
//             </span>
//             <input
//               id="login-email"
//               type="email"
//               placeholder="name@example.com"
//               value={email}
//               onChange={(e) => {
//                 setEmail(e.target.value);
//                 if (errors.email)
//                   setErrors((prev) => ({ ...prev, email: undefined }));
//               }}
//               className={`w-full pl-10.5 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium placeholder-slate-400 transition-all outline-none focus:bg-white ${
//                 errors.email
//                   ? "border-rose-300 focus:ring-4 focus:ring-rose-50"
//                   : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
//               }`}
//               disabled={isLoading}
//             />
//           </div>
//           {errors.email && (
//             <motion.p
//               initial={{ opacity: 0, y: -5 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-xs font-semibold text-rose-500"
//             >
//               {errors.email}
//             </motion.p>
//           )}
//         </div>

//         {/* Password Input */}
//         <div className="space-y-1.5">
//           <div className="flex items-center justify-between">
//             <label
//               htmlFor="login-password"
//               className="text-xs font-semibold text-slate-700"
//             >
//               Password
//             </label>
//             <button
//               id="forgot-password-link"
//               type="button"
//               onClick={onForgotPassword}
//               className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
//             >
//               Forgot Password?
//             </button>
//           </div>
//           <div className="relative">
//             <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
//               <Lock className="h-4.5 w-4.5" />
//             </span>
//             <input
//               id="login-password"
//               type={showPassword ? "text" : "password"}
//               placeholder="••••••••"
//               value={password}
//               onChange={(e) => {
//                 setPassword(e.target.value);
//                 if (errors.password)
//                   setErrors((prev) => ({ ...prev, password: undefined }));
//               }}
//               className={`w-full pl-10.5 pr-10.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium placeholder-slate-400 transition-all outline-none focus:bg-white ${
//                 errors.password
//                   ? "border-rose-300 focus:ring-4 focus:ring-rose-50"
//                   : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
//               }`}
//               disabled={isLoading}
//             />
//             <button
//               id="toggle-login-password"
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
//             >
//               {showPassword ? (
//                 <EyeOff className="h-4 w-4" />
//               ) : (
//                 <Eye className="h-4 w-4" />
//               )}
//             </button>
//           </div>
//           {errors.password && (
//             <motion.p
//               initial={{ opacity: 0, y: -5 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-xs font-semibold text-rose-500"
//             >
//               {errors.password}
//             </motion.p>
//           )}
//         </div>

//         {/* Submit button */}
//         <button
//           id="login-submit-btn"
//           type="submit"
//           disabled={isLoading}
//           className="w-full relative flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200 transition-all cursor-pointer disabled:opacity-80"
//         >
//           {isLoading ? (
//             <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//           ) : (
//             <>
//               Sign In
//               <ArrowRight className="h-4.5 w-4.5" />
//             </>
//           )}
//         </button>
//       </form>

//       {/* Divider */}
//       <div className="flex items-center gap-3 my-6">
//         <div className="flex-1 h-px bg-slate-100" />
//         <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
//           Or continue with
//         </span>
//         <div className="flex-1 h-px bg-slate-100" />
//       </div>

//       {/* Google OAuth Button */}
//       <button
//         id="login-google-btn"
//         onClick={() => {}}
//         disabled={isLoading}
//         className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-60"
//       >
//         <svg
//           className="h-5 w-5 shrink-0"
//           viewBox="0 0 24 24"
//           width="24"
//           height="24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <g transform="matrix(1, 0, 0, 1, 0, 0)">
//             <path
//               d="M21.35,11.1H12v2.7h5.38C16.88,16.03,14.73,17.1,12,17.1C9.18,17.1,6.8,15,6.1,12.35c-0.18-0.53-0.28-1.1-0.28-1.7s0.1-1.17,0.28-1.7C6.8,6.3,9.18,4.2,12,4.2c1.8,0,3.34,0.7,4.52,1.86l2.02-2.02C16.85,2.4,14.58,1.5,12,1.5C7.45,1.5,3.61,4.45,2.22,8.53c-0.29,0.85-0.45,1.77-0.45,2.72s0.16,1.87,0.45,2.72c1.39,4.08,5.23,7.03,9.78,7.03c2.9,0,5.65-1.07,7.6-2.93c2.05-1.95,2.83-4.75,2.54-7.25H21.35z"
//               fill="#4285F4"
//             />
//             <path
//               d="M2.22,8.53L5.47,11C6.27,8.6,8.5,7,11.1,7c1.4,0,2.6,0.5,3.5,1.3l2.6-2.6C15.6,4.3,13.5,3,11.1,3C7.5,3,4.4,5.3,2.22,8.53z"
//               fill="#EA4335"
//             />
//             <path
//               d="M11.1,21c2.4,0,4.5-1.3,5.6-3.4l-2.6-2.6C13.2,16.1,12,16.5,11.1,16.5c-2.6,0-4.8-1.6-5.6-4L2.22,15C4.4,18.2,7.5,21,11.1,21z"
//               fill="#34A853"
//             />
//             <path
//               d="M2.22,15l3.25-2.5C5.29,11.97,5.2,11.49,5.2,11c0-0.49,0.09-0.97,0.27-1.47L2.22,7C1.4,8.6,1,10.4,1,12.2C1,14,1.4,15.8,2.22,17.4V15z"
//               fill="#FBBC05"
//             />
//           </g>
//         </svg>
//         Continue with Google
//       </button>

//       {/* Sign up Link */}
//       <p className="text-center text-xs text-slate-500 font-medium mt-8">
//         Don't have an account?{" "}
//         <button
//           id="toggle-to-signup-btn"
//           type="button"
//           onClick={onToggleView}
//           className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-all cursor-pointer"
//         >
//           Create account
//         </button>
//       </p>
//     </motion.div>
//   );
// }
