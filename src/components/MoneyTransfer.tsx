import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ArrowRight, User, CheckCircle } from 'lucide-react'

// Simulated exchange rate (1 USD = 4000 COP)
const EXCHANGE_RATE = 4000

export default function MoneyTransfer() {
  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState('')
  const [convertedAmount, setConvertedAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (amount) {
      const converted = (parseFloat(amount) * EXCHANGE_RATE).toLocaleString()
      setConvertedAmount(converted)
    } else {
      setConvertedAmount('')
    }
  }, [amount])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    setStep(3)
  }

  const renderStep1 = () => (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount" className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2" />
            Amount in USD
          </Label>
          <Input
            id="amount"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            min="0"
            step="0.01"
            required
          />
        </div>
        {convertedAmount && (
          <div className="p-3 bg-green-50 rounded-md">
            <p className="text-green-700">
              🇨🇴 Recipient will get: {convertedAmount} COP
            </p>
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="recipient" className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            Recipient's Name
          </Label>
          <Input
            id="recipient"
            placeholder="Enter recipient's name"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full">Continue <ArrowRight className="w-4 h-4 ml-2" /></Button>
      </CardFooter>
    </form>
  )

  const renderStep2 = () => (
    <>
      <CardContent className="space-y-4">
        <p className="text-lg font-medium">Confirm Your Transfer 🔍</p>
        <p>Sending: ${amount} USD 🇺🇸</p>
        <p>Recipient will receive: {convertedAmount} COP 🇨🇴</p>
        <p>To: {recipient} 👤</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleConfirm} disabled={isLoading} className="w-full">
          {isLoading ? 'Processing... ⏳' : 'Confirm Transfer ✅'}
        </Button>
      </CardFooter>
    </>
  )

  const renderStep3 = () => (
    <CardContent className="space-y-4">
      <p className="text-lg font-medium text-green-600 flex items-center">
        <CheckCircle className="w-5 h-5 mr-2" />
        Transfer Successful! 🎉
      </p>
      <p>You've sent ${amount} USD 🇺🇸 to {recipient}.</p>
      <p>They will receive {convertedAmount} COP 🇨🇴.</p>
    </CardContent>
  )

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Send Money to Colombia 💸</CardTitle>
        <CardDescription>Fast and secure P2P transfers 🚀</CardDescription>
      </CardHeader>
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </Card>
  )
}
