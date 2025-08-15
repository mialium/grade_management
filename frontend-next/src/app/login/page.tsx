'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { apiService } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock, faSignInAlt, faGraduationCap, faEnvelope, faUserPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FadeIn, ScaleIn } from '@/components/motion'

export default function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    realName: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await login({ username: formData.username, password: formData.password })
      
      if (result.success) {
        const userRole = localStorage.getItem('role')
        switch (userRole) {
          case 'STUDENT':
            router.push('/dashboard')
            break
          case 'TEACHER':
            router.push('/teacher/grade-entry')
            break
          case 'ADMIN':
            router.push('/admin/user-management')
            break
          default:
            router.push('/dashboard')
        }
      } else {
        setError(result.error || '登录失败')
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      // 验证密码
      if (formData.password !== formData.confirmPassword) {
        setError('两次输入的密码不一致')
        setIsLoading(false)
        return
      }

      const result = await apiService.register({
        username: formData.username,
        email: formData.email,
        realName: formData.realName,
        password: formData.password
      })

      if (result.success) {
        setSuccess('注册成功！请查收邮件进行验证。')
        setFormData({
          username: '',
          email: '',
          realName: '',
          password: '',
          confirmPassword: ''
        })
        // 3秒后切换到登录模式
        setTimeout(() => {
          setIsLoginMode(true)
          setSuccess('')
        }, 3000)
      } else {
        setError(result.error || '注册失败')
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <FadeIn delay={0.2}>
          <div className="text-center mb-8">
            <ScaleIn delay={0.3}>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4">
                <FontAwesomeIcon icon={faGraduationCap} className="text-white text-3xl" />
              </div>
            </ScaleIn>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">成绩管理系统</h1>
            <p className="text-gray-600">现代化的成绩管理平台</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-gray-900">
                {isLoginMode ? '用户登录' : '用户注册'}
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                {isLoginMode ? '请输入您的用户名和密码' : '请填写以下信息进行注册'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoginMode ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username" className="text-gray-700 font-medium">
                      用户名
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                      </div>
                      <Input
                        id="login-username"
                        name="username"
                        type="text"
                        placeholder="请输入用户名"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-gray-700 font-medium">
                      密码
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                      </div>
                      <Input
                        id="login-password"
                        name="password"
                        type="password"
                        placeholder="请输入密码"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        登录中...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                        登录
                      </div>
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-username" className="text-gray-700 font-medium">
                      用户名
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                      </div>
                      <Input
                        id="register-username"
                        name="username"
                        type="text"
                        placeholder="请输入用户名"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-gray-700 font-medium">
                      邮箱
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                      </div>
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        placeholder="请输入邮箱"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-realName" className="text-gray-700 font-medium">
                      真实姓名
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                      </div>
                      <Input
                        id="register-realName"
                        name="realName"
                        type="text"
                        placeholder="请输入真实姓名"
                        value={formData.realName}
                        onChange={handleInputChange}
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-gray-700 font-medium">
                      密码
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                      </div>
                      <Input
                        id="register-password"
                        name="password"
                        type="password"
                        placeholder="请输入密码"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirmPassword" className="text-gray-700 font-medium">
                      确认密码
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                      </div>
                      <Input
                        id="register-confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="请再次输入密码"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                      {success}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        注册中...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                        注册
                      </div>
                    )}
                  </Button>
                </form>
              )}

              <div className="mt-6 text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsLoginMode(!isLoginMode)
                    setError('')
                    setSuccess('')
                    setFormData({
                      username: '',
                      email: '',
                      realName: '',
                      password: '',
                      confirmPassword: ''
                    })
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FontAwesomeIcon icon={isLoginMode ? faUserPlus : faArrowLeft} className="mr-2" />
                  {isLoginMode ? '没有账号？立即注册' : '已有账号？立即登录'}
                </Button>
              </div>

              {isLoginMode && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-700">
                    <strong>默认用户：</strong> admin / password
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    （密码区分大小写）
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  )
}