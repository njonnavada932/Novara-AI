import { motion } from "framer-motion";
import { X, ShieldAlert, Sparkles } from "lucide-react";

interface GoogleAccount {
  name: string;
  email: string;
  avatar: string;
}

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: GoogleAccount) => void;
}

const MOCK_ACCOUNTS: GoogleAccount[] = [
  {
    name: "Neelima Jonnavada",
    email: "neelimajonnavada@gmail.com",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Alex Rivera",
    email: "alex.rivera@gmail.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Devon Chen",
    email: "devon.chen@novara.ai",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
  },
];

export default function GoogleSignInModal({
  isOpen,
  onClose,
  onSelectAccount,
}: GoogleSignInModalProps) {
  if (!isOpen) return null;

  return (
    <div
      id="google-auth-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm"
    >
      <motion.div
        id="google-auth-card"
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 15 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col"
      >
        {/* Header */}
        <div
          id="google-auth-header"
          className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50"
        >
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5"
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
            <span className="text-sm font-semibold text-slate-800">
              Sign in with Google
            </span>
          </div>
          <button
            id="google-auth-close-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1">
          <div className="text-center mb-6">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
              Authorization Request
            </p>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Connect with Novara AI
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              To continue, Google will share your name, email address, and
              profile picture with Novara AI.
            </p>
          </div>

          <div
            id="accounts-list"
            className="space-y-2 max-h-60 overflow-y-auto pr-1"
          >
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
              Choose an account
            </p>
            {MOCK_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                id={`google-account-${account.email.replace(/[@.]/g, "-")}`}
                onClick={() => onSelectAccount(account)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/40 text-left transition-all group"
              >
                <img
                  src={account.avatar}
                  alt={account.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-indigo-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-950">
                    {account.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {account.email}
                  </p>
                </div>
                <div className="h-6 w-6 rounded-full border border-slate-200 group-hover:border-indigo-500 flex items-center justify-center bg-white transition-all">
                  <div className="h-3.5 w-3.5 rounded-full bg-indigo-600 scale-0 group-hover:scale-100 transition-all" />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 p-3 bg-violet-50/50 border border-violet-100 rounded-xl flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Secure Sign-In:</strong> Novara AI uses encrypted protocol
              standards. We never store or access your Google account password.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Google Developer Console v4.2</span>
          <a href="#" className="hover:underline hover:text-slate-600">
            Privacy Policy
          </a>
        </div>
      </motion.div>
    </div>
  );
}
