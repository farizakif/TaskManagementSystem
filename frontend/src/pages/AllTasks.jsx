import { useState, useEffect } from 'react'
import { taskService } from '../services/taskService'
import { userService } from '../services/userService'
import TaskList from '../components/TaskList'
import TaskForm from '../components/TaskForm'
import TaskDetail from '../components/TaskDetail'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { useDebounce } from '../hooks/useDebounce'

const AllTasks = () => {
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({})
  const debouncedSearch = useDebounce(searchTerm, 300)

  useEffect(() => {
    fetchTasks()
    fetchUsers()
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [debouncedSearch, filters])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError('')
      const params = {
        search: debouncedSearch || undefined,
        status: filters.status || undefined,
        priority: filters.priority || undefined,
        assignee: filters.assignee || undefined,
      }
      const data = await taskService.getAllTasks(params)
      setTasks(data)
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to fetch tasks'
      setError(errorMsg)
      console.error('Failed to fetch tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers()
      setUsers(data)
    } catch (err) {
      console.error('Failed to fetch users:', err)
    }
  }

  const handleCreate = () => {
    setEditingTask(null)
    setShowForm(true)
    setShowDetail(false)
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setShowForm(true)
    setShowDetail(false)
  }

  const handleView = (task) => {
    setSelectedTask(task)
    setShowDetail(true)
    setShowForm(false)
  }

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setError('')
        await taskService.deleteTask(taskId)
        fetchTasks()
      } catch (err) {
        const errorMsg = err.response?.data?.error || err.message || 'Failed to delete task'
        setError(errorMsg)
        console.error('Failed to delete task:', err)
      }
    }
  }

  const handleSave = async (taskData) => {
    try {
      setSaving(true)
      setError('')
      if (editingTask) {
        await taskService.updateTask(editingTask.id, taskData)
      } else {
        await taskService.createTask(taskData)
      }
      setShowForm(false)
      setEditingTask(null)
      fetchTasks()
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.errors 
        ? JSON.stringify(err.response.data.errors || err.response.data.error)
        : err.message || 'Failed to save task'
      setError(errorMsg)
      console.error('Failed to save task:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingTask(null)
  }

  const handleCloseDetail = () => {
    setShowDetail(false)
    setSelectedTask(null)
    fetchTasks()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Tasks</h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Create Task
        </button>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {editingTask ? 'Edit Task' : 'Create Task'}
            </h3>
            <TaskForm
              task={editingTask}
              users={users}
              onSave={handleSave}
              onCancel={handleCloseForm}
              loading={saving}
            />
          </div>
        </div>
      )}

      {showDetail && selectedTask && (
        <TaskDetail
          task={selectedTask}
          users={users}
          onClose={handleCloseDetail}
          onEdit={() => {
            setShowDetail(false)
            handleEdit(selectedTask)
          }}
          onDelete={() => {
            setShowDetail(false)
            handleDelete(selectedTask.id)
          }}
        />
      )}

      <TaskList
        tasks={tasks}
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        loading={loading}
        onSearch={setSearchTerm}
        onFilterChange={setFilters}
      />
    </div>
  )
}

export default AllTasks

