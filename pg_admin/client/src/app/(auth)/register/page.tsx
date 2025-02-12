"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, User, Building } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    // Add your registration logic here

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push("/dashboard");
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
        className="w-full max-w-lg"
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
            <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600 mt-2">Join us! Please fill in your information</p>
          </motion.div>
        </div>

        <Card className="shadow-xl border-t-4 border-t-blue-500">
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Fill out the form below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    name="firstName"
                    placeholder="First Name"
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    name="lastName"
                    placeholder="Last Name"
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Company Information */}
              <div className="relative">
                <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  name="company"
                  placeholder="Company Name (Optional)"
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create Password"
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

              {/* Confirm Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </Link>
                </label>
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
                    <span>Creating account...</span>
                  </motion.div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign in
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
          By registering, you agree to our{" "}
          <Link href="/terms" className="text-blue-600 hover:text-blue-500">
            Terms of Service
          </Link>{" "}
          and acknowledge our{" "}
          <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
            Privacy Policy
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}