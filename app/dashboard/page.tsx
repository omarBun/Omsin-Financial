"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  CreditCard,
  PiggyBank,
  TrendingUp,
  LogOut,
} from "lucide-react"

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

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [showBalance, setShowBalance] = useState(true)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem("omsin_current_user")
    if (!currentUser) {
      router.push("/")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    // Load recent transactions
    const transactions = JSON.parse(localStorage.getItem("omsin_transactions") || "[]")
    const userTransactions = transactions.filter((t: Transaction) => t.id.startsWith(userData.id)).slice(0, 5)
    setRecentTransactions(userTransactions)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("omsin_current_user")
    router.push("/")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Omsin Financial</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user.name}</span>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              className="h-20 flex-col space-y-2 bg-blue-600 hover:bg-blue-700"
              onClick={() => router.push("/transfer")}
            >
              <ArrowUpRight className="h-6 w-6" />
              <span>Transfer</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 bg-transparent"
              onClick={() => router.push("/accounts")}
            >
              <CreditCard className="h-6 w-6" />
              <span>Accounts</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 bg-transparent"
              onClick={() => router.push("/transactions")}
            >
              <TrendingUp className="h-6 w-6" />
              <span>History</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 bg-transparent"
              onClick={() => router.push("/profile")}
            >
              <PiggyBank className="h-6 w-6" />
              <span>Profile</span>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Account Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Account Balance</CardTitle>
                    <CardDescription>
                      {user.accountType} Account • {user.accountNumber}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowBalance(!showBalance)}>
                    {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {showBalance ? formatCurrency(user.balance) : "••••••"}
                </div>
                <p className="text-sm text-gray-600 mt-2">Available Balance</p>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Transactions</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => router.push("/transactions")}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentTransactions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No recent transactions</p>
                ) : (
                  <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-2 rounded-full ${
                              transaction.type === "credit" ? "bg-green-100" : "bg-red-100"
                            }`}
                          >
                            {transaction.type === "credit" ? (
                              <ArrowDownLeft className="h-4 w-4 text-green-600" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4 text-red-600" />
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
            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Type</span>
                  <Badge variant="secondary">{user.accountType}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Number</span>
                  <span className="font-mono">{user.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/transfer")}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Transfer
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/accounts")}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  View Accounts
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/profile")}>
                  <PiggyBank className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
