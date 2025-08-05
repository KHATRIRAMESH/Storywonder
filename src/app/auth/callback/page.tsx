"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/lib/apiService";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const { refreshUser } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const success = searchParams.get("success");
      const error = searchParams.get("error");

      if (error) {
        console.error("OAuth error:", error);
        router.push(`/sign-in?error=${error}`);
        return;
      }

      if (success === "true") {
        try {
          // Verify authentication status with your Passport backend using apiService
          const verificationResult = await apiService.verifyAuth();
          console.log("Backend verification result:", verificationResult);

          if (verificationResult.authenticated && verificationResult.user) {
            // Refresh the user context with the authenticated user
            await refreshUser();
            
            // Redirect to the dashboard
            router.push("/dashboard");
            return;
          }

          // If verification failed, redirect to sign-in
          console.error("Authentication verification failed");
          router.push("/sign-in?error=verification_failed");
          
        } catch (err) {
          console.error("Auth callback error:", err);
          router.push("/sign-in?error=callback_failed");
        }
      } else {
        // No success parameter or success is false
        router.push("/sign-in?error=authentication_failed");
      }

      setLoading(false);
    };

    handleOAuthCallback();
  }, [searchParams, router, refreshUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing authentication...</p>
        </div>
      </div>
    );
  }

  return null;
}
