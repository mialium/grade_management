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
  faSignOutAlt, 
  faGraduationCap, 
  faUsers, 
  faUserPlus,
  faEdit,
  faTrash,
  faSearch,
  faToggleOn,
  faToggleOff,
  faSpinner,
  faExclamationTriangle,
  faCheck,
  faTimes,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from '@/components/motion'

export default function AdminUserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    realName: '',
    role: 'STUDENT' as 'STUDENT' | 'TEACHER' | 'ADMIN',
    email: '',
    studentId: ''
  })
  
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/login')
      return
    }

    loadUsers()
  }, [user, router])

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(u => 
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.realName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchTerm, users])

  const loadUsers = async () => {
    try {
      const response = await apiService.getAllUsers()
      if (response.success && response.data) {
        setUsers(response.data)
        setFilteredUsers(response.data)
      } else {
        setError(response.error || '加载用户失败')
      }
    } catch (error) {
      setError('网络错误')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.password || !newUser.realName) {
      setError('请填写必填字段')
      return
    }

    try {
      const response = await apiService.createUser(newUser)
      if (response.success) {
        setSuccess('用户创建成功')
        setShowAddModal(false)
        setNewUser({
          username: '',
          password: '',
          realName: '',
          role: 'STUDENT',
          email: '',
          studentId: ''
        })
        loadUsers()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(response.error || '创建用户失败')
      }
    } catch (error) {
      setError('网络错误')
    }
  }

  const handleToggleUserStatus = async (userId: number, isActive: boolean) => {
    try {
      const response = await apiService.updateUserStatus(userId, !isActive)
      if (response.success) {
        setSuccess(isActive ? '用户已禁用' : '用户已启用')
        loadUsers()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(response.error || '操作失败')
      }
    } catch (error) {
      setError('网络错误')
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('确定要删除这个用户吗？此操作不可撤销。')) {
      return
    }

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

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800'
      case 'TEACHER': return 'bg-blue-100 text-blue-800'
      case 'STUDENT': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'ADMIN': return '管理员'
      case 'TEACHER': return '教师'
      case 'STUDENT': return '学生'
      default: return role
    }
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
                <h1 className="text-xl font-bold text-gray-900">成绩管理系统 - 管理员端</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-700">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                <span>{user?.realName} (管理员)</span>
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
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">用户管理</h2>
                <p className="text-gray-600">管理系统用户和权限</p>
              </div>
              <Button onClick={() => setShowAddModal(true)} className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faUserPlus} />
                <span>添加用户</span>
              </Button>
            </div>
          </FadeIn>

          {/* 搜索栏 */}
          <SlideIn direction="up" delay={0.2}>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="搜索用户名、姓名或邮箱..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>
          </SlideIn>

          {/* 用户列表 */}
          <SlideIn direction="up" delay={0.3}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faUsers} className="text-blue-600" />
                  <span>用户列表</span>
                </CardTitle>
                <CardDescription>
                  系统中所有用户的信息和管理
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
                      <FontAwesomeIcon icon={faCheck} className="text-green-600" />
                      <span className="text-green-700">{success}</span>
                    </div>
                  </div>
                )}

                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <FontAwesomeIcon icon={faUsers} className="text-gray-400 text-4xl mb-4" />
                    <p className="text-gray-500">暂无用户数据</p>
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
                          <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">学号</th>
                          <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">状态</th>
                          <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user, index) => (
                          <tr key={`user-${user.id || index}`} className="hover:bg-gray-50">
                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                              {user.username}
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                              {user.realName}
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                                {getRoleText(user.role)}
                              </span>
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                              {user.email || '-'}
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                              {user.studentId || '-'}
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.isActive ? '活跃' : '禁用'}
                              </span>
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-sm">
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() => handleToggleUserStatus(user.id, user.isActive!)}
                                  size="sm"
                                  variant="outline"
                                  className="flex items-center space-x-1"
                                >
                                  <FontAwesomeIcon icon={user.isActive ? faToggleOff : faToggleOn} />
                                  <span>{user.isActive ? '禁用' : '启用'}</span>
                                </Button>
                                <Button
                                  onClick={() => handleDeleteUser(user.id)}
                                  size="sm"
                                  variant="outline"
                                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                  <span>删除</span>
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
      </main>

      {/* 添加用户模态框 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>添加新用户</CardTitle>
              <CardDescription>创建新的系统用户</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">用户名 *</Label>
                  <Input
                    id="username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">密码 *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="realName">姓名 *</Label>
                  <Input
                    id="realName"
                    value={newUser.realName}
                    onChange={(e) => setNewUser({...newUser, realName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">角色</Label>
                  <select
                    id="role"
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="STUDENT">学生</option>
                    <option value="TEACHER">教师</option>
                    <option value="ADMIN">管理员</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="studentId">学号</Label>
                  <Input
                    id="studentId"
                    value={newUser.studentId}
                    onChange={(e) => setNewUser({...newUser, studentId: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  取消
                </Button>
                <Button onClick={handleAddUser}>
                  创建用户
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}