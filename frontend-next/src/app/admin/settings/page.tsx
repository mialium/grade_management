'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { apiService } from '@/lib/api'
import { User } from '@/types/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUserShield, 
  faUsers, 
  faSave, 
  faTimes,
  faSpinner,
  faExclamationTriangle,
  faSearch,
  faPlus,
  faEdit,
  faTrash,
  faToggleOn,
  faToggleOff
} from '@fortawesome/free-solid-svg-icons'
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from '@/components/motion'

export default function AdminSettingsPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/login')
      return
    }

    loadUsers()
  }, [user, router])

  const loadUsers = async () => {
    try {
      const response = await apiService.getAllUsers()
      if (response.success && response.data) {
        setUsers(response.data)
      } else {
        setError(response.error || '加载用户失败')
      }
    } catch (error) {
      console.error('Load users error:', error)
      setError('网络错误')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateUser = async (userData: Partial<User>) => {
    setIsCreating(true)
    try {
      const response = await apiService.createUser(userData)
      if (response.success) {
        setSuccess('用户创建成功')
        setShowCreateForm(false)
        loadUsers()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(response.error || '创建用户失败')
      }
    } catch (error) {
      setError('网络错误')
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdateUserStatus = async (userId: number, isActive: boolean) => {
    try {
      const response = await apiService.updateUserStatus(userId, isActive)
      if (response.success) {
        setSuccess(`用户已${isActive ? '启用' : '禁用'}`)
        loadUsers()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(response.error || '更新用户状态失败')
      }
    } catch (error) {
      setError('网络错误')
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('确定要删除这个用户吗？此操作不可恢复。')) return

    try {
      const response = await apiService.deleteUser(userId)
      if (response.success) {
        setSuccess('用户删除成功')
        loadUsers()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(response.error || '删除用户失败')
      }
    } catch (error) {
      setError('网络错误')
    }
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.realName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleText = (role: string) => {
    switch (role) {
      case 'STUDENT': return '学生'
      case 'TEACHER': return '教师'
      case 'ADMIN': return '管理员'
      default: return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'STUDENT': return 'bg-blue-100 text-blue-800'
      case 'TEACHER': return 'bg-green-100 text-green-800'
      case 'ADMIN': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">系统设置</h1>
          <p className="text-gray-600">管理系统用户和系统配置</p>
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

      {/* 系统信息卡片 */}
      <SlideIn direction="up" delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StaggerItem>
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总用户数</CardTitle>
                <FontAwesomeIcon icon={faUsers} className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
              </CardContent>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
                <FontAwesomeIcon icon={faUserShield} className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.filter(u => u.isActive).length}</div>
              </CardContent>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">管理员</CardTitle>
                <FontAwesomeIcon icon={faUserShield} className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.filter(u => u.role === 'ADMIN').length}</div>
              </CardContent>
            </Card>
          </StaggerItem>
        </div>
      </SlideIn>

      {/* 用户管理 */}
      <SlideIn direction="up" delay={0.3}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faUsers} className="text-blue-600" />
                <span>用户管理</span>
              </div>
              <Button onClick={() => setShowCreateForm(true)} className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faPlus} />
                <span>创建用户</span>
              </Button>
            </CardTitle>
            <CardDescription>
              管理系统用户账户和权限
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="搜索用户名、姓名或邮箱..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* 创建用户表单 */}
            {showCreateForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>创建新用户</CardTitle>
                </CardHeader>
                <CardContent>
                  <UserForm
                    onSubmit={handleCreateUser}
                    onCancel={() => setShowCreateForm(false)}
                    isLoading={isCreating}
                  />
                </CardContent>
              </Card>
            )}

            {/* 用户列表 */}
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <FontAwesomeIcon icon={faUsers} className="text-gray-400 text-4xl mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? '未找到匹配的用户' : '暂无用户'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">用户名</th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">姓名</th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">角色</th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">邮箱</th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">状态</th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={`user-${user.id}`} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                          {user.username}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                          {user.realName}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {getRoleText(user.role)}
                          </span>
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                          {user.email || '-'}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? '活跃' : '禁用'}
                          </span>
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateUserStatus(user.id, !user.isActive)}
                              title={user.isActive ? '禁用用户' : '启用用户'}
                            >
                              <FontAwesomeIcon 
                                icon={user.isActive ? faToggleOn : faToggleOff} 
                                className={user.isActive ? 'text-green-600' : 'text-red-600'}
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingUser(user)}
                              title="编辑用户"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              title="删除用户"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
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
  )
}

interface UserFormProps {
  initialData?: Partial<User>
  onSubmit: (data: Partial<User>) => void
  onCancel: () => void
  isLoading: boolean
}

function UserForm({ initialData, onSubmit, onCancel, isLoading }: UserFormProps) {
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    realName: initialData?.realName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    role: initialData?.role || 'STUDENT' as 'STUDENT' | 'TEACHER' | 'ADMIN',
    password: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="username">用户名</Label>
        <Input
          id="username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="realName">姓名</Label>
        <Input
          id="realName"
          value={formData.realName}
          onChange={(e) => setFormData({ ...formData, realName: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="email">邮箱</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      
      <div>
        <Label htmlFor="phone">电话</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      
      <div>
        <Label htmlFor="role">角色</Label>
        <select
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="STUDENT">学生</option>
          <option value="TEACHER">教师</option>
          <option value="ADMIN">管理员</option>
        </select>
      </div>
      
      {!initialData && (
        <div>
          <Label htmlFor="password">密码</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
      )}
      
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