'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useCourses } from '@/lib/course-context'
import { useEnrollment } from '@/lib/enrollment-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BookOpen,
  DollarSign,
  Edit2,
  LogIn,
  Plus,
  Settings,
  ShieldAlert,
  Star,
  Trash2,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Course } from '@/lib/types'

interface CourseForm {
  title: string
  description: string
  instructor: string
  category: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  lessons: number
  price: number
  image: string
}

const defaultForm: CourseForm = {
  title: '',
  description: '',
  instructor: '',
  category: 'Web Development',
  level: 'Beginner',
  duration: '',
  lessons: 0,
  price: 0,
  image: '/placeholder-course.jpg',
}

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth()
  const { courses, addCourse, updateCourse, deleteCourse } = useCourses()
  const { enrollments } = useEnrollment()
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState<CourseForm>(defaultForm)
  const [editingId, setEditingId] = useState<string | null>(null)

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <LogIn className="mb-4 h-12 w-12 text-muted-foreground" />
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Sign in Required
        </h1>
        <p className="mt-2 text-muted-foreground">
          Please sign in to access the admin panel
        </p>
        <Link href="/login" className="mt-4">
          <Button>Sign In</Button>
        </Link>
      </div>
    )
  }

  if (user.role !== 'admin') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <ShieldAlert className="mb-4 h-12 w-12 text-destructive" />
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Access Denied
        </h1>
        <p className="mt-2 text-muted-foreground">
          You need admin privileges to access this page
        </p>
        <Link href="/dashboard" className="mt-4">
          <Button variant="outline">Go to Dashboard</Button>
        </Link>
      </div>
    )
  }

  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0)
  const totalRevenue = courses.reduce((sum, c) => sum + c.price * c.students, 0)

  const handleAdd = () => {
    if (!form.title || !form.instructor || !form.duration) {
      toast.error('Please fill in all required fields')
      return
    }
    addCourse({
      ...form,
      syllabus: [],
    })
    toast.success('Course added successfully!')
    setForm(defaultForm)
    setAddOpen(false)
  }

  const handleEdit = (course: Course) => {
    setForm({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      category: course.category,
      level: course.level,
      duration: course.duration,
      lessons: course.lessons,
      price: course.price,
      image: course.image,
    })
    setEditingId(course.id)
    setEditOpen(true)
  }

  const handleUpdate = () => {
    if (!editingId) return
    updateCourse(editingId, form)
    toast.success('Course updated successfully!')
    setForm(defaultForm)
    setEditingId(null)
    setEditOpen(false)
  }

  const handleDelete = (id: string) => {
    deleteCourse(id)
    toast.success('Course deleted successfully!')
  }

  const CourseFormFields = () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Course Title *</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="e.g., Introduction to React"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Course description..."
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="instructor">Instructor *</Label>
          <Input
            id="instructor"
            value={form.instructor}
            onChange={(e) => setForm({ ...form, instructor: e.target.value })}
            placeholder="e.g., Dr. Smith"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={form.category}
            onValueChange={(val) => setForm({ ...form, category: val })}
          >
            <SelectTrigger id="category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Web Development">Web Development</SelectItem>
              <SelectItem value="Frontend">Frontend</SelectItem>
              <SelectItem value="Backend">Backend</SelectItem>
              <SelectItem value="Data Science">Data Science</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="level">Level</Label>
          <Select
            value={form.level}
            onValueChange={(val) =>
              setForm({ ...form, level: val as CourseForm['level'] })
            }
          >
            <SelectTrigger id="level">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="duration">Duration *</Label>
          <Input
            id="duration"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            placeholder="e.g., 8 weeks"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            min={0}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="lessons">Number of Lessons</Label>
        <Input
          id="lessons"
          type="number"
          min={0}
          value={form.lessons}
          onChange={(e) => setForm({ ...form, lessons: Number(e.target.value) })}
        />
      </div>
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              Admin Dashboard
            </h1>
          </div>
          <p className="mt-1 text-muted-foreground">
            Manage courses, track enrollments, and monitor platform activity
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-2"
              onClick={() => setForm(defaultForm)}
            >
              <Plus className="h-4 w-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading">Add New Course</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new course
              </DialogDescription>
            </DialogHeader>
            <CourseFormFields />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd}>Add Course</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Courses</p>
              <p className="font-heading text-2xl font-bold text-foreground">
                {courses.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10">
              <Users className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="font-heading text-2xl font-bold text-foreground">
                {totalStudents.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="font-heading text-2xl font-bold text-foreground">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10">
              <Star className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Enrollments</p>
              <p className="font-heading text-2xl font-bold text-foreground">
                {enrollments.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">All Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead className="hidden md:table-cell">Instructor</TableHead>
                  <TableHead className="hidden sm:table-cell">Level</TableHead>
                  <TableHead className="hidden lg:table-cell">Students</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div>
                        <Link
                          href={`/courses/${course.id}`}
                          className="font-medium text-foreground hover:text-primary"
                        >
                          {course.title}
                        </Link>
                        <p className="text-xs text-muted-foreground md:hidden">
                          {course.instructor}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {course.instructor}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className="text-xs">
                        {course.level}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {course.students.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {course.price === 0 ? 'Free' : `₹${course.price}`}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(course)}
                          aria-label={`Edit ${course.title}`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              aria-label={`Delete ${course.title}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Course</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;{course.title}&quot;?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(course.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">Edit Course</DialogTitle>
            <DialogDescription>
              Update the course details below
            </DialogDescription>
          </DialogHeader>
          <CourseFormFields />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
