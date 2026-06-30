import { useState, FormEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import toast from "react-hot-toast";

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const validateEmail = (val: string) => {
    if (!val) return "Email address is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) return "Please enter a valid email address";
    return "";
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (error) setError(validateEmail(val));
  };

  const startResendCountdown = () => {
    setCountdown(30);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendReset = async (emailVal: string) => {
    await sendPasswordResetEmail(auth, emailVal);
    console.log("Reset email sent successfully to:", emailVal);
    toast.success("Reset email sent successfully to:" + emailVal);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await sendReset(email);
      setIsSuccess(true);
      startResendCountdown();
    } catch (err: any) {
      switch (err.code) {
        case "auth/user-not-found":
          setError("No account found with this email address.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later.");
          break;
        default:
          setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setIsLoading(true);
    try {
      await sendReset(email);
      startResendCountdown();
    } catch {
      // silently fail on resend
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/60 p-6 sm:p-8 flex flex-col"
      >
        {/* Back to login */}
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-600 transition-colors mb-6 w-fit"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to login
        </button>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="forgot-form"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                  <Mail className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Forgot password?
                </h2>
                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                  Enter the email address linked to your Novara AI account and
                  we'll send you a reset link.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="recovery-email"
                    className="text-xs font-semibold text-slate-700 block"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      id="recovery-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={handleEmailChange}
                      disabled={isLoading}
                      className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium placeholder-slate-400 transition-all outline-none focus:bg-white ${
                        error
                          ? "border-rose-300 focus:ring-4 focus:ring-rose-50"
                          : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                      }`}
                    />
                  </div>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-semibold text-rose-500"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200 transition-all cursor-pointer disabled:opacity-80"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Send reset link
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="forgot-success"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Check your inbox
              </h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-sm mx-auto">
                We sent a reset link to{" "}
                <span className="font-semibold text-slate-800">{email}</span>.
                Click the link in the email to set a new password.
              </p>

              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-3">
                <p className="text-xs text-slate-400">
                  Didn't receive it? Check your spam folder or resend.
                </p>
                <button
                  onClick={handleResend}
                  disabled={countdown > 0 || isLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-indigo-100 hover:border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-default"
                >
                  <RefreshCw
                    className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`}
                  />
                  {countdown > 0 ? `Resend in ${countdown}s` : "Resend email"}
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="mt-2 text-xs font-semibold text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  Return to login
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// import { useState, FormEvent, ChangeEvent } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { X, Mail, ArrowRight, CheckCircle2, RefreshCw } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// // interface ForgotPasswordModalProps {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   onSubmitSuccess: (email: string) => void;
// // }

// export default function ForgetPassword() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [countdown, setCountdown] = useState(0);

//   if (!isOpen) return null;

//   const validateEmail = (val: string) => {
//     if (!val) {
//       return "Email address is required";
//     }
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(val)) {
//       return "Please enter a valid email address";
//     }
//     return "";
//   };

//   const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const val = e.target.value;
//     setEmail(val);
//     if (error) {
//       setError(validateEmail(val));
//     }
//   };

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();
//     const validationError = validateEmail(email);
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     setIsLoading(true);
//     setError("");

//     // Simulate sending email
//     setTimeout(() => {
//       setIsLoading(false);
//       setIsSuccess(true);
//       onSubmitSuccess(email);
//       startResendCountdown();
//     }, 1500);
//   };

//   const startResendCountdown = () => {
//     setCountdown(30);
//     const interval = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   };

//   const handleResend = () => {
//     if (countdown > 0) return;
//     setIsLoading(true);
//     setTimeout(() => {
//       setIsLoading(false);
//       startResendCountdown();
//     }, 1000);
//   };

//   return (
//     <div
//       id="forgot-password-overlay"
//       className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
//     >
//       <motion.div
//         id="forgot-password-card"
//         initial={{ scale: 0.95, opacity: 0, y: 10 }}
//         animate={{ scale: 1, opacity: 1, y: 0 }}
//         exit={{ scale: 0.95, opacity: 0, y: 10 }}
//         className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 p-6 relative"
//       >
//         <button
//           id="forgot-password-close"
//           onClick={onClose}
//           className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-50"
//         >
//           <X className="h-5 w-5" />
//         </button>

//         <AnimatePresence mode="wait">
//           {!isSuccess ? (
//             <motion.div
//               key="forgot-form"
//               initial={{ opacity: 0, x: -10 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: 10 }}
//               transition={{ duration: 0.2 }}
//             >
//               <div className="mb-6">
//                 <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
//                   <Mail className="h-6 w-6" />
//                 </div>
//                 <h3 className="text-xl font-bold text-slate-950 font-display">
//                   Reset password
//                 </h3>
//                 <p className="text-sm text-slate-500 mt-1.5">
//                   Enter the email address associated with your Novara AI
//                   account, and we'll send you a recovery link.
//                 </p>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="space-y-1.5">
//                   <label
//                     htmlFor="recovery-email"
//                     className="text-xs font-semibold text-slate-700"
//                   >
//                     Email Address
//                   </label>
//                   <div className="relative">
//                     <input
//                       id="recovery-email"
//                       type="email"
//                       placeholder="you@example.com"
//                       value={email}
//                       onChange={handleEmailChange}
//                       disabled={isLoading}
//                       className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium placeholder-slate-400 transition-all outline-none focus:bg-white ${
//                         error
//                           ? "border-rose-300 focus:ring-4 focus:ring-rose-50"
//                           : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
//                       }`}
//                     />
//                   </div>
//                   {error && (
//                     <motion.p
//                       initial={{ opacity: 0, y: -5 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       className="text-xs font-medium text-rose-500"
//                     >
//                       {error}
//                     </motion.p>
//                   )}
//                 </div>

//                 <button
//                   id="send-recovery-btn"
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-sm font-semibold shadow-md shadow-slate-950/10 hover:shadow-lg hover:shadow-slate-950/15 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
//                 >
//                   {isLoading ? (
//                     <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   ) : (
//                     <>
//                       Send recovery link
//                       <ArrowRight className="w-4 h-4" />
//                     </>
//                   )}
//                 </button>
//               </form>
//             </motion.div>
//           ) : (
//             <motion.div
//               key="forgot-success"
//               initial={{ opacity: 0, x: -10 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: 10 }}
//               transition={{ duration: 0.2 }}
//               className="text-center py-4"
//             >
//               <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-5">
//                 <CheckCircle2 className="h-10 w-10" />
//               </div>
//               <h3 className="text-xl font-bold text-slate-950 font-display">
//                 Check your inbox
//               </h3>
//               <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
//                 We have sent an authentication link to{" "}
//                 <strong className="text-slate-800">{email}</strong>. Click the
//                 link inside the email to safely reset your password.
//               </p>

//               <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-3">
//                 <p className="text-xs text-slate-400">
//                   Didn't receive the email? Check spam or retry.
//                 </p>
//                 <button
//                   id="resend-recovery-btn"
//                   onClick={handleResend}
//                   disabled={countdown > 0 || isLoading}
//                   className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-100 hover:border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-default"
//                 >
//                   <RefreshCw
//                     className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`}
//                   />
//                   {countdown > 0 ? `Resend in ${countdown}s` : "Resend email"}
//                 </button>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>
//     </div>
//   );
// }
