'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle, faSpinner, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { FadeIn } from '@/components/motion'

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [searchParams] = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error')
        setMessage('验证链接无效')
        return
      }

      try {
        const response = await fetch(`http://localhost:8080/api/auth/verify-email?token=${token}`)
        const data = await response.json()

        if (response.ok) {
          setStatus('success')
          setMessage(data.message || '邮箱验证成功！')
        } else {
          setStatus('error')
          setMessage(data.message || '验证失败')
        }
      } catch (error) {
        setStatus('error')
        setMessage('网络错误，请稍后重试')
      }
    }

    verifyEmail()
  }, [token])

  const handleGoToLogin = () => {
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <FadeIn delay={0.2}>
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {status === 'loading' && (
                  <FontAwesomeIcon icon={faSpinner} className="text-blue-600 text-4xl animate-spin" />
                )}
                {status === 'success' && (
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-4xl" />
                )}
                {status === 'error' && (
                  <FontAwesomeIcon icon={faTimesCircle} className="text-red-600 text-4xl" />
                )}
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {status === 'loading' && '验证中...'}
                {status === 'success' && '验证成功'}
                {status === 'error' && '验证失败'}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {status === 'loading' && '正在验证您的邮箱'}
                {status === 'success' && '您的邮箱已成功验证'}
                {status === 'error' && '邮箱验证过程中出现问题'}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <p className={`text-sm ${status === 'success' ? 'text-green-600' : status === 'error' ? 'text-red-600' : 'text-gray-600'}`}>
                  {message}
                </p>
              </div>

              {(status === 'success' || status === 'error') && (
                <Button
                  onClick={handleGoToLogin}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                >
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                  前往登录
                </Button>
              )}

              {status === 'error' && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-xs text-blue-600">
                    如果验证链接已过期，请重新登录并请求重发验证邮件。
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