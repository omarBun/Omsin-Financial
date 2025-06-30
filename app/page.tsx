"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Building2, Shield, Users, CreditCard } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Initialize demo accounts if they don't exist
    const accounts = localStorage.getItem("omsin_accounts")
    if (!accounts) {
      const demoAccounts = [
        {
          id: "1",
          email: "demo@omsin.com",
          password: "demo123",
          name: "Omar Sima",
          accountNumber: "1234567890",
          balance: 15750.5,
          accountType: "Savings",
        },
        {
          id: "2",
          email: "jane@omsin.com",
          password: "fatou123",
          name: "Fatou Kah",
          accountNumber: "0987654321",
          balance: 8920.75,
          accountType: "Checking",
        },
        {
          id: "3",
          email: "cheikh@omsin.com",
          password: "cheikh123",
          name: "Cheikh Peters",
          accountNumber: "0747954315",
          balance: 2000.25,
          accountType: "Checking",
        },
      ]
      localStorage.setItem("omsin_accounts", JSON.stringify(demoAccounts))
    }

    // Check if user is already logged in
    const currentUser = localStorage.getItem("omsin_current_user")
    if (currentUser) {
      router.push("/dashboard")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Input validation
    if (!email || !password) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      setLoading(false)
      return
    }

    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      const accounts = JSON.parse(localStorage.getItem("omsin_accounts") || "[]")
      const user = accounts.find((acc: any) => acc.email === email && acc.password === password)

      if (user) {
        localStorage.setItem("omsin_current_user", JSON.stringify(user))
        router.push("/dashboard")
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Omsin Financial</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Features
              </a>
              <a href="#security" className="text-gray-600 hover:text-blue-600 transition-colors">
                Security
              </a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Welcome content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Welcome to Omsin Financial</h1>
              <p className="text-xl text-gray-600 mb-8">
                Your trusted partner for secure and convenient online banking. Experience banking reimagined.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Bank-Grade Security</h3>
                  <p className="text-gray-600 text-sm">256-bit encryption and multi-factor authentication</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CreditCard className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Instant Transfers</h3>
                  <p className="text-gray-600 text-sm">Send money instantly to any account</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">24/7 Support</h3>
                  <p className="text-gray-600 text-sm">Round-the-clock customer assistance</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Building2 className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Multiple Accounts</h3>
                  <p className="text-gray-600 text-sm">Manage all your accounts in one place</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Demo Credentials:</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>
                  <strong>Email:</strong> demo@omsin.com
                </p>
                <p>
                  <strong>Password:</strong> demo123
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Sign In</CardTitle>
                <CardDescription>Access your Omsin Financial account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    Forgot your password?
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
