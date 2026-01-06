import { useState } from 'react'

const TaskFilter = ({ onFilterChange, users = [] }) => {
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignee: '',
  })

  const handleChange = (field, value) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = { status: '', priority: '', assignee: '' }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm p-4 md:p-5 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
            Priority
          </label>
          <select
            value={filters.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
            Assignee
          </label>
          <select
            value={filters.assignee}
            onChange={(e) => handleChange('assignee', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="">All Assignees</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex sm:justify-end">
          <button
            onClick={clearFilters}
            className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskFilter

