<template>
  <aside 
    :class="[
      'w-64 h-screen bg-dark-surface-2 border-r border-dark-border-2 fixed top-0 left-0 z-30 text-dark-text overflow-y-auto flex flex-col transition-transform duration-300 ease-in-out',
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Mobile Menu Toggle -->
    <button 
      @click="toggleMobileMenu"
      class="lg:hidden fixed top-4 left-4 z-40 p-2 bg-dark-surface-3 border border-dark-border rounded-lg hover:bg-dark-surface transition-colors"
    >
      <Menu v-if="!isMobileMenuOpen" class="h-5 w-5 text-dark-text-2" />
      <X v-else class="h-5 w-5 text-dark-text-2" />
    </button>

    <!-- Mobile Overlay -->
    <div 
      v-if="isMobileMenuOpen" 
      @click="closeMobileMenu"
      class="lg:hidden fixed inset-0 bg-black/50 z-20"
    ></div>

    <!-- Logo -->
    <div class="text-2xl font-bold mb-8 tracking-wide flex items-center justify-center border-b border-dark-border-2 pb-4 mt-4 px-4">
      <span class="text-gradient-orange">📦</span>
      <span class="ml-2 bg-gradient-to-r from-gradient-orange to-gradient-purple bg-clip-text text-transparent">
        ETA Predictor
      </span>
    </div>
    
    <!-- Navigation -->
    <nav class="space-y-1 flex-1 px-3">
      <button
        v-for="item in navigationItems"
        :key="item.path"
        @click="navigateTo(item.path)"
        class="flex items-center w-full px-3 py-3 rounded-lg transition-all duration-200 hover:bg-dark-surface-3 group relative text-left"
        :class="{ 
          'bg-gradient-to-r from-gradient-orange/20 to-gradient-purple/20 border-l-4 border-gradient-orange text-dark-text shadow-lg': isActiveRoute(item.path),
          'text-dark-text-3 hover:text-dark-text-2': !isActiveRoute(item.path)
        }"
      >
        <component 
          :is="item.icon" 
          :class="[
            'h-5 w-5 mr-3 transition-colors duration-200',
            isActiveRoute(item.path) ? 'text-gradient-orange' : 'text-dark-text-4 group-hover:text-dark-text-2'
          ]" 
        />
        <span class="font-medium">{{ item.name }}</span>
        
        <!-- Active indicator -->
        <div 
          v-if="isActiveRoute(item.path)"
          class="absolute right-3 w-2 h-2 bg-gradient-orange rounded-full animate-pulse"
        ></div>
      </button>
    </nav>

    <!-- AI Status Box -->
    <div class="mt-auto mb-4 mx-3">
      <div class="bg-dark-surface-3 border border-dark-border-2 rounded-lg p-4 hover:border-status-success/50 transition-colors">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-dark-text-3">AI Status</span>
          <div class="relative">
            <div class="h-2 w-2 bg-status-success rounded-full animate-pulse"></div>
            <div class="absolute -top-1 -left-1 h-4 w-4 bg-status-success/30 rounded-full animate-ping"></div>
          </div>
        </div>
        <div class="text-lg font-bold text-status-success">94.2% Accuracy</div>
        <div class="text-xs text-dark-text-4 mt-1">Real-time predictions</div>
      </div>
    </div>

    <!-- Theme Toggle -->
    <div class="border-t border-dark-border-2 pt-4 px-3 pb-4">
      <button 
        @click="toggleTheme"
        class="flex items-center w-full px-3 py-2 rounded-lg hover:bg-dark-surface-3 transition-colors duration-200 group"
      >
        <Moon v-if="!isDark" class="h-4 w-4 mr-3 text-dark-text-4 group-hover:text-dark-text-2" />
        <Sun v-else class="h-4 w-4 mr-3 text-gradient-orange group-hover:text-gradient-purple" />
        <span class="text-sm text-dark-text-3 group-hover:text-dark-text-2">
          {{ isDark ? 'Light' : 'Dark' }} Mode
        </span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  BarChart3, 
  Users, 
  Package, 
  Building2, 
  TrendingUp, 
  MapPin,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const isDark = ref(true)
const isMobileMenuOpen = ref(false)

const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
  { name: 'Clients', path: '/clients', icon: Users },
  { name: 'Shipments', path: '/shipments', icon: Package },
  { name: 'Vendors', path: '/vendors', icon: Building2 },
  { name: 'Analytics', path: '/analytics', icon: TrendingUp },
  { name: 'Tracker', path: '/tracker', icon: MapPin },
]

const isActiveRoute = (path) => {
  if (path === '/dashboard') {
    return route.path === '/dashboard' || route.path === '/'
  }
  return route.path === path
}

const navigateTo = (path) => {
  router.push(path)
  closeMobileMenu()
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark')
  
  // Store theme preference
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// Handle window resize
const handleResize = () => {
  if (window.innerWidth >= 1024) {
    isMobileMenuOpen.value = false
  }
}

onMounted(() => {
  // Load theme preference
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    }
  }
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.router-link-active {
  background-color: #1e88e5 !important;
  color: white !important;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #1c1c1c;
}

::-webkit-scrollbar-thumb {
  background: #404040;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>