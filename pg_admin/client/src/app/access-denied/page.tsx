"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Shield, AlertTriangle } from "lucide-react"

export default function AccessDeniedPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-xl max-w-md w-full p-6 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Shield className="w-20 h-20 text-red-100 stroke-1" />
            <AlertTriangle className="w-10 h-10 text-red-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
        
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={() => router.push('/admin/dashboard')}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            Return to Dashboard
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => router.back()}
            className="w-full border-gray-300"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}