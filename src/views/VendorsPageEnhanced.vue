<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gradient mb-2">Vendor Management</h1>
        <p class="text-dark-text-3">Manage vendor relationships and performance metrics across SA & Europe</p>
      </div>
      <button 
        @click="showCreateModal = true"
        class="btn-primary flex items-center space-x-2"
      >
        <Plus class="h-4 w-4" />
        <span>Add Vendor</span>
      </button>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card group hover:scale-105 transition-all duration-300">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-dark-text-4 mb-1">Total Vendors</p>
              <p class="text-2xl font-bold text-dark-text">{{ vendors.length }}</p>
            </div>
            <div class="p-3 bg-status-info/20 rounded-lg border border-status-info/30 group-hover:bg-status-info/30 transition-colors">
              <Building2 class="h-6 w-6 text-status-info" />
            </div>
          </div>
        </div>
      </div>

      <div class="card group hover:scale-105 transition-all duration-300">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-dark-text-4 mb-1">Active Partnerships</p>
              <p class="text-2xl font-bold text-status-success">{{ activeVendors }}</p>
            </div>
            <div class="p-3 bg-status-success/20 rounded-lg border border-status-success/30 group-hover:bg-status-success/30 transition-colors">
              <Handshake class="h-6 w-6 text-status-success" />
            </div>
          </div>
        </div>
      </div>

      <div class="card group hover:scale-105 transition-all duration-300">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-dark-text-4 mb-1">Avg Performance</p>
              <p class="text-2xl font-bold text-gradient-orange">{{ avgPerformance }}%</p>
            </div>
            <div class="p-3 bg-gradient-orange/20 rounded-lg border border-gradient-orange/30 group-hover:bg-gradient-orange/30 transition-colors">
              <TrendingUp class="h-6 w-6 text-gradient-orange" />
            </div>
          </div>
        </div>
      </div>

      <div class="card group hover:scale-105 transition-all duration-300">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-dark-text-4 mb-1">Monthly Savings</p>
              <p class="text-2xl font-bold text-gradient-purple">€{{ monthlySavings.toLocaleString() }}</p>
            </div>
            <div class="p-3 bg-gradient-purple/20 rounded-lg border border-gradient-purple/30 group-hover:bg-gradient-purple/30 transition-colors">
              <PiggyBank class="h-6 w-6 text-gradient-purple" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="card">
      <div class="card-body">
        <div class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="filter in filters"
              :key="filter"
              @click="activeFilter = filter"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-all duration-200 border',
                activeFilter === filter 
                  ? 'bg-gradient-to-r from-gradient-orange to-gradient-purple text-white border-transparent shadow-lg' 
                  : 'border-dark-border-2 text-dark-text-3 hover:border-gradient-orange/50 hover:text-dark-text-2'
              ]"
            >
              {{ filter }}
            </button>
          </div>
          
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-4 h-4 w-4" />
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Search vendors..."
              class="input pl-10 w-64"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Vendors Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div 
        v-for="vendor in filteredVendors" 
        :key="vendor.id"
        class="card vendor-card group hover:scale-105 transition-all duration-300 cursor-pointer"
        @click="selectedVendor = vendor; showDetailsModal = true"
      >
        <div class="card-body">
          <!-- Vendor Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-br from-gradient-orange to-gradient-purple rounded-lg flex items-center justify-center">
                <Building2 class="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 class="font-semibold text-dark-text group-hover:text-gradient-orange transition-colors">
                  {{ vendor.company }}
                </h3>
                <p class="text-sm text-dark-text-3">{{ vendor.contact.name }}</p>
              </div>
            </div>
            <div :class="[
              'px-2 py-1 rounded-full text-xs font-medium',
              vendor.status === 'Active' ? 'bg-status-success/20 text-status-success border border-status-success/30' :
              vendor.status === 'Pending' ? 'bg-status-warning/20 text-status-warning border border-status-warning/30' :
              'bg-status-error/20 text-status-error border border-status-error/30'
            ]">
              {{ vendor.status }}
            </div>
          </div>

          <!-- Vendor Details -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-dark-text-4">Region:</span>
              <span class="text-sm font-medium text-dark-text-2">{{ vendor.region }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-dark-text-4">Service Type:</span>
              <span class="text-sm font-medium text-dark-text-2">{{ vendor.serviceType }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-dark-text-4">Performance:</span>
              <div class="flex items-center space-x-2">
                <div class="w-16 h-2 bg-dark-surface-3 rounded-full overflow-hidden">
                  <div 
                    :class="[
                      'h-full rounded-full transition-all duration-500',
                      vendor.performance >= 90 ? 'bg-status-success' :
                      vendor.performance >= 75 ? 'bg-status-warning' : 'bg-status-error'
                    ]"
                    :style="{ width: vendor.performance + '%' }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-dark-text-2">{{ vendor.performance }}%</span>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm text-dark-text-4">Monthly Volume:</span>
              <span class="text-sm font-medium text-dark-text-2">{{ vendor.monthlyVolume }} shipments</span>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-dark-border-2">
              <span class="text-sm text-dark-text-4">Cost Savings:</span>
              <span class="text-sm font-bold text-gradient-purple">€{{ vendor.costSavings.toLocaleString() }}/mo</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-2 mt-4 pt-4 border-t border-dark-border-2">
            <button 
              @click.stop="editVendor(vendor)"
              class="flex-1 btn-secondary text-sm py-2"
            >
              <Edit class="h-3 w-3 mr-1" />
              Edit
            </button>
            <button 
              @click.stop="viewContracts(vendor)"
              class="flex-1 btn-outline text-sm py-2"
            >
              <FileText class="h-3 w-3 mr-1" />
              Contracts
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Export Actions -->
    <div class="flex justify-end space-x-3">
      <button @click="exportVendors('csv')" class="btn-outline">
        <Download class="h-4 w-4 mr-2" />
        Export CSV
      </button>
      <button @click="exportVendors('pdf')" class="btn-secondary">
        <FileDown class="h-4 w-4 mr-2" />
        Export PDF
      </button>
    </div>

    <!-- Create Vendor Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click="showCreateModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="text-xl font-semibold">Add New Vendor</h3>
          <button @click="showCreateModal = false" class="text-gray-400 hover:text-white">
            <X class="h-6 w-6" />
          </button>
        </div>
        
        <div class="modal-body space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label">Company Name</label>
              <input v-model="newVendor.company" type="text" class="input" />
            </div>
            <div>
              <label class="label">Contact Name</label>
              <input v-model="newVendor.contact.name" type="text" class="input" />
            </div>
            <div>
              <label class="label">Email</label>
              <input v-model="newVendor.contact.email" type="email" class="input" />
            </div>
            <div>
              <label class="label">Phone</label>
              <input v-model="newVendor.contact.phone" type="tel" class="input" />
            </div>
            <div>
              <label class="label">Region</label>
              <select v-model="newVendor.region" class="input">
                <option value="South Africa">South Africa</option>
                <option value="Europe">Europe</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <div>
              <label class="label">Service Type</label>
              <select v-model="newVendor.serviceType" class="input">
                <option value="Freight Forwarding">Freight Forwarding</option>
                <option value="Customs Clearance">Customs Clearance</option>
                <option value="Warehousing">Warehousing</option>
                <option value="Last Mile Delivery">Last Mile Delivery</option>
                <option value="Multi-Service">Multi-Service</option>
              </select>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="showCreateModal = false" class="btn-outline">Cancel</button>
          <button @click="createVendor" class="btn-primary">Create Vendor</button>
        </div>
      </div>
    </div>

    <!-- Vendor Details Modal -->
    <div v-if="showDetailsModal && selectedVendor" class="modal-overlay" @click="showDetailsModal = false">
      <div class="modal-content max-w-4xl" @click.stop>
        <div class="modal-header">
          <h3 class="text-xl font-semibold">{{ selectedVendor.company }} - Performance Details</h3>
          <button @click="showDetailsModal = false" class="text-gray-400 hover:text-white">
            <X class="h-6 w-6" />
          </button>
        </div>
        
        <div class="modal-body">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Performance Metrics -->
            <div class="space-y-4">
              <h4 class="font-semibold text-lg">Performance Metrics</h4>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span>On-Time Delivery:</span>
                  <span class="font-semibold text-status-success">{{ selectedVendor.performance }}%</span>
                </div>
                <div class="flex justify-between items-center">
                  <span>Quality Score:</span>
                  <span class="font-semibold text-gradient-orange">{{ selectedVendor.qualityScore || 92 }}%</span>
                </div>
                <div class="flex justify-between items-center">
                  <span>Customer Satisfaction:</span>
                  <span class="font-semibold text-gradient-purple">{{ selectedVendor.satisfaction || 88 }}%</span>
                </div>
              </div>
            </div>

            <!-- Financial Information -->
            <div class="space-y-4">
              <h4 class="font-semibold text-lg">Financial Information</h4>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span>Monthly Volume:</span>
                  <span class="font-semibold">{{ selectedVendor.monthlyVolume }} shipments</span>
                </div>
                <div class="flex justify-between items-center">
                  <span>Average Cost per Shipment:</span>
                  <span class="font-semibold">€{{ selectedVendor.avgCost || 245 }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span>Monthly Savings:</span>
                  <span class="font-semibold text-gradient-purple">€{{ selectedVendor.costSavings.toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="showDetailsModal = false" class="btn-outline">Close</button>
          <button @click="editVendor(selectedVendor)" class="btn-primary">Edit Vendor</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  Plus, 
  Search, 
  Building2, 
  Edit, 
  FileText, 
  Download,
  FileDown,
  X,
  TrendingUp,
  Handshake,
  PiggyBank
} from 'lucide-vue-next'
import { saveAs } from 'file-saver'

// Reactive data
const vendors = ref([])
const searchTerm = ref('')
const activeFilter = ref('All')
const showCreateModal = ref(false)
const showDetailsModal = ref(false)
const selectedVendor = ref(null)

const filters = ['All', 'Active', 'Pending', 'Inactive', 'South Africa', 'Europe']

const newVendor = ref({
  company: '',
  contact: {
    name: '',
    email: '',
    phone: ''
  },
  region: 'South Africa',
  serviceType: 'Freight Forwarding'
})

// Mock data
const mockVendors = [
  {
    id: 1,
    company: 'TransAfrica Logistics',
    contact: { name: 'Sarah Johnson', email: 'sarah@transafrica.co.za', phone: '+27 11 123 4567' },
    region: 'South Africa',
    serviceType: 'Freight Forwarding',
    performance: 94,
    qualityScore: 91,
    satisfaction: 89,
    status: 'Active',
    monthlyVolume: 450,
    avgCost: 280,
    costSavings: 12500
  },
  {
    id: 2,
    company: 'EuroShip Solutions',
    contact: { name: 'Marco Rossi', email: 'marco@euroship.eu', phone: '+31 20 987 6543' },
    region: 'Europe',
    serviceType: 'Multi-Service',
    performance: 89,
    qualityScore: 94,
    satisfaction: 92,
    status: 'Active',
    monthlyVolume: 680,
    avgCost: 195,
    costSavings: 18750
  },
  {
    id: 3,
    company: 'Cape Town Customs',
    contact: { name: 'David van der Merwe', email: 'david@ctcustoms.co.za', phone: '+27 21 555 7890' },
    region: 'South Africa',
    serviceType: 'Customs Clearance',
    performance: 97,
    qualityScore: 96,
    satisfaction: 94,
    status: 'Active',
    monthlyVolume: 320,
    avgCost: 150,
    costSavings: 8900
  },
  {
    id: 4,
    company: 'Nordic Freight Express',
    contact: { name: 'Erik Andersen', email: 'erik@nordicfreight.se', phone: '+46 8 456 7890' },
    region: 'Europe',
    serviceType: 'Last Mile Delivery',
    performance: 85,
    qualityScore: 88,
    satisfaction: 86,
    status: 'Active',
    monthlyVolume: 520,
    avgCost: 75,
    costSavings: 6200
  },
  {
    id: 5,
    company: 'Johannesburg Warehousing',
    contact: { name: 'Priya Patel', email: 'priya@jhbware.co.za', phone: '+27 11 789 0123' },
    region: 'South Africa',
    serviceType: 'Warehousing',
    performance: 78,
    qualityScore: 82,
    satisfaction: 79,
    status: 'Pending',
    monthlyVolume: 210,
    avgCost: 320,
    costSavings: 4100
  }
]

// Computed properties
const filteredVendors = computed(() => {
  let filtered = vendors.value

  if (activeFilter.value !== 'All') {
    if (['Active', 'Pending', 'Inactive'].includes(activeFilter.value)) {
      filtered = filtered.filter(vendor => vendor.status === activeFilter.value)
    } else {
      filtered = filtered.filter(vendor => vendor.region === activeFilter.value)
    }
  }

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(vendor => 
      vendor.company.toLowerCase().includes(search) ||
      vendor.contact.name.toLowerCase().includes(search) ||
      vendor.serviceType.toLowerCase().includes(search)
    )
  }

  return filtered
})

const activeVendors = computed(() => 
  vendors.value.filter(vendor => vendor.status === 'Active').length
)

const avgPerformance = computed(() => {
  const total = vendors.value.reduce((sum, vendor) => sum + vendor.performance, 0)
  return Math.round(total / vendors.value.length)
})

const monthlySavings = computed(() => 
  vendors.value.reduce((sum, vendor) => sum + vendor.costSavings, 0)
)

// Methods
const createVendor = () => {
  const vendor = {
    id: Date.now(),
    ...newVendor.value,
    performance: 85,
    qualityScore: 88,
    satisfaction: 85,
    status: 'Pending',
    monthlyVolume: 0,
    avgCost: 200,
    costSavings: 0
  }
  
  vendors.value.push(vendor)
  showCreateModal.value = false
  
  // Reset form
  newVendor.value = {
    company: '',
    contact: { name: '', email: '', phone: '' },
    region: 'South Africa',
    serviceType: 'Freight Forwarding'
  }
}

const editVendor = (vendor) => {
  console.log('Edit vendor:', vendor.company)
  // Implementation for editing vendor
}

const viewContracts = (vendor) => {
  console.log('View contracts for:', vendor.company)
  // Implementation for viewing contracts
}

const exportVendors = (format) => {
  if (format === 'csv') {
    const csvContent = [
      'Company,Contact,Email,Region,Service Type,Performance,Status,Monthly Volume,Cost Savings',
      ...filteredVendors.value.map(vendor => 
        `${vendor.company},${vendor.contact.name},${vendor.contact.email},${vendor.region},${vendor.serviceType},${vendor.performance}%,${vendor.status},${vendor.monthlyVolume},€${vendor.costSavings}`
      )
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'vendors-export.csv')
  }
}

// Initialize
onMounted(() => {
  vendors.value = mockVendors
})
</script>

<style scoped>
.vendor-card {
  transition: all 0.3s ease;
}

.vendor-card:hover {
  transform: translateY(-2px);
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
