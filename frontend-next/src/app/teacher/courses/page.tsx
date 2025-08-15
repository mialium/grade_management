'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { apiService } from '@/lib/api'
import { Course } from '@/types/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faBook, 
  faPlus, 
  faEdit, 
  faTrash, 
  faSpinner,
  faExclamationTriangle,
  faSave,
  faTimes,
  faSearch
} from '@fortawesome/free-solid-svg-icons'
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from '@/components/motion'

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== 'TEACHER') {
      router.push('/login')
      return
    }

    loadCourses()
  }, [user, router])

  const loadCourses = async () => {
    try {
      const response = await apiService.getTeacherCourses()
      if (response.success && response.data) {
        setCourses(response.data)
      } else {
        setError(response.error || '加载课程失败')
      }
    } catch (error) {
      console.error('Load courses error:', error)
      setError('网络错误')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCourse = async (courseData: Partial<Course>) => {
    try {
      const response = await apiService.handleApiCall<any>('/teacher/courses', {
        method: 'POST',
        body: JSON.stringify(courseData)
      })

      if (response.success) {
        setSuccess('课程创建成功')
        setShowCreateForm(false)
        loadCourses()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(response.error || '创建课程失败')
      }
    } catch (error) {
      setError('网络错误')
    }
  }

  const handleUpdateCourse = async (courseData: Partial<Course>) => {
    if (!editingCourse) return

    try {
      const response = await apiService.handleApiCall<any>(`/teacher/courses/${editingCourse.id}`, {
        method: 'PUT',
        body: JSON.stringify(courseData)
      })

      if (response.success) {
        setSuccess('课程更新成功')
        setEditingCourse(null)
        loadCourses()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(response.error || '更新课程失败')
      }
    } catch (error) {
      setError('网络错误')
    }
  }

  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm('确定要删除这门课程吗？')) return

    try {
      const response = await apiService.handleApiCall<any>(`/teacher/courses/${courseId}`, {
        method: 'DELETE'
      })

      if (response.success) {
        setSuccess('课程删除成功')
        loadCourses()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(response.error || '删除课程失败')
      }
    } catch (error) {
      setError('网络错误')
    }
  }

  const filteredCourses = courses.filter(course =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="text-blue-600 text-4xl animate-spin mb-4" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <StaggerContainer>
      <FadeIn delay={0.1}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">课程管理</h1>
          <p className="text-gray-600">管理您的课程信息</p>
        </div>
      </FadeIn>

      {error && (
        <FadeIn delay={0.2}>
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        </FadeIn>
      )}

      {success && (
        <FadeIn delay={0.2}>
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faSave} className="text-green-600" />
              <span className="text-green-700">{success}</span>
            </div>
          </div>
        </FadeIn>
      )}

      {/* 搜索和创建按钮 */}
      <SlideIn direction="up" delay={0.2}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faBook} className="text-blue-600" />
                <span>课程列表</span>
              </div>
              <Button onClick={() => setShowCreateForm(true)} className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faPlus} />
                <span>创建课程</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="搜索课程名称或代码..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* 创建课程表单 */}
            {showCreateForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>创建新课程</CardTitle>
                </CardHeader>
                <CardContent>
                  <CourseForm
                    onSubmit={handleCreateCourse}
                    onCancel={() => setShowCreateForm(false)}
                    isLoading={isCreating}
                  />
                </CardContent>
              </Card>
            )}

            {/* 课程列表 */}
            {filteredCourses.length === 0 ? (
              <div className="text-center py-8">
                <FontAwesomeIcon icon={faBook} className="text-gray-400 text-4xl mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? '未找到匹配的课程' : '暂无课程'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCourses.map((course, index) => (
                  <StaggerItem key={`course-${course.id}`}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{course.courseName}</CardTitle>
                            <CardDescription>{course.courseCode}</CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingCourse(course)}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCourse(course.id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">学分:</span>
                            <span className="font-medium">{course.credit}</span>
                          </div>
                          {course.description && (
                            <div className="text-sm text-gray-600">
                              {course.description}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </SlideIn>

      {/* 编辑课程模态框 */}
      {editingCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>编辑课程</CardTitle>
            </CardHeader>
            <CardContent>
              <CourseForm
                initialData={editingCourse}
                onSubmit={handleUpdateCourse}
                onCancel={() => setEditingCourse(null)}
                isLoading={isCreating}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </StaggerContainer>
  )
}

interface CourseFormProps {
  initialData?: Partial<Course>
  onSubmit: (data: Partial<Course>) => void
  onCancel: () => void
  isLoading: boolean
}

function CourseForm({ initialData, onSubmit, onCancel, isLoading }: CourseFormProps) {
  const [formData, setFormData] = useState({
    courseName: initialData?.courseName || '',
    courseCode: initialData?.courseCode || '',
    credit: initialData?.credit || 0,
    description: initialData?.description || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="courseName">课程名称</Label>
        <Input
          id="courseName"
          value={formData.courseName}
          onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="courseCode">课程代码</Label>
        <Input
          id="courseCode"
          value={formData.courseCode}
          onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="credit">学分</Label>
        <Input
          id="credit"
          type="number"
          min="0"
          max="10"
          value={formData.credit}
          onChange={(e) => setFormData({ ...formData, credit: parseFloat(e.target.value) || 0 })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">课程描述</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      
      <div className="flex space-x-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '保存中...' : '保存'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
      </div>
    </form>
  )
}