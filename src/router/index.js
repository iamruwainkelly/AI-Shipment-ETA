import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import ClientsPageEnhanced from '@/views/ClientsPageEnhanced.vue'
import ShipmentsPageEnhanced from '@/views/ShipmentsPageEnhanced.vue'
import VendorsPageEnhanced from '@/views/VendorsPageEnhanced.vue'
import Analytics from '@/views/Analytics.vue'
import Tracker from '@/views/Tracker.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { 
    path: '/dashboard', 
    component: Dashboard,
    meta: { title: 'Dashboard - AI Shipment ETA Predictor' }
  },
  { 
    path: '/clients', 
    component: ClientsPageEnhanced,
    meta: { title: 'Clients - AI Shipment ETA Predictor' }
  },
  { 
    path: '/shipments', 
    component: ShipmentsPageEnhanced,
    meta: { title: 'Shipments - AI Shipment ETA Predictor' }
  },
  { 
    path: '/vendors', 
    component: VendorsPageEnhanced,
    meta: { title: 'Vendors - AI Shipment ETA Predictor' }
  },
  { 
    path: '/analytics', 
    component: Analytics,
    meta: { title: 'Analytics - AI Shipment ETA Predictor' }
  },
  { 
    path: '/tracker', 
    component: Tracker,
    meta: { title: 'Tracker - AI Shipment ETA Predictor' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Add title management
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
