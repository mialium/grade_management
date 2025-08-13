'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { apiService } from '@/lib/api'
import { Grade, Course, Student } from '@/types/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSignOutAlt, 
  faGraduationCap, 
  faBook, 
  faChartBar, 
  faUser,
  faTrophy,
  faCalendarAlt,
  faSpinner,
  faExclamationTriangle,
  faEdit,
  faSave,
  faTimes,
  faSearch,
  faUsers
} from '@fortawesome/free-solid-svg-icons'
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from '@/components/motion'

export default function TeacherGradeEntryPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [editingGrade, setEditingGrade] = useState<{ [key: string]: number }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const { user, logout } = useAuth()
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
        console.log('Courses data:', response.data)
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
      console.log('Loading data for course:', selectedCourse)
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api')
      
      const [studentsResponse, gradesResponse] = await Promise.all([
        apiService.getStudentsByCourse(selectedCourse),
        apiService.getGradesByCourse(selectedCourse)
      ])

      console.log('Students response:', studentsResponse)
      console.log('Grades response:', gradesResponse)
      console.log('Students response success:', studentsResponse.success)
      console.log('Students response data:', studentsResponse.data)
      console.log('Students response error:', studentsResponse.error)

      if (studentsResponse.success && studentsResponse.data) {
        setStudents(studentsResponse.data)
        console.log('Students data set:', studentsResponse.data)
        console.log('Number of students loaded:', studentsResponse.data.length)
      } else {
        console.error('Failed to load students:', studentsResponse.error)
        setError(studentsResponse.error || '加载学生列表失败')
      }

      if (gradesResponse.success && gradesResponse.data) {
        setGrades(gradesResponse.data)
        // 等待学生数据加载完成后处理成绩映射
        if (studentsResponse.success && studentsResponse.data) {
          const gradeMap: { [key: string]: number } = {}
          gradesResponse.data.forEach(grade => {
            // 通过studentName找到对应的学生ID
            const student = studentsResponse.data.find(s => 
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
        console.error('Failed to load grades:', gradesResponse.error)
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

    // 找到对应的学生获取studentName
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

  const getScoreClass = (score: number) => {
    if (score >= 90) return 'text-green-600 font-bold'
    if (score >= 80) return 'text-blue-600 font-bold'
    if (score >= 60) return 'text-yellow-600 font-bold'
    return 'text-red-600 font-bold'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="text-blue-600 text-4xl animate-spin mb-4" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <FontAwesomeIcon icon={faGraduationCap} className="text-blue-600 text-2xl mr-3" />
                <h1 className="text-xl font-bold text-gray-900">成绩管理系统 - 教师端</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-700">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                <span>{user?.realName} (教师)</span>
              </div>
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>退出</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StaggerContainer>
          <FadeIn delay={0.1}>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">成绩录入</h2>
              <p className="text-gray-600">管理和录入学生成绩</p>
            </div>
          </FadeIn>

          {/* 课程选择 */}
          <SlideIn direction="up" delay={0.2}>
            <Card className="mb-6">
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
                  {courses.map((course, index) => {
                    const courseName = course.courseName;
                    return (
                      <div
                        key={`course-${courseName}`}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedCourse === courseName
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => {
                          console.log('Selected course:', courseName);
                          console.log('Course object:', course);
                          setSelectedCourse(courseName);
                        }}
                      >
                        <h3 className="font-semibold text-gray-900">{courseName}</h3>
                        <p className="text-sm text-gray-600">{course.courseCode}</p>
                        <p className="text-sm text-gray-500">{course.credit} 学分</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </SlideIn>

          {/* 成绩录入 */}
          {selectedCourse && (
            <SlideIn direction="up" delay={0.3}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon icon={faUsers} className="text-blue-600" />
                      <span>学生成绩录入</span>
                    </div>
                    <Button onClick={saveAllGrades} className="flex items-center space-x-2">
                      <FontAwesomeIcon icon={faSave} />
                      <span>保存所有成绩</span>
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    为学生录入成绩（0-100分）
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600" />
                        <span className="text-red-700">{error}</span>
                      </div>
                    </div>
                  )}

                  {success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faSave} className="text-green-600" />
                        <span className="text-green-700">{success}</span>
                      </div>
                    </div>
                  )}

                  {students.length === 0 ? (
                    <div className="text-center py-8">
                      <FontAwesomeIcon icon={faUsers} className="text-gray-400 text-4xl mb-4" />
                      <p className="text-gray-500">该课程暂无学生</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">学号</th>
                            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">姓名</th>
                            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">班级</th>
                            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">性别</th>
                            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">成绩</th>
                            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student) => (
                            <tr key={`student-${student.id}`} className="hover:bg-gray-50">
                              <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                                {student.studentNumber}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                                {student.realName || student.userName || ''}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                                {student.className}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                                {student.gender || '-'}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-sm">
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={editingGrade[`student-${student.id}`] || ''}
                                  onChange={(e) => handleGradeChange(student.id, parseFloat(e.target.value) || 0)}
                                  className="w-20"
                                />
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-sm">
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
            </SlideIn>
          )}
        </StaggerContainer>
      </main>
    </div>
  )
}