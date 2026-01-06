import TaskCard from './TaskCard'
import TaskFilter from './TaskFilter'
import LoadingSpinner from './LoadingSpinner'

const TaskList = ({ tasks, users, onEdit, onDelete, onView, loading, onSearch, onFilterChange }) => {

  if (loading) {
    return <LoadingSpinner size="xl" />
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No tasks found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {onSearch && (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-gray-400 dark:text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search tasks..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-transparent px-1 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>
      )}

      {onFilterChange && <TaskFilter onFilterChange={onFilterChange} users={users} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        ))}
      </div>
    </div>
  )
}

export default TaskList

