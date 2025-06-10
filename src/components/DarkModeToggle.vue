<template>
  <button
    @click="toggleTheme"
    :aria-label="`Switch to ${themeStore.opposite} mode`"
    class="theme-toggle-button"
    :class="themeStore.theme"
  >
    <div class="toggle-container">
      <!-- Sun Icon -->
      <Sun 
        v-if="!themeStore.isDarkMode" 
        class="icon sun-icon" 
        :class="{ 'active': !themeStore.isDarkMode }"
      />
      
      <!-- Moon Icon -->
      <Moon 
        v-if="themeStore.isDarkMode" 
        class="icon moon-icon" 
        :class="{ 'active': themeStore.isDarkMode }"
      />
      
      <!-- Background Circle -->
      <div class="toggle-bg" :class="themeStore.theme"></div>
    </div>
    
    <!-- Tooltip -->
    <div class="tooltip" :class="themeStore.theme">
      Switch to {{ themeStore.opposite }} mode
    </div>
  </button>
</template>

<script setup>
import { Sun, Moon } from 'lucide-vue-next'
import { useThemeStore } from '../stores/theme'

const themeStore = useThemeStore()

const toggleTheme = () => {
  themeStore.toggleTheme()
}
</script>

<style scoped>
.theme-toggle-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
  overflow: hidden;
}

.theme-toggle-button:hover {
  transform: scale(1.05);
}

.theme-toggle-button:active {
  transform: scale(0.95);
}

.toggle-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-bg {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.toggle-bg.light {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  box-shadow: 
    0 4px 15px rgba(251, 191, 36, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.toggle-bg.dark {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  box-shadow: 
    0 4px 15px rgba(15, 23, 42, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.icon {
  position: relative;
  z-index: 2;
  width: 24px;
  height: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sun-icon {
  color: #f59e0b;
  animation: sunRotate 20s linear infinite;
  filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.4));
}

.moon-icon {
  color: #cbd5e1;
  animation: moonGlow 3s ease-in-out infinite alternate;
  filter: drop-shadow(0 0 8px rgba(203, 213, 225, 0.4));
}

.icon.active {
  transform: scale(1.1);
}

/* Tooltip */
.tooltip {
  position: absolute;
  bottom: -45px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  border-radius: 6px;
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s ease-in-out;
  z-index: 10;
}

.tooltip.light {
  background: #374151;
  color: #f9fafb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.tooltip.dark {
  background: #f9fafb;
  color: #374151;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tooltip::before {
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
}

.tooltip.light::before {
  border-bottom: 5px solid #374151;
}

.tooltip.dark::before {
  border-bottom: 5px solid #f9fafb;
}

.theme-toggle-button:hover .tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(-2px);
}

/* Animations */
@keyframes sunRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes moonGlow {
  0% {
    filter: drop-shadow(0 0 8px rgba(203, 213, 225, 0.4));
  }
  100% {
    filter: drop-shadow(0 0 12px rgba(203, 213, 225, 0.8));
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .theme-toggle-button {
    width: 44px;
    height: 44px;
  }
  
  .icon {
    width: 22px;
    height: 22px;
  }
  
  .tooltip {
    bottom: -40px;
    font-size: 11px;
    padding: 6px 10px;
  }
}

/* Focus styles for accessibility */
.theme-toggle-button:focus {
  outline: none;
}

.theme-toggle-button:focus-visible {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .theme-toggle-button,
  .toggle-bg,
  .icon,
  .tooltip {
    transition: none;
  }
  
  .sun-icon {
    animation: none;
  }
  
  .moon-icon {
    animation: none;
  }
}
</style>