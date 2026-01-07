import Navbar from './Navbar'
import { useThemeStore } from '../store/themeStore'
import { useEffect } from 'react'

const Layout = ({ children }) => {
  const { initTheme } = useThemeStore()

  useEffect(() => {
    initTheme()
  }, [initTheme])

  return (
    <div className="app-background">
      <div className="app-background-inner min-h-screen bg-gray-50/70 dark:bg-gray-900/80 backdrop-blur-sm transition-colors duration-200">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout

