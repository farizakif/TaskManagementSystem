import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useThemeStore = create(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () => {
        set((state) => {
          const newIsDark = !state.isDark
          if (newIsDark) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          return { isDark: newIsDark }
        })
      },
      initTheme: () => {
        const isDark = localStorage.getItem('theme-storage')
          ? JSON.parse(localStorage.getItem('theme-storage')).state.isDark
          : false
        if (isDark) {
          document.documentElement.classList.add('dark')
        }
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export { useThemeStore }

