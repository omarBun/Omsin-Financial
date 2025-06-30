"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, ArrowLeft, Send, CheckCircle } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  accountNumber: string
  balance: number
  accountType: string
}

export default function TransferPage() {
  const [user, setUser] = useState<User | null>(null)
  const [accounts, setAccounts] = useState<User[]>([])
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem("omsin_current_user")
    if (!currentUser) {
      router.push("/")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    // Load all accounts for recipient selection
    const allAccounts = JSON.parse(localStorage.getItem("omsin_accounts") || "[]")
    const otherAccounts = allAccounts.filter((acc: User) => acc.id !== userData.id)
    setAccounts(otherAccounts)
  }, [router])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    // Validation
    if (!amount || !recipient || !description) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    const transferAmount = Number.parseFloat(amount)
    if (isNaN(transferAmount) || transferAmount <= 0) {
      setError("Please enter a valid amount")
      setLoading(false)
      return
    }

    if (transferAmount > user!.balance) {
      setError("Insufficient funds")
      setLoading(false)
      return
    }

    if (transferAmount > 10000) {
      setError("Transfer limit exceeded. Maximum transfer amount is $10,000")
      setLoading(false)
      return
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
      // Update balances
      const allAccounts = JSON.parse(localStorage.getItem("omsin_accounts") || "[]")
      const updatedAccounts = allAccounts.map((acc: User) => {
        if (acc.id === user!.id) {
          return { ...acc, balance: acc.balance - transferAmount }
        }
        if (acc.accountNumber === recipient) {
          return { ...acc, balance: acc.balance + transferAmount }
        }
        return acc
      })

      localStorage.setItem("omsin_accounts", JSON.stringify(updatedAccounts))

      // Update current user
      const updatedUser = { ...user!, balance: user!.balance - transferAmount }
      localStorage.setItem("omsin_current_user", JSON.stringify(updatedUser))
      setUser(updatedUser)

      // Add transactions
      const transactions = JSON.parse(localStorage.getItem("omsin_transactions") || "[]")
      const now = new Date().toLocaleString()

      const recipientAccount = accounts.find((acc) => acc.accountNumber === recipient)

      // Debit transaction for sender
      transactions.push({
        id: `${user!.id}_${Date.now()}_debit`,
        type: "debit",
        amount: transferAmount,
        description: `Transfer to ${recipientAccount?.name || "Unknown"}`,
        date: now,
        balance: updatedUser.balance,
      })

      // Credit transaction for recipient
      transactions.push({
        id: `${recipientAccount?.id}_${Date.now()}_credit`,
        type: "credit",
        amount: transferAmount,
        description: `Transfer from ${user!.name}`,
        date: now,
        balance: (recipientAccount?.balance || 0) + transferAmount,
      })

      localStorage.setItem("omsin_transactions", JSON.stringify(transactions))

      setSuccess(`Successfully transferred ${formatCurrency(transferAmount)} to ${recipientAccount?.name}`)
      setAmount("")
      setRecipient("")
      setDescription("")
    } catch (err) {
      setError("Transfer failed. Please try again.")
    }

    setLoading(false)
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
            <span className="text-gray-600">Transfer Money</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Transfer Money</h1>
            <p className="text-gray-600">Send money to another Omsin Financial account</p>
          </div>

          {/* Account Balance Card */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Available Balance</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(user.balance)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Account</p>
                  <p className="font-mono">{user.accountNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transfer Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="h-5 w-5 mr-2" />
                Transfer Details
              </CardTitle>
              <CardDescription>Enter the transfer information below</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTransfer} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Account</Label>
                  <Select value={recipient} onValueChange={setRecipient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.accountNumber}>
                          {account.name} - {account.accountNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      max="10000"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Maximum transfer limit: $10,000</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="What's this transfer for?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={100}
                  />
                </div>

                {/* Transfer Summary */}
                {amount && recipient && (
                  <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                    <h4 className="font-semibold text-blue-900">Transfer Summary</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Transfer Amount:</span>
                        <span className="font-semibold">{formatCurrency(Number.parseFloat(amount) || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Remaining Balance:</span>
                        <span className="font-semibold">
                          {formatCurrency(user.balance - (Number.parseFloat(amount) || 0))}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading || !amount || !recipient || !description}
                >
                  {loading ? "Processing Transfer..." : "Transfer Money"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
