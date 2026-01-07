const TaskCard = ({ task, onEdit, onDelete, onView }) => {
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

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 rounded-2xl border border-gray-100/80 dark:border-gray-700/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 p-6 flex flex-col gap-4 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white leading-tight truncate">
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {task.description}
            </p>
          )}
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
        <span className={`px-3 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
          Priority: {task.priority}
        </span>
        {task.dueDate && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V5m8 2V5m-9 8h10M5 9h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z" />
            </svg>
            Due {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
        {task.assignedToFirstName && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A4 4 0 017 17h10a4 4 0 011.879.804M15 11a3 3 0 10-6 0 3 3 0 006 0z" />
            </svg>
            {task.assignedToFirstName} {task.assignedToLastName}
          </span>
        )}
      </div>

      {task.files && task.files.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-4.553a1.414 1.414 0 10-2-2L13 8m-2 2l-4.553 4.553a1.414 1.414 0 102 2L11 14m2-2l-2-2" />
          </svg>
          <p>{task.files.length} file{task.files.length > 1 ? 's' : ''} attached</p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
        {onView && (
          <button
            onClick={() => onView(task)}
            className="flex-1 min-w-[90px] inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-full shadow-sm hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
          >
            <span>View</span>
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(task)}
            className="flex-1 min-w-[90px] inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md hover:shadow-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
          >
            <span>Edit</span>
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(task.id)}
            className="min-w-[90px] inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-red-600 dark:text-red-300 bg-red-50/90 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/60 rounded-full shadow-sm hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-500/70"
          >
            <span>Delete</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default TaskCard

