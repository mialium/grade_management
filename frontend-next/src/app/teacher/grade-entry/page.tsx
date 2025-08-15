'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { apiService } from '@/lib/api'
import { Grade, Course, Student } from '@/types/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faChalkboardTeacher, 
  faBook, 
  faUsers, 
  faSpinner,
  faExclamationTriangle,
  faSave,
  faSearch,
  faCheck,
  faTimes
} from '@fortawesome/free-solid-svg-icons'

export default function TeacherGradeEntryPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [editingGrade, setEditingGrade] = useState<{ [key: string]: number }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== 'TEACHER') {
      router.push('/login')
      return
    }

    loadCourses()
  }, [user, router])

  useEffect(() => {
    if (selectedCourse) {
      loadStudentsAndGrades()
    }
  }, [selectedCourse])

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

  const loadStudentsAndGrades = async () => {
    if (!selectedCourse) return

    try {
      const [studentsResponse, gradesResponse] = await Promise.all([
        apiService.getStudentsByCourse(selectedCourse),
        apiService.getGradesByCourse(selectedCourse)
      ])

      if (studentsResponse.success && studentsResponse.data) {
        setStudents(studentsResponse.data)
      } else {
        setError(studentsResponse.error || '加载学生列表失败')
      }

      if (gradesResponse.success && gradesResponse.data) {
        setGrades(gradesResponse.data)
        if (studentsResponse.success && studentsResponse.data) {
          const gradeMap: { [key: string]: number } = {}
          gradesResponse.data.forEach(grade => {
            const student = studentsResponse.data?.find(s => 
              (s.realName && s.realName === grade.studentName) || 
              (s.userName && s.userName === grade.studentName)
            )
            if (student) {
              gradeMap[`student-${student.id}`] = grade.score
            }
          })
          setEditingGrade(gradeMap)
        }
      } else {
        setError(gradesResponse.error || '加载成绩列表失败')
      }
    } catch (error) {
      console.error('Load students and grades error:', error)
      setError('网络错误')
    }
  }

  const handleGradeChange = (studentId: number, score: number) => {
    setEditingGrade(prev => ({
      ...prev,
      [`student-${studentId}`]: score
    }))
  }

  const saveGrade = async (studentId: number) => {
    if (!selectedCourse) return

    const score = editingGrade[`student-${studentId}`]
    if (score === undefined || score < 0 || score > 100) {
      setError('成绩必须在0-100之间')
      return
    }

    const student = students.find(s => s.id === studentId)
    if (!student) {
      setError('学生不存在')
      return
    }

    try {
      const response = await apiService.saveGrade({
        studentName: student.realName || student.userName || '',
        courseName: selectedCourse,
        score,
        semester: '2024春季',
        academicYear: '2023-2024'
      })

      if (response.success) {
        setSuccess('成绩保存成功')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(response.error || '保存失败')
      }
    } catch (error) {
      setError('网络错误')
    }
  }

  const saveAllGrades = async () => {
    if (!selectedCourse) return

    const gradeData = Object.entries(editingGrade).map(([key, score]) => {
      const studentId = parseInt(key.replace('student-', ''))
      const student = students.find(s => s.id === studentId)
      return {
        studentName: student?.realName || student?.userName || '',
        courseName: selectedCourse,
        score,
        semester: '2024春季',
        academicYear: '2023-2024'
      }
    })

    try {
      const response = await apiService.saveGradesBatch(gradeData)
      if (response.success) {
        setSuccess('所有成绩保存成功')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(response.error || '批量保存失败')
      }
    } catch (error) {
      setError('网络错误')
    }
  }

  const filteredStudents = students.filter(student =>
    student.realName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.className.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getScoreClass = (score: number) => {
    if (score >= 90) return 'text-green-600 font-bold'
    if (score >= 80) return 'text-blue-600 font-bold'
    if (score >= 60) return 'text-yellow-600 font-bold'
    return 'text-red-600 font-bold'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center py-12">
            <FontAwesomeIcon icon={faSpinner} className="text-blue-600 text-4xl animate-spin mb-4" />
            <p className="text-gray-600 font-medium">加载中...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">成绩录入</h1>
          <p className="text-gray-600 mt-1">管理和录入学生成绩</p>
        </div>
      </div>

      {/* 错误和成功提示 */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center space-x-3 py-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 text-lg" />
            <span className="text-red-700 font-medium">{error}</span>
          </CardContent>
        </Card>
      )}

      {success && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex items-center space-x-3 py-4">
            <FontAwesomeIcon icon={faCheck} className="text-green-600 text-lg" />
            <span className="text-green-700 font-medium">{success}</span>
          </CardContent>
        </Card>
      )}

      {/* 课程选择 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faBook} className="text-blue-600" />
            <span>选择课程</span>
          </CardTitle>
          <CardDescription>
            选择要录入成绩的课程
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => {
              const courseName = course.courseName;
              return (
                <div
                  key={`course-${courseName}`}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedCourse === courseName
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedCourse(courseName)}
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{courseName}</h3>
                  <p className="text-sm text-gray-600 mb-1">{course.courseCode}</p>
                  <p className="text-xs text-gray-500">{course.credit} 学分</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 成绩录入 */}
      {selectedCourse && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faUsers} className="text-blue-600" />
                  <span>学生成绩录入</span>
                </CardTitle>
                <CardDescription className="mt-1">
                  课程: {selectedCourse} - 为学生录入成绩（0-100分）
                </CardDescription>
              </div>
              <Button onClick={saveAllGrades} className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faSave} />
                <span>保存所有成绩</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* 搜索框 */}
            <div className="mb-6">
              <div className="relative">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="搜索学生姓名、学号或班级..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <FontAwesomeIcon icon={faUsers} className="text-gray-300 text-5xl mb-4" />
                <p className="text-gray-500 text-lg font-medium">
                  {searchTerm ? '未找到匹配的学生' : '该课程暂无学生'}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {searchTerm ? '请尝试其他搜索关键词' : '请先为学生分配课程'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">学号</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">班级</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">成绩</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <tr key={`student-${student.id}`} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.studentNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.realName || student.userName || ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.className}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={editingGrade[`student-${student.id}`] || ''}
                            onChange={(e) => handleGradeChange(student.id, parseFloat(e.target.value) || 0)}
                            className="w-20"
                            placeholder="0-100"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Button
                            onClick={() => saveGrade(student.id)}
                            size="sm"
                            className="flex items-center space-x-1"
                          >
                            <FontAwesomeIcon icon={faSave} />
                            <span>保存</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}