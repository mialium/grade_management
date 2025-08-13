'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { apiService } from '@/lib/api'
import { Grade } from '@/types/api'
import { Button } from '@/components/ui/button'
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
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from '@/components/motion'

export default function DashboardPage() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    loadGrades()
  }, [user, router])

  const loadGrades = async () => {
    if (!user) return

    try {
      const response = await apiService.getGradesByRole(user.role)
      if (response.success && response.data) {
        setGrades(response.data)
      } else {
        setError(response.error || '加载成绩失败')
      }
    } catch (error) {
      setError('网络错误')
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreClass = (score: number) => {
    if (score >= 90) return 'text-green-600 font-bold'
    if (score >= 80) return 'text-blue-600 font-bold'
    if (score >= 60) return 'text-yellow-600 font-bold'
    return 'text-red-600 font-bold'
  }

  const getScoreGrade = (score: number) => {
    if (score >= 90) return '优秀'
    if (score >= 80) return '良好'
    if (score >= 60) return '及格'
    return '不及格'
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'STUDENT': return '学生'
      case 'TEACHER': return '教师'
      case 'ADMIN': return '管理员'
      default: return role
    }
  }

  const getStatistics = () => {
    if (grades.length === 0) return null

    const scores = grades.map(g => Number(g.score)).filter(s => !isNaN(s))
    if (scores.length === 0) return null

    const average = scores.reduce((a, b) => a + b, 0) / scores.length
    const highest = Math.max(...scores)
    const lowest = Math.min(...scores)
    const passed = scores.filter(s => s >= 60).length
    const passRate = (passed / scores.length) * 100

    return { average, highest, lowest, passed, passRate }
  }

  const stats = getStatistics()

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
                <h1 className="text-xl font-bold text-gray-900">成绩管理系统</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-700">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                <span>{user?.realName} ({getRoleText(user?.role || '')})</span>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">我的成绩</h2>
              <p className="text-gray-600">查看您的学业成绩和统计信息</p>
            </div>
          </FadeIn>

          {/* 统计卡片 */}
          {stats && (
            <SlideIn direction="up" delay={0.2}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StaggerItem>
                  <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">平均成绩</CardTitle>
                      <FontAwesomeIcon icon={faChartBar} className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.average.toFixed(1)}</div>
                    </CardContent>
                  </Card>
                </StaggerItem>

                <StaggerItem>
                  <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">最高成绩</CardTitle>
                      <FontAwesomeIcon icon={faTrophy} className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.highest}</div>
                    </CardContent>
                  </Card>
                </StaggerItem>

                <StaggerItem>
                  <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">通过率</CardTitle>
                      <FontAwesomeIcon icon={faChartBar} className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.passRate.toFixed(1)}%</div>
                    </CardContent>
                  </Card>
                </StaggerItem>

                <StaggerItem>
                  <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">课程数量</CardTitle>
                      <FontAwesomeIcon icon={faBook} className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{grades.length}</div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              </div>
            </SlideIn>
          )}

          {/* 成绩表格 */}
          <SlideIn direction="up" delay={0.3}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faBook} className="text-blue-600" />
                  <span>成绩详情</span>
                </CardTitle>
                <CardDescription>
                  您的课程成绩和相关信息
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

                {grades.length === 0 ? (
                  <div className="text-center py-8">
                    <FontAwesomeIcon icon={faBook} className="text-gray-400 text-4xl mb-4" />
                    <p className="text-gray-500">暂无成绩数据</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">课程名称</th>
                          <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">课程代码</th>
                          <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">学分</th>
                          <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">成绩</th>
                          <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">等级</th>
                          <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">学期</th>
                          <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">学年</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grades.map((grade, index) => (
                          <tr key={`grade-${grade.id}-${index}`} className="hover:bg-gray-50">
                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                              {grade.courseName || ''}
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                              {grade.course?.courseCode || '-'}
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                              {grade.course?.credit ? grade.course.credit.toString() : '-'}
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-sm">
                              <span className={getScoreClass(Number(grade.score))}>
                                {grade.score}
                              </span>
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                Number(grade.score) >= 90 ? 'bg-green-100 text-green-800' :
                                Number(grade.score) >= 80 ? 'bg-blue-100 text-blue-800' :
                                Number(grade.score) >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {getScoreGrade(Number(grade.score))}
                              </span>
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                              {grade.semester}
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                              {grade.academicYear}
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
        </StaggerContainer>
      </main>
    </div>
  )
}