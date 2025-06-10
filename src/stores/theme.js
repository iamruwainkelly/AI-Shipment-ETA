import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // State
  const isDarkMode = ref(
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  )

  // Getters
  const theme = computed(() => isDarkMode.value ? 'dark' : 'light')
  const opposite = computed(() => isDarkMode.value ? 'light' : 'dark')

  // Actions
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    updateTheme()
  }

  const setTheme = (newTheme) => {
    isDarkMode.value = newTheme === 'dark'
    updateTheme()
  }

  const updateTheme = () => {
    const root = document.documentElement
    
    if (isDarkMode.value) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  // Initialize theme on store creation
  const initializeTheme = () => {
    updateTheme()
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        isDarkMode.value = e.matches
        updateTheme()
      }
    })
  }

  return {
    isDarkMode,
    theme,
    opposite,
    toggleTheme,
    setTheme,
    initializeTheme
  }
})
