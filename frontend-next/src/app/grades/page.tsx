'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { apiService } from '@/lib/api'
import { Grade } from '@/types/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faBook, 
  faChartBar, 
  faSpinner,
  faExclamationTriangle,
  faCalendarAlt,
  faGraduationCap,
  faTrophy
} from '@fortawesome/free-solid-svg-icons'

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      window.location.href = '/login'
      return
    }

    loadGrades()
  }, [user])

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
      console.error('Load grades error:', error)
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

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800'
    if (score >= 80) return 'bg-blue-100 text-blue-800'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
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
          <h1 className="text-3xl font-bold text-gray-900">我的成绩</h1>
          <p className="text-gray-600 mt-1">查看您的所有课程成绩和统计信息</p>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center space-x-3 py-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 text-lg" />
            <span className="text-red-700 font-medium">{error}</span>
          </CardContent>
        </Card>
      )}

      {/* 统计卡片 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">平均成绩</p>
                  <p className="text-3xl font-bold mt-1">{stats.average.toFixed(1)}</p>
                </div>
                <FontAwesomeIcon icon={faChartBar} className="text-blue-200 text-2xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">最高成绩</p>
                  <p className="text-3xl font-bold mt-1">{stats.highest}</p>
                </div>
                <FontAwesomeIcon icon={faTrophy} className="text-green-200 text-2xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">通过率</p>
                  <p className="text-3xl font-bold mt-1">{stats.passRate.toFixed(1)}%</p>
                </div>
                <FontAwesomeIcon icon={faChartBar} className="text-yellow-200 text-2xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">课程数量</p>
                  <p className="text-3xl font-bold mt-1">{grades.length}</p>
                </div>
                <FontAwesomeIcon icon={faBook} className="text-purple-200 text-2xl" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 成绩表格 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <FontAwesomeIcon icon={faBook} className="text-blue-600" />
                <span>成绩详情</span>
              </CardTitle>
              <CardDescription className="mt-1">
                您的课程成绩和相关信息
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {grades.length === 0 ? (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faGraduationCap} className="text-gray-300 text-5xl mb-4" />
              <p className="text-gray-500 text-lg font-medium">暂无成绩数据</p>
              <p className="text-gray-400 text-sm mt-1">暂时没有您的成绩记录</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">课程名称</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">成绩</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">等级</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">学期</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">学年</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {grades.map((grade, index) => (
                    <tr key={`grade-${grade.id}-${index}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {grade.courseName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={getScoreClass(Number(grade.score))}>
                          {grade.score}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getScoreColor(Number(grade.score))}`}>
                          {getScoreGrade(Number(grade.score))}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {grade.semester}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
    </div>
  )
}