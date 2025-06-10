<template>
  <div class="flex h-screen bg-dark-bg text-dark-text dark">
    <Sidebar />
    
    <!-- Main Content Area -->
    <div class="flex-1 overflow-y-auto lg:ml-64 transition-all duration-300">
      <!-- Header -->
      <header class="bg-dark-surface-2/95 backdrop-blur-md p-4 border-b border-dark-border-2 shadow-lg sticky top-0 z-10">
        <div class="flex items-center justify-between">
          <!-- Mobile Menu Space -->
          <div class="lg:hidden w-12"></div>
          
          <!-- Title -->
          <h1 class="text-xl font-semibold tracking-wide flex items-center">
            <span class="mr-2">🚢</span>
            <span class="bg-gradient-to-r from-gradient-orange to-gradient-purple bg-clip-text text-transparent">
              AI Shipment ETA Predictor
            </span>
          </h1>
          
          <!-- Header Actions -->
          <div class="flex items-center space-x-4">
            <!-- Date Display -->
            <div class="hidden sm:flex items-center text-sm text-dark-text-3 bg-dark-surface-3 px-3 py-1 rounded-lg border border-dark-border">
              <Calendar class="h-4 w-4 mr-2" />
              {{ new Date().toLocaleDateString('en-ZA', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              }) }}
            </div>
            
            <!-- Notifications -->
            <button class="relative p-2 text-dark-text-3 hover:text-dark-text-2 hover:bg-dark-surface-3 rounded-lg transition-colors">
              <Bell class="h-5 w-5" />
              <span class="absolute -top-1 -right-1 h-3 w-3 bg-status-error rounded-full animate-pulse"></span>
            </button>
            
            <!-- User Avatar -->
            <div class="relative group">
              <div class="h-8 w-8 bg-gradient-to-r from-gradient-orange to-gradient-purple rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow">
                <span class="text-xs font-bold text-white">RK</span>
              </div>
              
              <!-- Dropdown Menu -->
              <div class="absolute right-0 mt-2 w-48 bg-dark-surface-3 border border-dark-border-2 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
                <div class="p-3 border-b border-dark-border">
                  <p class="text-sm font-medium text-dark-text-2">Ruwain Kelly</p>
                  <p class="text-xs text-dark-text-4">System Administrator</p>
                </div>
                <div class="p-1">
                  <button class="w-full text-left px-3 py-2 text-sm text-dark-text-3 hover:bg-dark-surface rounded-lg transition-colors">
                    Profile Settings
                  </button>
                  <button class="w-full text-left px-3 py-2 text-sm text-dark-text-3 hover:bg-dark-surface rounded-lg transition-colors">
                    Preferences
                  </button>
                  <div class="border-t border-dark-border my-1"></div>
                  <button class="w-full text-left px-3 py-2 text-sm text-status-error hover:bg-dark-surface rounded-lg transition-colors">
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Main Content -->
      <main class="p-4 sm:p-6 space-y-6 min-h-screen bg-dark-bg">
        <!-- Breadcrumb -->
        <div class="flex items-center space-x-2 text-sm text-dark-text-4">
          <Home class="h-4 w-4" />
          <ChevronRight class="h-4 w-4" />
          <span class="text-dark-text-3 capitalize">{{ currentPage }}</span>
        </div>
        
        <!-- Page Content -->
        <div class="animate-fade-in">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Calendar, Bell, Home, ChevronRight } from 'lucide-vue-next'
import Sidebar from './Sidebar.vue'

const route = useRoute()

const currentPage = computed(() => {
  const path = route.path.slice(1) || 'dashboard'
  return path.charAt(0).toUpperCase() + path.slice(1)
})
</script>

<style scoped>
/* Custom scrollbar for dark theme */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
}

::-webkit-scrollbar-thumb {
  background: #404040;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
