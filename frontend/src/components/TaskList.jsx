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
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search tasks..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      {onFilterChange && <TaskFilter onFilterChange={onFilterChange} users={users} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

