<template>
  <div class="export-report-component">
    <!-- Export Button -->
    <div class="flex items-center space-x-3">
      <button 
        @click="showExportModal = true"
        class="btn-primary flex items-center space-x-2"
      >
        <Download class="h-4 w-4" />
        <span>Export Report</span>
      </button>
      
      <div class="flex space-x-2">
        <button 
          @click="quickExport('csv')"
          class="btn-outline text-sm py-2 px-3"
          title="Quick CSV Export"
        >
          <FileSpreadsheet class="h-4 w-4 mr-1" />
          CSV
        </button>
        <button 
          @click="quickExport('pdf')"
          class="btn-secondary text-sm py-2 px-3"
          title="Quick PDF Export"
        >
          <FileDown class="h-4 w-4 mr-1" />
          PDF
        </button>
      </div>
    </div>

    <!-- Export Modal -->
    <div v-if="showExportModal" class="modal-overlay" @click="showExportModal = false">
      <div class="modal-content max-w-lg" @click.stop>
        <div class="modal-header">
          <h3 class="text-xl font-semibold">Export Report</h3>
          <button @click="showExportModal = false" class="text-gray-400 hover:text-white">
            <X class="h-6 w-6" />
          </button>
        </div>
        
        <div class="modal-body space-y-6">
          <!-- Export Type -->
          <div>
            <label class="label">Export Format</label>
            <div class="grid grid-cols-2 gap-3">
              <button 
                v-for="format in exportFormats"
                :key="format.value"
                @click="selectedFormat = format.value"
                :class="[
                  'p-4 border rounded-lg text-left transition-all duration-200',
                  selectedFormat === format.value 
                    ? 'border-gradient-orange bg-gradient-orange/10 text-gradient-orange' 
                    : 'border-dark-border-2 hover:border-gradient-orange/50'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <component :is="format.icon" class="h-5 w-5" />
                  <div>
                    <div class="font-medium">{{ format.name }}</div>
                    <div class="text-sm text-dark-text-4">{{ format.description }}</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- Data Selection -->
          <div>
            <label class="label">Data to Export</label>
            <div class="space-y-2">
              <label v-for="option in dataOptions" :key="option.value" class="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  v-model="selectedData" 
                  :value="option.value"
                  class="form-checkbox h-4 w-4 text-gradient-orange rounded border-dark-border-2 bg-dark-surface-3"
                />
                <span class="text-sm">{{ option.label }}</span>
              </label>
            </div>
          </div>

          <!-- Date Range -->
          <div>
            <label class="label">Date Range</label>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs text-dark-text-4">From</label>
                <input 
                  v-model="dateRange.from" 
                  type="date" 
                  class="input w-full"
                />
              </div>
              <div>
                <label class="text-xs text-dark-text-4">To</label>
                <input 
                  v-model="dateRange.to" 
                  type="date" 
                  class="input w-full"
                />
              </div>
            </div>
          </div>

          <!-- Additional Options -->
          <div>
            <label class="label">Options</label>
            <div class="space-y-2">
              <label class="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  v-model="includeCharts"
                  class="form-checkbox h-4 w-4 text-gradient-orange rounded border-dark-border-2 bg-dark-surface-3"
                />
                <span class="text-sm">Include charts and visualizations</span>
              </label>
              <label class="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  v-model="includeSummary"
                  class="form-checkbox h-4 w-4 text-gradient-orange rounded border-dark-border-2 bg-dark-surface-3"
                />
                <span class="text-sm">Include executive summary</span>
              </label>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="showExportModal = false" class="btn-outline">Cancel</button>
          <button 
            @click="generateExport" 
            :disabled="isExporting || selectedData.length === 0"
            class="btn-primary"
          >
            <Loader v-if="isExporting" class="h-4 w-4 mr-2 animate-spin" />
            {{ isExporting ? 'Generating...' : 'Export Report' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Export Progress -->
    <div v-if="exportProgress.show" class="fixed bottom-4 right-4 bg-dark-surface-2 border border-dark-border-2 rounded-lg p-4 shadow-xl max-w-sm">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <div v-if="exportProgress.status === 'generating'" class="w-8 h-8 border-2 border-gradient-orange border-t-transparent rounded-full animate-spin"></div>
          <CheckCircle v-else-if="exportProgress.status === 'complete'" class="w-8 h-8 text-status-success" />
          <AlertCircle v-else-if="exportProgress.status === 'error'" class="w-8 h-8 text-status-error" />
        </div>
        <div class="flex-1">
          <div class="font-medium text-dark-text">{{ exportProgress.message }}</div>
          <div v-if="exportProgress.status === 'generating'" class="text-sm text-dark-text-3">
            {{ exportProgress.step }} ({{ exportProgress.progress }}%)
          </div>
        </div>
        <button v-if="exportProgress.status !== 'generating'" @click="exportProgress.show = false">
          <X class="h-4 w-4 text-dark-text-4" />
        </button>
      </div>
      
      <!-- Progress Bar -->
      <div v-if="exportProgress.status === 'generating'" class="mt-3">
        <div class="w-full bg-dark-surface-3 rounded-full h-2">
          <div 
            class="bg-gradient-to-r from-gradient-orange to-gradient-purple h-2 rounded-full transition-all duration-300"
            :style="{ width: exportProgress.progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  Download, 
  FileSpreadsheet, 
  FileDown, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader
} from 'lucide-vue-next'
import { saveAs } from 'file-saver'

// Props
const props = defineProps({
  dataType: {
    type: String,
    default: 'general'
  },
  data: {
    type: Array,
    default: () => []
  }
})

// Reactive data
const showExportModal = ref(false)
const selectedFormat = ref('csv')
const selectedData = ref(['basic'])
const isExporting = ref(false)
const includeCharts = ref(false)
const includeSummary = ref(true)

const dateRange = ref({
  from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  to: new Date().toISOString().split('T')[0]
})

const exportProgress = ref({
  show: false,
  status: 'generating',
  message: '',
  step: '',
  progress: 0
})

// Configuration
const exportFormats = [
  {
    value: 'csv',
    name: 'CSV',
    description: 'Comma-separated values',
    icon: FileSpreadsheet
  },
  {
    value: 'pdf',
    name: 'PDF',
    description: 'Portable document format',
    icon: FileDown
  }
]

const dataOptions = [
  { value: 'basic', label: 'Basic Information' },
  { value: 'performance', label: 'Performance Metrics' },
  { value: 'financial', label: 'Financial Data' },
  { value: 'contact', label: 'Contact Details' }
]

// Methods
const quickExport = async (format) => {
  selectedFormat.value = format
  selectedData.value = ['basic', 'performance']
  await generateExport()
}

const generateExport = async () => {
  if (selectedData.value.length === 0) return

  isExporting.value = true
  exportProgress.value = {
    show: true,
    status: 'generating',
    message: 'Preparing export...',
    step: 'Gathering data',
    progress: 0
  }

  try {
    await simulateProgress()
    const exportData = getExportData()

    if (selectedFormat.value === 'csv') {
      await exportToCSV(exportData)
    }

    exportProgress.value = {
      show: true,
      status: 'complete',
      message: 'Export completed successfully!',
      step: '',
      progress: 100
    }

    setTimeout(() => {
      exportProgress.value.show = false
    }, 3000)

  } catch (error) {
    console.error('Export failed:', error)
    exportProgress.value = {
      show: true,
      status: 'error',
      message: 'Export failed. Please try again.',
      step: '',
      progress: 0
    }
  } finally {
    isExporting.value = false
    showExportModal.value = false
  }
}

const simulateProgress = async () => {
  const steps = [
    { message: 'Gathering data...', progress: 25 },
    { message: 'Processing records...', progress: 50 },
    { message: 'Formatting output...', progress: 75 },
    { message: 'Finalizing...', progress: 95 }
  ]

  for (const step of steps) {
    exportProgress.value.step = step.message
    exportProgress.value.progress = step.progress
    await new Promise(resolve => setTimeout(resolve, 400))
  }
}

const getExportData = () => {
  return props.data || []
}

const exportToCSV = async (data) => {
  let headers = ['ID', 'Name', 'Status', 'Created']
  let rows = data.map(item => [
    item.id || '',
    item.name || item.company || '',
    item.status || '',
    item.createdAt || new Date().toISOString().split('T')[0]
  ])

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const filename = `${props.dataType}-export-${new Date().toISOString().split('T')[0]}.csv`
  saveAs(blob, filename)
}
</script>

<style scoped>
.form-checkbox:checked {
  background-color: rgb(241, 90, 36);
  border-color: rgb(241, 90, 36);
}
</style>