import { GraduationCap } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-heading text-lg font-bold text-foreground">
                LearnHub
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              A modern learning management system built for students and educators.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Platform</h4>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/courses" className="hover:text-foreground">
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-foreground">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Categories</h4>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>Web Development</li>
              <li>Data Science</li>
              <li>Computer Science</li>
              <li>Frontend</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Contact</h4>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>support@learnhub.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Education St, Learning City</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          2026 LearnHub. All rights reserved. Built as a college final year project.
        </div>
      </div>
    </footer>
  )
}
