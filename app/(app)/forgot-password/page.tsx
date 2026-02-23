'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, GraduationCap, Mail, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email) {
    toast.error("Please enter your email");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Something went wrong");
      setLoading(false);
      return;
    }

    setSent(true);
    toast.success("Reset link generated!");

    // Optional: open reset link automatically
    console.log("Reset link:", data.resetLink);

  } catch (error) {
    toast.error("Server error");
  }

  setLoading(false);
};

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="font-heading text-2xl">
            {sent ? 'Check Your Email' : 'Forgot Password'}
          </CardTitle>
          <CardDescription>
            {sent
              ? 'We have sent a password reset link to your email address.'
              : 'Enter your email address and we will send you a link to reset your password.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="flex flex-col items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <div className="rounded-lg border border-border bg-muted/50 p-4 text-center text-sm text-muted-foreground">
                <Mail className="mx-auto mb-2 h-5 w-5" />
                <p>
                  A reset link has been sent to <span className="font-medium text-foreground">{email}</span>
                </p>
                <p className="mt-1 text-xs italic">
                  (Demo: Click the link below to simulate resetting your password)
                </p>
              </div>
              <div className="flex w-full flex-col gap-2">
                <Link href={`/reset-password?token=demo-token-${Date.now()}&email=${encodeURIComponent(email)}`}>
                  <Button className="w-full">
                    Open Reset Password Page
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground"
                  onClick={() => {
                    setSent(false)
                    setEmail('')
                  }}
                >
                  Send to a different email
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="rounded-lg border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
                <p>
                  Enter the email address associated with your account. We will email you a link
                  to reset your password.
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
