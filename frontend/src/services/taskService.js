import api from './api'

export const taskService = {
  getAllTasks: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.status) params.append('status', filters.status)
    if (filters.priority) params.append('priority', filters.priority)
    if (filters.assignee) params.append('assignee', filters.assignee)
    
    const response = await api.get(`/tasks?${params.toString()}`)
    return response.data
  },
  
  getMyTasks: async () => {
    const response = await api.get('/tasks/my-tasks')
    return response.data
  },
  
  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`)
    return response.data
  },
  
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData)
    return response.data
  },
  
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData)
    return response.data
  },
  
  deleteTask: async (id) => {
    await api.delete(`/tasks/${id}`)
  },
}

export const fileService = {
  uploadFile: async (taskId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('taskId', taskId)
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
  
  downloadFile: async (fileId) => {
    const response = await api.get(`/files/${fileId}`, {
      responseType: 'blob',
    })
    return response.data
  },
  
  deleteFile: async (fileId) => {
    await api.delete(`/files/${fileId}`)
  },
}

