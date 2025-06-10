<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Vendor Management</h1>
        <p class="text-gray-400">Manage vendor relationships and performance</p>
      </div>
      <button 
        @click="showCreateModal = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
      >
        <Plus class="h-4 w-4" />
        <span>Add Vendor</span>
      </button>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-[#1f1f1f] border border-gray-700 p-6 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400 mb-1">Total Vendors</p>
            <p class="text-2xl font-bold text-white">{{ vendors.length }}</p>
          </div>
          <div class="p-3 bg-blue-500/20 rounded-lg">
            <Building2 class="h-6 w-6 text-blue-400" />
          </div>
        </div>
      </div>

      <div class="bg-[#1f1f1f] border border-gray-700 p-6 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400 mb-1">Active Vendors</p>
            <p class="text-2xl font-bold text-white">{{ activeVendors }}</p>
          </div>
          <div class="p-3 bg-green-500/20 rounded-lg">
            <CheckCircle class="h-6 w-6 text-green-400" />
          </div>
        </div>
      </div>

      <div class="bg-[#1f1f1f] border border-gray-700 p-6 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400 mb-1">Avg Performance</p>
            <p class="text-2xl font-bold text-white">{{ avgPerformance }}%</p>
          </div>
          <div class="p-3 bg-yellow-500/20 rounded-lg">
            <Star class="h-6 w-6 text-yellow-400" />
          </div>
        </div>
      </div>

      <div class="bg-[#1f1f1f] border border-gray-700 p-6 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400 mb-1">Total Contracts</p>
            <p class="text-2xl font-bold text-white">${{ totalContracts }}</p>
          </div>
          <div class="p-3 bg-purple-500/20 rounded-lg">
            <DollarSign class="h-6 w-6 text-purple-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Vendors Table -->
    <div class="bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-lg">
      <div class="p-6 border-b border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-white">Vendor Directory</h3>
          <div class="flex items-center space-x-4">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Search vendors..."
                class="bg-[#0f1419] border border-gray-600 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-[#0f1419]">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Company</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contact</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Region</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Service Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Performance</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-for="vendor in filteredVendors" :key="vendor.id" class="hover:bg-[#0f1419]">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                      {{ vendor.company.charAt(0) }}
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-white">{{ vendor.company }}</div>
                    <div class="text-sm text-gray-400">{{ vendor.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-300">{{ vendor.email }}</div>
                <div class="text-sm text-gray-400">{{ vendor.phone }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-300">{{ vendor.region }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-300">{{ vendor.service_type }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-1 bg-gray-700 rounded-full h-2 mr-2">
                    <div 
                      :class="getPerformanceColor(vendor.performance_score)"
                      :style="{ width: vendor.performance_score + '%' }" 
                      class="h-2 rounded-full"
                    ></div>
                  </div>
                  <span class="text-sm text-gray-300">{{ vendor.performance_score }}%</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="getStatusClass(vendor.status)"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ vendor.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button 
                    @click="viewVendor(vendor)"
                    class="text-blue-400 hover:text-blue-300"
                  >
                    <Eye class="h-4 w-4" />
                  </button>
                  <button 
                    @click="editVendor(vendor)"
                    class="text-yellow-400 hover:text-yellow-300"
                  >
                    <Edit class="h-4 w-4" />
                  </button>
                  <button 
                    @click="deleteVendor(vendor)"
                    class="text-red-400 hover:text-red-300"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Vendor Details Modal -->
    <div v-if="selectedVendor" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-black bg-opacity-50" @click="selectedVendor = null"></div>
        <div class="relative bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl max-w-2xl w-full">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold text-white">Vendor Details</h3>
              <button @click="selectedVendor = null" class="text-gray-400 hover:text-white">
                <X class="h-6 w-6" />
              </button>
            </div>
            
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">Company</label>
                  <p class="text-white">{{ selectedVendor.company }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">Contact Person</label>
                  <p class="text-white">{{ selectedVendor.name }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  <p class="text-white">{{ selectedVendor.email }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                  <p class="text-white">{{ selectedVendor.phone }}</p>
                </div>
              </div>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">Region</label>
                  <p class="text-white">{{ selectedVendor.region }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">Service Type</label>
                  <p class="text-white">{{ selectedVendor.service_type }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">Performance Score</label>
                  <p class="text-white">{{ selectedVendor.performance_score }}%</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">Contract Value</label>
                  <p class="text-white">${{ formatCurrency(selectedVendor.contract_value) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Vendor Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-black bg-opacity-50" @click="showCreateModal = false"></div>
        <div class="relative bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl max-w-md w-full">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold text-white">Add New Vendor</h3>
              <button @click="showCreateModal = false" class="text-gray-400 hover:text-white">
                <X class="h-6 w-6" />
              </button>
            </div>
            
            <form @submit.prevent="createVendor" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">Company Name</label>
                <input
                  v-model="newVendor.company"
                  type="text"
                  required
                  class="w-full bg-[#0f1419] border border-gray-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">Contact Person</label>
                <input
                  v-model="newVendor.name"
                  type="text"
                  required
                  class="w-full bg-[#0f1419] border border-gray-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input
                  v-model="newVendor.email"
                  type="email"
                  required
                  class="w-full bg-[#0f1419] border border-gray-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">Region</label>
                <select
                  v-model="newVendor.region"
                  required
                  class="w-full bg-[#0f1419] border border-gray-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Region</option>
                  <option value="Europe">Europe</option>
                  <option value="Africa">Africa</option>
                  <option value="Asia">Asia</option>
                  <option value="Americas">Americas</option>
                </select>
              </div>
              <div class="flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  @click="showCreateModal = false"
                  class="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Create Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Building2, 
  CheckCircle, 
  Star, 
  DollarSign,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  X
} from 'lucide-vue-next'

// Reactive state
const searchTerm = ref('')
const showCreateModal = ref(false)
const selectedVendor = ref(null)

// Form data
const newVendor = ref({
  company: '',
  name: '',
  email: '',
  region: '',
  service_type: 'Freight',
  status: 'active'
})

// Sample vendor data
const vendors = ref([
  {
    id: 1,
    company: 'Global Shipping Ltd',
    name: 'John Smith',
    email: 'john@globalshipping.com',
    phone: '+27 11 234 5678',
    region: 'Europe',
    service_type: 'Sea Freight',
    performance_score: 94,
    status: 'active',
    contract_value: 2500000
  },
  {
    id: 2,
    company: 'FastTrack Logistics',
    name: 'Sarah Johnson',
    email: 'sarah@fasttrack.com',
    phone: '+49 30 123 4567',
    region: 'Europe',
    service_type: 'Air Freight',
    performance_score: 87,
    status: 'active',
    contract_value: 1800000
  },
  {
    id: 3,
    company: 'African Transport Co',
    name: 'David Mbeki',
    email: 'david@africantrans.co.za',
    phone: '+27 21 987 6543',
    region: 'Africa',
    service_type: 'Road Transport',
    performance_score: 91,
    status: 'active',
    contract_value: 1200000
  },
  {
    id: 4,
    company: 'Euro Express',
    name: 'Maria Garcia',
    email: 'maria@euroexpress.eu',
    phone: '+34 91 555 1234',
    region: 'Europe',
    service_type: 'Express Delivery',
    performance_score: 89,
    status: 'pending',
    contract_value: 950000
  }
])

// Computed properties
const filteredVendors = computed(() => {
  if (!searchTerm.value) return vendors.value
  return vendors.value.filter(vendor => 
    vendor.company.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    vendor.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const activeVendors = computed(() => {
  return vendors.value.filter(v => v.status === 'active').length
})

const avgPerformance = computed(() => {
  const total = vendors.value.reduce((sum, v) => sum + v.performance_score, 0)
  return Math.round(total / vendors.value.length)
})

const totalContracts = computed(() => {
  const total = vendors.value.reduce((sum, v) => sum + v.contract_value, 0)
  return formatCurrency(total)
})

// Utility functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const getPerformanceColor = (score) => {
  if (score >= 90) return 'bg-green-500'
  if (score >= 80) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getStatusClass = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-500/20 text-green-400'
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400'
    case 'inactive':
      return 'bg-red-500/20 text-red-400'
    default:
      return 'bg-gray-500/20 text-gray-400'
  }
}

// Actions
const viewVendor = (vendor) => {
  selectedVendor.value = vendor
}

const editVendor = (vendor) => {
  console.log('Editing vendor:', vendor.company)
  // Implement edit functionality
}

const deleteVendor = (vendor) => {
  if (confirm(`Are you sure you want to delete ${vendor.company}?`)) {
    const index = vendors.value.findIndex(v => v.id === vendor.id)
    if (index > -1) {
      vendors.value.splice(index, 1)
    }
  }
}

const createVendor = () => {
  const vendor = {
    id: vendors.value.length + 1,
    ...newVendor.value,
    performance_score: 85,
    contract_value: 1000000
  }
  
  vendors.value.push(vendor)
  showCreateModal.value = false
  
  // Reset form
  newVendor.value = {
    company: '',
    name: '',
    email: '',
    region: '',
    service_type: 'Freight',
    status: 'active'
  }
}
</script>

<style scoped>
.vendor-card {
  transition: all 0.3s ease;
}

.vendor-card:hover {
  transform: translateY(-2px);
}
</style>
