"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { VerifyOtpModal } from "@/components/VerifyOtpModal";

export default function SignUpPage() {
  const { isAuthenticated, register, isEmailVerified } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerifyOtpModal, setShowVerifyOtpModal] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && isEmailVerified) {
      router.push("/dashboard-new");
    }
  }, [isAuthenticated, isEmailVerified, router]);

  // Show loading while checking authentication state
  if (isAuthenticated && isEmailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1E293B] overflow-hidden">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full mx-auto animate-spin" />
          <p className="text-white text-lg font-medium">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await register(email, password, firstName, lastName);
      setShowVerifyOtpModal(true); // Show OTP modal after registration
    } catch (err: unknown) {
      console.error("Sign-up error:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to create account. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: "google" | "apple") => {
    setIsLoading(true);
    setError("");

    try {
      console.log(`🔄 Starting ${provider} registration...`);

      // Redirect to backend OAuth endpoint
      const oauthUrl = `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      }/api/auth/${provider}`;
      window.location.href = oauthUrl;

      console.log(`✅ ${provider} redirect initiated`);
    } catch (err: unknown) {
      console.error(`❌ ${provider} sign-up error:`, err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : `Failed to sign up with ${provider}.`;
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 lg:pt-0 bg-[#1E293B]">
      {/* Magical Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-blue-900/30"></div>

        {/* Floating magical elements */}
        <div className="absolute top-20 left-10 w-8 h-8 opacity-60 text-purple-400 animate-bounce">
          ✨
        </div>

        <div className="absolute top-40 right-20 w-6 h-6 opacity-50 text-pink-400 animate-pulse">
          ⭐
        </div>

        <div className="absolute bottom-32 left-20 w-10 h-10 opacity-40 text-cyan-400 animate-pulse">
          💜
        </div>

        {/* Additional sparkles */}
        <div className="absolute top-1/3 left-1/3 text-2xl animate-pulse opacity-60">
          ✨
        </div>
        <div className="absolute bottom-1/3 right-1/3 text-xl animate-bounce opacity-50">
          🌟
        </div>
      </div>

      {/* Auth Content Container */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center space-y-6 mb-8">
            <div className="text-4xl font-bold text-white">Join the Magic</div>
            <div className="text-xl text-white opacity-90">
              Start your magical storytelling adventure
            </div>
          </div>

          <div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden">
              <div className="p-8 space-y-6">
                {error && (
                  <div
                    className="border-red-200/20 bg-red-500/10 backdrop-blur-sm rounded-2xl p-4"
                    role="alert"
                  >
                    <div className="text-red-400 font-medium">{error}</div>
                  </div>
                )}

                {/* Sign Up Form */}
                <div className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="firstName"
                          className="text-white font-semibold text-base"
                        >
                          First Name
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          placeholder="Enter your first name"
                          value={firstName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFirstName(e.target.value)
                          }
                          className="h-14 w-full bg-white/10 border-2 border-white/20 focus:border-purple-400 rounded-2xl text-white placeholder:text-white/60 backdrop-blur-sm transition-all duration-200 outline-none px-4"
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="lastName"
                          className="text-white font-semibold text-base"
                        >
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          placeholder="Enter your last name"
                          value={lastName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setLastName(e.target.value)
                          }
                          className="h-14 w-full bg-white/10 border-2 border-white/20 focus:border-purple-400 rounded-2xl text-white placeholder:text-white/60 backdrop-blur-sm transition-all duration-200 outline-none px-4"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-white font-semibold text-base"
                      >
                        Email
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-4 text-purple-400">
                          <Mail />
                        </span>
                        <input
                          id="email"
                          type="email"
                          placeholder="Enter your magical email"
                          value={email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEmail(e.target.value)
                          }
                          className="pl-12 h-14 w-full bg-white/10 border-2 border-white/20 focus:border-purple-400 rounded-2xl text-white placeholder:text-white/60 backdrop-blur-sm transition-all duration-200 outline-none px-4"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="password"
                        className="text-white font-semibold text-base"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-4 text-purple-400">
                          <Lock />
                        </span>
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create your secret spell"
                          value={password}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setPassword(e.target.value)
                          }
                          className="pl-12 pr-12 h-14 w-full bg-white/10 border-2 border-white/20 focus:border-purple-400 rounded-2xl text-white placeholder:text-white/60 backdrop-blur-sm transition-all duration-200 outline-none px-4"
                          required
                          disabled={isLoading}
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-4 text-white/60 hover:text-white transition-colors"
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </div>

                    <div className="w-full">
                      <button
                        type="submit"
                        className="w-full h-14 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                        disabled={isLoading}
                      >
                        {isLoading
                          ? "Creating your account..."
                          : "Create Account"}
                        {!isLoading && <span>→</span>}
                      </button>
                    </div>
                  </form>

                  <div className="flex items-center gap-4">
                    <span className="flex-grow border-t border-white/20" />
                    <span className="text-sm text-white/70 font-medium whitespace-nowrap">
                      Or continue with
                    </span>
                    <span className="flex-grow border-t border-white/20" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="w-full">
                      <button
                        type="button"
                        onClick={() => handleOAuthSignUp("google")}
                        disabled={isLoading}
                        className="w-full h-12 border-2 border-white/20 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-sm transition-all duration-200 flex items-center justify-center disabled:opacity-50"
                      >
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Google
                      </button>
                    </div>
                    <div className="w-full">
                      <button
                        type="button"
                        onClick={() => handleOAuthSignUp("apple")}
                        disabled={isLoading}
                        className="w-full h-12 border-2 border-white/20 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-sm transition-all duration-200 flex items-center justify-center disabled:opacity-50"
                      >
                        <svg
                          className="mr-2 h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                        </svg>
                        Apple
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <p className="text-white/70">
                    Already have an account?{" "}
                    <Link
                      href="/sign-in"
                      className="text-white hover:text-purple-400 font-semibold transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showVerifyOtpModal && (
        <VerifyOtpModal
          email={email}
          onSuccess={() => {
            setShowVerifyOtpModal(false);
            router.push("/dashboard-new");
          }}
        />
      )}
    </section>
  );
}
