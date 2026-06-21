import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { z } from "zod";
import { Mail, ArrowLeft, Send } from "lucide-react";
import toast from "react-hot-toast";
import { authApi } from "../../api/auth.api";
import Button from "../../components/common/Button";

const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const yParallax = useSpring(useTransform(scrollYProgress, [0, 1], [0, 80]), {
    stiffness: 100,
    damping: 30,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      console.log("📧 Sending forgot password request for:", data.email);

      const response = await authApi.forgotPassword(data.email);
      console.log("✅ Forgot password response:", response);

      setIsSubmitted(true);
      toast.success("Reset link sent to your email!");
    } catch (error) {
      console.error("❌ Forgot password error:", error);

      // ✅ Better error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        const message = error.response.data?.message || "Something went wrong";
        toast.error(message);

        // If user not found, show specific message
        if (error.response.status === 404) {
          toast.error("No user found with this email address");
        }
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request
        toast.error(error.message || "Failed to send reset link");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDFAF5] to-[#FFFDF7] dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200/40 p-8 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
            <Send className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Check Your Email
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            We've sent a password reset link to your email address.
          </p>
          <Link
            to="/login"
            className="inline-block mt-6 text-amber-600 hover:text-amber-700 font-medium"
          >
            ← Back to Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFAF5] to-[#FFFDF7] dark:from-gray-950 dark:to-gray-900 overflow-x-hidden">
      <section
        ref={heroRef}
        className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-20"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFFDF7] via-[#FDF3E0] to-[#FEF5E8] dark:from-gray-950 dark:via-[#1F132E] dark:to-gray-950" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-amber-300/30 blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-amber-400/20 blur-3xl animate-pulse" />
        </div>

        <motion.div
          style={{ y: yParallax }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.7 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-amber-400/50 shadow-lg mb-4"
          >
            <span className="text-3xl text-amber-700 dark:text-amber-400">
              ॐ
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
          >
            Forgot Password?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 dark:text-gray-300 text-base max-w-md mx-auto mt-2"
          >
            Enter your email and we'll send you a reset link
          </motion.p>
        </motion.div>
        <motion.div
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-4 h-6 rounded-full border border-amber-400 flex justify-center">
            <div className="w-0.5 h-1.5 bg-amber-400 rounded-full mt-1.5" />
          </div>
        </motion.div>
      </section>

      <div className="flex justify-center px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200/40 p-6 md:p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-400" />
                <input
                  type="email"
                  {...register("email")}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-lg transition-all hover:-translate-y-0.5"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-amber-600 hover:text-amber-700 font-medium inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
