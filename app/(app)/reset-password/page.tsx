'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, CheckCircle2, Eye, EyeOff, GraduationCap, KeyRound, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const urlToken = searchParams.get('token') || ''
  const emailParam = searchParams.get('email') || ''
  const [token, setToken] = useState(urlToken)
  const [showTokenInput, setShowTokenInput] = useState(!urlToken)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { resetPassword } = useAuth()
  const router = useRouter()

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  }

  const isPasswordValid = Object.values(passwordChecks).every(Boolean)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isPasswordValid) {
      toast.error('Password does not meet the requirements')
      return
    }

    if (!passwordsMatch) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    const result = await resetPassword(token, password)
    if (result) {
      setSuccess(true)
      toast.success('Password reset successfully!')
    } else {
      toast.error('Failed to reset password. Please try again.')
    }
    setLoading(false)
  }

  // If no token in URL, allow user to paste token manually
  // Do not show an 'Invalid Reset Link' page here; show the form and let API validate the token

  if (success) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-5 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-foreground">Password Reset Complete</h2>
            <p className="text-sm text-muted-foreground">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
            <Button className="w-full" onClick={() => router.push('/login')}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="font-heading text-2xl">Reset Your Password</CardTitle>
          <CardDescription>
            {emailParam
              ? `Create a new password for ${emailParam}`
              : 'Create a new password for your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Token input: use URL token if present, otherwise allow manual paste */}
            {showTokenInput && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="token">Reset Token</Label>
                <Input
                  id="token"
                  placeholder="Paste your reset token here"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">If you received a token from the forgot-password flow, paste it here. Otherwise open the reset link that was returned.</p>
              </div>
            )}

            {!showTokenInput && (
              <div className="text-sm text-muted-foreground">Using token from link.</div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {/* Password strength indicators */}
            {password.length > 0 && (
              <div className="rounded-lg border border-border bg-muted/50 p-3">
                <p className="mb-2 text-xs font-medium text-foreground">Password Requirements:</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <PasswordCheck label="8+ characters" passed={passwordChecks.length} />
                  <PasswordCheck label="Uppercase letter" passed={passwordChecks.uppercase} />
                  <PasswordCheck label="Lowercase letter" passed={passwordChecks.lowercase} />
                  <PasswordCheck label="Number" passed={passwordChecks.number} />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-xs text-destructive">Passwords do not match</p>
              )}
              {passwordsMatch && (
                <p className="flex items-center gap-1 text-xs text-primary">
                  <CheckCircle2 className="h-3 w-3" />
                  Passwords match
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !isPasswordValid || !passwordsMatch}
            >
              <KeyRound className="mr-2 h-4 w-4" />
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </form>

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

function PasswordCheck({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs ${passed ? 'text-primary' : 'text-muted-foreground'}`}>
      {passed ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <div className="h-3 w-3 rounded-full border border-muted-foreground/40" />
      )}
      {label}
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[80vh] items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
