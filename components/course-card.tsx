'use client'

import Link from 'next/link'
import type { Course } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { BookOpen, Clock, Star, Users } from 'lucide-react'

interface CourseCardProps {
  course: Course
}

const levelColors: Record<string, string> = {
  Beginner: 'bg-primary/10 text-primary border-primary/20',
  Intermediate: 'bg-accent/10 text-accent-foreground border-accent/20',
  Advanced: 'bg-destructive/10 text-destructive border-destructive/20',
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`}>
      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5">
        <div className="relative h-44 overflow-hidden bg-muted">
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-secondary to-accent/10">
            <BookOpen className="h-12 w-12 text-primary/40" />
          </div>
          <Badge
            className={`absolute right-3 top-3 text-xs ${levelColors[course.level]}`}
            variant="outline"
          >
            {course.level}
          </Badge>
        </div>
        <CardContent className="p-4">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-primary">
            {course.category}
          </p>
          <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-primary line-clamp-2">
            {course.title}
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t border-border px-4 py-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {course.students.toLocaleString()}
            </span>
            {course.rating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                {course.rating}
              </span>
            )}
          </div>
          <span className="font-heading text-sm font-bold text-foreground">
            {course.price === 0 ? 'Free' : `$${course.price}`}
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}
