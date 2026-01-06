import { useState, useRef } from 'react'
import { fileService } from '../services/taskService'

const FileUpload = ({ taskId, onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    handleFiles(files)
  }

  const handleFiles = async (files) => {
    for (const file of files) {
      try {
        setUploading(true)
        await fileService.uploadFile(taskId, file)
        if (onUploadSuccess) {
          onUploadSuccess()
        }
      } catch (error) {
        console.error('File upload failed:', error)
        alert(`Failed to upload ${file.name}`)
      } finally {
        setUploading(false)
      }
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

  const handleDelete = async (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await fileService.deleteFile(fileId)
        if (onUploadSuccess) {
          onUploadSuccess()
        }
      } catch (error) {
        console.error('File delete failed:', error)
        alert('Failed to delete file')
      }
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
            : 'border-gray-300 dark:border-gray-600'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Drag and drop files here, or
        </p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Select Files'}
        </button>
      </div>
    </div>
  )
}

export default FileUpload

