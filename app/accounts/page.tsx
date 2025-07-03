"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation" 
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, ArrowLeft, CreditCard, Eye, EyeOff, TrendingUp, TrendingDown } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  accountNumber: string
  balance: number
  accountType: string
}

interface Transaction {
  id: string
  type: "credit" | "debit"
  amount: number
  description: string
  date: string
  balance: number
}

export default function AccountsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [showBalance, setShowBalance] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem("omsin_current_user")
    if (!currentUser) {
      router.push("/")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    // Load user transactions
    const allTransactions = JSON.parse(localStorage.getItem("omsin_transactions") || "[]")
    const userTransactions = allTransactions
      .filter((t: Transaction) => t.id.startsWith(userData.id))
      .sort((a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime())
    setTransactions(userTransactions)
  }, [router])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getAccountTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "savings":
        return "bg-green-100 text-green-800"
      case "checking":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateMonthlyChange = () => {
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

    const thisMonthTransactions = transactions.filter((t) => new Date(t.date) >= lastMonth)

    const totalChange = thisMonthTransactions.reduce((sum, t) => sum + (t.type === "credit" ? t.amount : -t.amount), 0)

    return totalChange
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const monthlyChange = calculateMonthlyChange()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">Omsin Financial</span>
              </div>
            </div>
            <span className="text-gray-600">Account Overview</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Overview</h1>
            <p className="text-gray-600">Manage and view your account details</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Account Card */}
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <CreditCard className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle>{user.accountType} Account</CardTitle>
                        <CardDescription>Account Number: {user.accountNumber}</CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setShowBalance(!showBalance)}>
                      {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                      <p className="text-3xl font-bold text-green-600">
                        {showBalance ? formatCurrency(user.balance) : "••••••"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-sm text-gray-600">Account Holder</p>
                        <p className="font-semibold">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Account Type</p>
                        <Badge className={getAccountTypeColor(user.accountType)}>{user.accountType}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Activity</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => router.push("/transactions")}>
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No transactions yet</p>
                  ) : (
                    <div className="space-y-3">
                      {transactions.slice(0, 5).map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`p-2 rounded-full ${
                                transaction.type === "credit" ? "bg-green-100" : "bg-red-100"
                              }`}
                            >
                              {transaction.type === "credit" ? (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-sm text-gray-500">{transaction.date}</p>
                            </div>
                          </div>
                          <div
                            className={`font-semibold ${
                              transaction.type === "credit" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {transaction.type === "credit" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Net Change</p>
                      <p className={`text-xl font-bold ${monthlyChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {monthlyChange >= 0 ? "+" : ""}
                        {formatCurrency(monthlyChange)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Transactions</p>
                      <p className="text-xl font-bold">{transactions.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                    onClick={() => router.push("/transfer")}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Transfer Money
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => router.push("/transactions")}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Transactions
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => router.push("/profile")}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Account Security */}
              <Card>
                <CardHeader>
                  <CardTitle>Security Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Two-Factor Auth</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Account Status</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Login</span>
                      <span className="text-sm text-gray-600">Today</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
