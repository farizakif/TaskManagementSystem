import { useForm } from 'react-hook-form'
import { useEffect } from 'react'

const TaskForm = ({ task, users = [], onSave, onCancel, loading = false }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: task || {
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: '',
      assignedToId: '',
    },
  })

  useEffect(() => {
    if (task) {
      reset({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'TODO',
        priority: task.priority || 'MEDIUM',
        dueDate: task.dueDate || '',
        assignedToId: task.assignedToId || '',
      })
    }
  }, [task, reset])

  const onSubmit = (data) => {
    const taskData = {
      ...data,
      assignedToId: data.assignedToId ? parseInt(data.assignedToId) : null,
    }
    onSave(taskData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-1">
        <label htmlFor="title" className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          {...register('title', { required: 'Title is required' })}
          type="text"
          id="title"
          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.title && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
          Description
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows="4"
          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="status" className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            {...register('status', { required: 'Status is required' })}
            id="status"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          {errors.status && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.status.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="priority" className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
            Priority <span className="text-red-500">*</span>
          </label>
          <select
            {...register('priority', { required: 'Priority is required' })}
            id="priority"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
          {errors.priority && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.priority.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
            Due Date
          </label>
          <input
            {...register('dueDate')}
            type="date"
            id="dueDate"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="assignedToId" className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
            Assign To
          </label>
          <select
            {...register('assignedToId')}
            id="assignedToId"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100/90 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full border border-gray-200/80 dark:border-gray-600/80 shadow-sm hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400/60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md hover:shadow-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : task ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}

export default TaskForm

