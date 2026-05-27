'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface Question {
  id: string
  text: string
  options: string[]
  answer: number
}

export default function Quiz({ questions, onComplete }: { questions: Question[]; onComplete: (score: number, total: number) => void }) {
  const [answers, setAnswers] = useState<Record<string, number | null>>(() => {
    const init: Record<string, number | null> = {}
    questions.forEach((q) => (init[q.id] = null))
    return init
  })
  const [submitting, setSubmitting] = useState(false)

  const select = (questionId: string, idx: number) => {
    setAnswers((s) => ({ ...s, [questionId]: idx }))
  }

  const handleSubmit = () => {
    setSubmitting(true)
    let score = 0
    questions.forEach((q) => {
      if (answers[q.id] === q.answer) score += 1
    })
    toast.success(`Quiz submitted — score ${score}/${questions.length}`)
    onComplete(score, questions.length)
    setSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {questions.map((q, qi) => (
            <div key={q.id} className="rounded-md border border-border p-3">
              <div className="mb-2 font-medium">{qi + 1}. {q.text}</div>
              <div className="flex flex-col gap-2">
                {q.options.map((opt, i) => (
                  <label key={i} className={`flex items-center gap-2 rounded-md p-2 hover:bg-muted/50 ${answers[q.id] === i ? 'bg-primary/5' : ''}`}>
                    <input type="radio" name={q.id} checked={answers[q.id] === i} onChange={() => select(q.id, i)} />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
