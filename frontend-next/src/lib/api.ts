import { 
  LoginRequest, 
  LoginResponse, 
  Grade, 
  User, 
  Course, 
  Student,
  ApiResponse,
  GradeStatistics 
} from '@/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

class ApiService {
  private getAuthHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  }

  private async handleApiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try{
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers
        }
      })

      // 处理 HTTP 错误
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.message || errorData.error || `请求失败 (${response.status})`
        
        // 处理特定错误状态
        if (response.status === 401) {
          // 清除过期token
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
          }
          return { success: false, error: '登录已过期，请重新登录' }
        }
        
        if (response.status === 403) {
          return { success: false, error: '权限不足' }
        }
        
        if (response.status === 404) {
          return { success: false, error: '资源不存在' }
        }
        
        if (response.status >= 500) {
          return { success: false, error: '服务器内部错误' }
        }
        
        return { success: false, error: errorMessage }
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      // 处理网络错误
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return { success: false, error: '网络连接失败，请检查网络设置' }
      }
      
      // 处理其他错误
      console.error('API调用错误:', error)
      return { success: false, error: '网络错误，请稍后重试' }
    }
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.handleApiCall<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
  }

  async register(userData: {
    username: string;
    email: string;
    realName: string;
    password: string;
  }): Promise<ApiResponse<any>> {
    return this.handleApiCall<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  }

  async getStudentGrades(): Promise<ApiResponse<Grade[]>> {
    return this.handleApiCall<Grade[]>('/student/grades')
  }

  async getTeacherGrades(): Promise<ApiResponse<Grade[]>> {
    return this.handleApiCall<Grade[]>('/teacher/grades')
  }

  async getAdminGrades(): Promise<ApiResponse<Grade[]>> {
    return this.handleApiCall<Grade[]>('/admin/grades')
  }

  async getGradesByRole(role: string): Promise<ApiResponse<Grade[]>> {
    switch (role) {
      case 'STUDENT':
        return this.getStudentGrades()
      case 'TEACHER':
        return this.getTeacherGrades()
      case 'ADMIN':
        return this.getAdminGrades()
      default:
        return { success: false, error: '无效的角色' }
    }
  }

  async getCourses(): Promise<ApiResponse<Course[]>> {
    return this.handleApiCall<Course[]>('/courses')
  }

  async getStudents(): Promise<ApiResponse<Student[]>> {
    return this.handleApiCall<Student[]>('/students')
  }

  async updateGrade(gradeId: number, score: number): Promise<ApiResponse<Grade>> {
    return this.handleApiCall<Grade>(`/grades/${gradeId}`, {
      method: 'PUT',
      body: JSON.stringify({ score })
    })
  }

  async getGradeStatistics(): Promise<ApiResponse<GradeStatistics>> {
    return this.handleApiCall<GradeStatistics>('/grades/statistics')
  }

  // 教师相关API
  async getTeacherCourses(): Promise<ApiResponse<Course[]>> {
    return this.handleApiCall<Course[]>('/teacher/courses')
  }

  async getStudentsByCourse(courseName: string): Promise<ApiResponse<Student[]>> {
    const encodedCourseName = encodeURIComponent(courseName)
    return this.handleApiCall<Student[]>(`/teacher/courses/${encodedCourseName}/students`)
  }

  async getGradesByCourse(courseName: string): Promise<ApiResponse<Grade[]>> {
    const encodedCourseName = encodeURIComponent(courseName)
    return this.handleApiCall<Grade[]>(`/teacher/courses/${encodedCourseName}/grades`)
  }

  async saveGrade(gradeData: any): Promise<ApiResponse<any>> {
    return this.handleApiCall<any>('/teacher/grades', {
      method: 'POST',
      body: JSON.stringify(gradeData)
    })
  }

  async saveGradesBatch(gradesData: any[]): Promise<ApiResponse<any>> {
    return this.handleApiCall<any>('/teacher/grades/batch', {
      method: 'POST',
      body: JSON.stringify(gradesData)
    })
  }

  // 管理员相关API
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    const response = await this.handleApiCall<any[]>('/admin/users')
    if (response.success && response.data) {
      // 转换后端数据格式到前端格式
      const users = response.data.map((user: any) => ({
        id: user.id,
        username: user.username,
        realName: user.realName,
        role: user.role,
        email: user.email,
        phone: user.phone,
        studentId: user.studentId,
        isActive: user.isActive
      }))
      return { success: true, data: users }
    }
    return response
  }

  async createUser(userData: any): Promise<ApiResponse<any>> {
    // 转换前端数据格式到后端格式
    const backendUserData = {
      username: userData.username,
      password: userData.password,
      realName: userData.realName,
      role: userData.role,
      email: userData.email,
      phone: userData.phone,
      studentId: userData.studentId
    }

    const response = await this.handleApiCall<any>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(backendUserData)
    })

    if (response.success && response.data) {
      // 转换返回的数据到前端格式
      const frontendUser = {
        id: response.data.id,
        username: response.data.username,
        realName: response.data.realName,
        role: response.data.role,
        email: response.data.email,
        phone: response.data.phone,
        studentId: response.data.studentId,
        isActive: response.data.isActive
      }
      return { success: true, data: frontendUser }
    }
    return response
  }

  async updateUserStatus(userId: number, isActive: boolean): Promise<ApiResponse<any>> {
    return this.handleApiCall<any>(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isActive })
    })
  }

  async deleteUser(userId: number): Promise<ApiResponse<any>> {
    return this.handleApiCall<any>(`/admin/users/${userId}`, {
      method: 'DELETE'
    })
  }
}

export const apiService = new ApiService()