import { useState, useEffect } from 'react'
import { taskService, fileService } from '../services/taskService'
import FileUpload from './FileUpload'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'

const TaskDetail = ({ task: initialTask, users, onClose, onEdit, onDelete }) => {
  const [task, setTask] = useState(initialTask)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTaskDetails()
  }, [initialTask.id])

  const fetchTaskDetails = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await taskService.getTaskById(initialTask.id)
      setTask(data)
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to fetch task details'
      setError(errorMsg)
      console.error('Failed to fetch task details:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (fileId, fileName) => {
    try {
      const blob = await fileService.downloadFile(fileId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('File download failed:', error)
      alert('Failed to download file')
    }
  }

  const handleDeleteFile = async (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await fileService.deleteFile(fileId)
        fetchTaskDetails()
      } catch (error) {
        console.error('File delete failed:', error)
        alert('Failed to delete file')
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'DONE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {error && <ErrorMessage message={error} onClose={() => setError('')} />}
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{task.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>

            {task.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h3>
                <p className="text-gray-900 dark:text-white">{task.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {task.dueDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</h3>
                  <p className="text-gray-900 dark:text-white">{new Date(task.dueDate).toLocaleDateString()}</p>
                </div>
              )}
              {task.assignedToFirstName && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assigned To</h3>
                  <p className="text-gray-900 dark:text-white">
                    {task.assignedToFirstName} {task.assignedToLastName}
                  </p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Created By</h3>
              <p className="text-gray-900 dark:text-white">
                {task.createdByFirstName} {task.createdByLastName}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Attachments</h3>
              <FileUpload taskId={task.id} onUploadSuccess={fetchTaskDetails} />
              
              {task.files && task.files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {task.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{file.originalFileName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(file.fileSize / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownload(file.id, file.originalFileName)}
                          className="px-3 py-1 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onEdit}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDetail

