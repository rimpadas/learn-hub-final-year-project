'use client'

import { useState, useMemo } from 'react'
import { useCourses } from '@/lib/course-context'
import { CourseCard } from '@/components/course-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { categories } from '@/lib/data'
import { Search, SlidersHorizontal } from 'lucide-react'

export default function CoursesPage() {
  const { courses } = useCourses()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [level, setLevel] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

  const filteredCourses = useMemo(() => {
    let result = courses

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q)
      )
    }

    if (category !== 'All') {
      result = result.filter((c) => c.category === category)
    }

    if (level !== 'All') {
      result = result.filter((c) => c.level === level)
    }

    switch (sortBy) {
      case 'popular':
        result = [...result].sort((a, b) => b.students - a.students)
        break
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating)
        break
      case 'price-low':
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result = [...result].sort((a, b) => b.price - a.price)
        break
      default:
        result = [...result].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    }

    return result
  }, [courses, search, category, level, sortBy])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
          Browse Courses
        </h1>
        <p className="mt-2 text-muted-foreground">
          Discover {courses.length} courses across multiple categories
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses, instructors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SlidersHorizontal className="mr-2 h-3.5 w-3.5" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-low">Price: Low</SelectItem>
              <SelectItem value="price-high">Price: High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {(category !== 'All' || level !== 'All' || search) && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {search && (
            <Badge variant="secondary" className="gap-1">
              {`"${search}"`}
              <button
                onClick={() => setSearch('')}
                className="ml-1 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                x
              </button>
            </Badge>
          )}
          {category !== 'All' && (
            <Badge variant="secondary" className="gap-1">
              {category}
              <button
                onClick={() => setCategory('All')}
                className="ml-1 text-muted-foreground hover:text-foreground"
                aria-label="Clear category filter"
              >
                x
              </button>
            </Badge>
          )}
          {level !== 'All' && (
            <Badge variant="secondary" className="gap-1">
              {level}
              <button
                onClick={() => setLevel('All')}
                className="ml-1 text-muted-foreground hover:text-foreground"
                aria-label="Clear level filter"
              >
                x
              </button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch('')
              setCategory('All')
              setLevel('All')
            }}
            className="text-xs"
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Results */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-lg font-medium text-foreground">No courses found</p>
          <p className="mt-1 text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearch('')
              setCategory('All')
              setLevel('All')
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Showing {filteredCourses.length} of {courses.length} courses
      </div>
    </div>
  )
}
