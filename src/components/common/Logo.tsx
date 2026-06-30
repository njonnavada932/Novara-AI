import { motion } from "framer-motion";
import { Sparkles, CheckSquare } from "lucide-react";

interface LogoProps {
  showTagline?: boolean;
}

export default function Logo({ showTagline = true }: LogoProps) {
  return (
    <div id="Novara brand" className="flex flex-col items-center text-center">
      <motion.div
        id="logo-container"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
        className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 shadow-xl shadow-indigo-200/50 mb-4"
      >
        <CheckSquare
          id="logo-icon-bg"
          className="w-8 h-8 text-white absolute"
        />
        <motion.div
          id="logo-icon-sparkle"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
          }}
          className="absolute -top-1 -right-1 bg-violet-600 text-white rounded-full p-1 shadow-md border-2 border-white"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </motion.div>
      </motion.div>

      <motion.h1
        id="logo-heading"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="font-display text-2xl font-bold tracking-tight text-slate-950 flex items-center gap-1.5"
      >
        Novara{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 font-extrabold">
          AI
        </span>
      </motion.h1>

      {showTagline && (
        <motion.p
          id="logo-tagline"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-sm font-medium text-slate-500 mt-1 max-w-xs leading-relaxed"
        >
          Your AI Life Responsibility Companion
        </motion.p>
      )}
    </div>
  );
}
