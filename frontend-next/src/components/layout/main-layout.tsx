'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faHome, 
  faGraduationCap, 
  faChalkboardTeacher, 
  faUserShield, 
  faChartBar, 
  faBook, 
  faUsers, 
  faSignOutAlt,
  faBars,
  faTimes,
  faCog,
  faUser,
  faBell,
  faSearch
} from '@fortawesome/free-solid-svg-icons'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // 如果是登录页面，不显示布局
  if (pathname === '/login') {
    return <>{children}</>
  }

  const navigationItems = [
    {
      title: '仪表板',
      href: '/dashboard',
      icon: faHome,
      description: '查看概览信息'
    },
    {
      title: '我的成绩',
      href: '/grades',
      icon: faChartBar,
      description: '查看成绩信息',
      role: 'STUDENT'
    },
    {
      title: '成绩录入',
      href: '/teacher/grade-entry',
      icon: faChalkboardTeacher,
      description: '录入学生成绩',
      role: 'TEACHER'
    },
    {
      title: '课程管理',
      href: '/teacher/courses',
      icon: faBook,
      description: '管理课程信息',
      role: 'TEACHER'
    },
    {
      title: '用户管理',
      href: '/admin/user-management',
      icon: faUsers,
      description: '管理系统用户',
      role: 'ADMIN'
    },
    {
      title: '系统设置',
      href: '/admin/settings',
      icon: faUserShield,
      description: '系统配置',
      role: 'ADMIN'
    }
  ]

  const filteredNavigationItems = navigationItems.filter(item => 
    !item.role || item.role === user?.role
  )

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white border-r border-slate-200">
      <div className="flex items-center justify-center h-16 px-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <FontAwesomeIcon icon={faGraduationCap} className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">成绩管理系统</h1>
            <p className="text-xs text-gray-500">
              {user?.role === 'STUDENT' && '学生端'}
              {user?.role === 'TEACHER' && '教师端'}
              {user?.role === 'ADMIN' && '管理员端'}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {filteredNavigationItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "default" : "ghost"}
            className={`w-full justify-start h-11 px-3 text-left ${
              pathname === item.href 
                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
            onClick={() => {
              window.location.href = item.href
              setSidebarOpen(false)
            }}
          >
            <FontAwesomeIcon icon={item.icon} className="mr-3 h-4 w-4 flex-shrink-0" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{item.title}</span>
              <span className="text-xs opacity-70">{item.description}</span>
            </div>
          </Button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 bg-white/80 backdrop-blur-sm">
        <Card className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center space-x-3 p-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                <FontAwesomeIcon icon={faUser} className="text-white text-sm" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.realName}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {user?.role === 'STUDENT' && '学生'}
                {user?.role === 'TEACHER' && '教师'}
                {user?.role === 'ADMIN' && '管理员'}
              </p>
            </div>
          </div>
        </Card>
        <Button
          variant="outline"
          size="sm"
          className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={logout}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 h-4 w-4" />
          退出登录
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl">
          <Sidebar />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top navigation */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden hover:bg-gray-100"
                onClick={() => setSidebarOpen(true)}
              >
                <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
              </Button>
              <div className="ml-4 lg:ml-0">
                <h1 className="text-xl font-bold text-gray-900">
                  {filteredNavigationItems.find(item => item.href === pathname)?.title || '页面'}
                </h1>
                <p className="text-sm text-gray-500">
                  {filteredNavigationItems.find(item => item.href === pathname)?.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <FontAwesomeIcon icon={faSearch} className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <FontAwesomeIcon icon={faBell} className="h-4 w-4" />
              </Button>
              <div className="hidden sm:flex sm:items-center sm:space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faUser} className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user?.realName}</p>
                    <p className="text-xs text-gray-500">
                      {user?.role === 'STUDENT' && '学生'}
                      {user?.role === 'TEACHER' && '教师'}
                      {user?.role === 'ADMIN' && '管理员'}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="sm:hidden border-red-200 text-red-600 hover:bg-red-50"
                onClick={logout}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}