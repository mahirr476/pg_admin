
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo and Title Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <Image
              src="/plogoTop.jpg"
              alt="Logo"
              width={60}
              height={60}
              className="rounded-xl shadow-lg"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4"
          >
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Please sign in to your account</p>
          </motion.div>
        </div>

        <Card className="shadow-xl border-t-4 border-t-blue-500">
          <CardHeader>
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-4">
                {/* Email Input */}
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="remember" className="text-gray-600">
                    Remember me
                  </label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error Alert */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {/* Submit Button */}
              <Button
                className="w-full"
                type="submit"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center space-x-2"
                  >
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </motion.div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Security Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-gray-500 text-xs mt-8"
        >
          Protected by reCAPTCHA and subject to the{" "}
          <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="text-blue-600 hover:text-blue-500">
            Terms of Service
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}