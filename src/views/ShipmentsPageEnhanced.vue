<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Shipment Management</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Track and manage shipments with advanced analytics</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="exportToCSV"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Download class="h-4 w-4 mr-2" />
          Export CSV
        </button>
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus class="h-4 w-4 mr-2" />
          Create Shipment
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Package class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Total Shipments
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ shipmentsStore.totalShipments }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Truck class="h-6 w-6 text-blue-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  In Transit
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ shipmentsStore.inTransitCount }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <DollarSign class="h-6 w-6 text-green-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Total Value
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  ${{ formatCurrency(shipmentsStore.totalValue) }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Weight class="h-6 w-6 text-purple-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Avg Weight
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ shipmentsStore.averageWeight }}kg
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search shipments..."
              class="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
          <select
            v-model="filters.status"
            class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="delayed">Delayed</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Transport Mode</label>
          <select
            v-model="filters.transportMode"
            class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Modes</option>
            <option value="road">Road</option>
            <option value="air">Air</option>
            <option value="sea">Sea</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Risk Level</label>
          <select
            v-model="filters.riskLevel"
            class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Risk Levels</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Region</label>
          <select
            v-model="filters.region"
            class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Regions</option>
            <option value="SA">South Africa</option>
            <option value="EU">Europe</option>
            <option value="US">United States</option>
            <option value="AS">Asia</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Shipments Table -->
    <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Shipments List</h3>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ filteredShipments.length }} of {{ shipmentsStore.totalShipments }} shipments
          </span>
        </div>

        <div v-if="loading" class="flex justify-center py-8">
          <LoadingSpinner />
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Shipment
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Route
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Dimensions & Weight
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cost & Priority
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Progress
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr 
                v-for="shipment in paginatedShipments" 
                :key="shipment.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                        <Package class="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ shipment.tracking_number }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ formatDate(shipment.created_at) }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">
                    {{ shipment.origin }} → {{ shipment.destination }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <component 
                      :is="getTransportIcon(shipment.transport_mode)" 
                      class="h-3 w-3 mr-1" 
                    />
                    {{ shipment.transport_mode.toUpperCase() }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">
                    {{ shipment.weight }}kg
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ shipment.dimensions?.length }}×{{ shipment.dimensions?.width }}×{{ shipment.dimensions?.height }}cm
                  </div>
                  <div v-if="shipment.temperature_controlled" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 mt-1">
                    <Thermometer class="h-3 w-3 mr-1" />
                    Temp Controlled
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    ${{ formatCurrency(shipment.estimated_cost) }}
                  </div>
                  <div class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1"
                       :class="getPriorityClass(shipment.priority)">
                    {{ shipment.priority.toUpperCase() }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      class="h-2 rounded-full transition-all duration-300"
                      :class="getProgressColor(shipment.status)"
                      :style="{ width: `${getProgressPercentage(shipment.status)}%` }"
                    ></div>
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ getProgressPercentage(shipment.status) }}% Complete
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getStatusClass(shipment.status)"
                  >
                    <component 
                      :is="getStatusIcon(shipment.status)" 
                      class="h-3 w-3 mr-1" 
                    />
                    {{ shipment.status.replace('_', ' ').toUpperCase() }}
                  </span>
                  <div v-if="shipment.estimated_delivery" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    ETA: {{ formatDate(shipment.estimated_delivery) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex space-x-2">
                    <button
                      @click="viewShipmentDetails(shipment)"
                      class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                      title="View Details"
                    >
                      <Eye class="h-4 w-4" />
                    </button>
                    <button
                      @click="editShipment(shipment)"
                      class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                      title="Edit Shipment"
                    >
                      <Edit class="h-4 w-4" />
                    </button>
                    <button
                      @click="trackShipment(shipment)"
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                      title="Track Location"
                    >
                      <MapPin class="h-4 w-4" />
                    </button>
                    <button
                      @click="predictETA(shipment)"
                      class="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300"
                      title="AI ETA Prediction"
                      :disabled="loadingPredictions[shipment.id]"
                    >
                      <Brain class="h-4 w-4" :class="{ 'animate-pulse': loadingPredictions[shipment.id] }" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to 
                {{ Math.min(currentPage * itemsPerPage, filteredShipments.length) }} of 
                {{ filteredShipments.length }} results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <ChevronLeft class="h-5 w-5" />
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    page === currentPage
                      ? 'z-10 bg-indigo-50 dark:bg-indigo-900 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <ChevronRight class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Shipment Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ showCreateModal ? 'Create New Shipment' : 'Edit Shipment' }}
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="showCreateModal ? createShipment() : updateShipment()" class="space-y-6">
            <!-- Basic Information -->
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">Basic Information</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Origin *</label>
                  <input
                    v-model="shipmentForm.origin"
                    type="text"
                    required
                    class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destination *</label>
                  <input
                    v-model="shipmentForm.destination"
                    type="text"
                    required
                    class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Transport Mode *</label>
                  <select
                    v-model="shipmentForm.transport_mode"
                    required
                    @change="calculateEstimatedCost"
                    class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select mode</option>
                    <option value="road">Road</option>
                    <option value="air">Air</option>
                    <option value="sea">Sea</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                  <select
                    v-model="shipmentForm.priority"
                    @change="calculateEstimatedCost"
                    class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="standard">Standard</option>
                    <option value="express">Express</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Package Dimensions -->
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">Package Dimensions</h4>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Length (cm)</label>
                  <input
                    v-model.number="shipmentForm.dimensions.length"
                    type="number"
                    min="1"
                    @input="calculateEstimatedCost"
                    class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Width (cm)</label>
                  <input
                    v-model.number="shipmentForm.dimensions.width"
                    type="number"
                    min="1"
                    @input="calculateEstimatedCost"
                    class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Height (cm)</label>
                  <input
                    v-model.number="shipmentForm.dimensions.height"
                    type="number"
                    min="1"
                    @input="calculateEstimatedCost"
                    class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight (kg) *</label>
                  <input
                    v-model.number="shipmentForm.weight"
                    type="number"
                    min="0.1"
                    step="0.1"
                    required
                    @input="calculateEstimatedCost"
                    class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <!-- Special Options -->
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">Special Options</h4>
              <div class="space-y-3">
                <label class="flex items-center">
                  <input 
                    v-model="shipmentForm.temperature_controlled" 
                    type="checkbox" 
                    @change="calculateEstimatedCost"
                    class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Temperature Controlled Shipping</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="shipmentForm.fragile" 
                    type="checkbox" 
                    @change="calculateEstimatedCost"
                    class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Fragile Handling</span>
                </label>
              </div>
            </div>

            <!-- Cost Estimation -->
            <div v-if="estimatedCost > 0" class="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
              <div class="flex items-center">
                <Calculator class="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <h4 class="text-md font-medium text-green-900 dark:text-green-100">Real-time Cost Estimation</h4>
              </div>
              <div class="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span class="text-green-700 dark:text-green-300">Base Cost:</span>
                  <div class="font-medium text-green-900 dark:text-green-100">${{ formatCurrency(baseCost) }}</div>
                </div>
                <div>
                  <span class="text-green-700 dark:text-green-300">Weight Factor:</span>
                  <div class="font-medium text-green-900 dark:text-green-100">${{ formatCurrency(weightCost) }}</div>
                </div>
                <div>
                  <span class="text-green-700 dark:text-green-300">Special Services:</span>
                  <div class="font-medium text-green-900 dark:text-green-100">${{ formatCurrency(specialServicesCost) }}</div>
                </div>
                <div>
                  <span class="text-green-700 dark:text-green-300">Total Estimated:</span>
                  <div class="font-bold text-lg text-green-900 dark:text-green-100">${{ formatCurrency(estimatedCost) }}</div>
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {{ showCreateModal ? 'Create Shipment' : 'Update Shipment' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Shipment Details Modal -->
    <div v-if="showDetailsModal && selectedShipment" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Shipment Details - {{ selectedShipment.tracking_number }}
            </h3>
            <button
              @click="showDetailsModal = false"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X class="h-6 w-6" />
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Route Information</h4>
                <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-md space-y-2">
                  <p class="text-sm"><span class="font-medium">Origin:</span> {{ selectedShipment.origin }}</p>
                  <p class="text-sm"><span class="font-medium">Destination:</span> {{ selectedShipment.destination }}</p>
                  <p class="text-sm"><span class="font-medium">Transport Mode:</span> {{ selectedShipment.transport_mode.toUpperCase() }}</p>
                  <p class="text-sm"><span class="font-medium">Distance:</span> {{ selectedShipment.distance }}km</p>
                </div>
              </div>

              <div>
                <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Package Details</h4>
                <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-md space-y-2">
                  <p class="text-sm"><span class="font-medium">Weight:</span> {{ selectedShipment.weight }}kg</p>
                  <p class="text-sm"><span class="font-medium">Dimensions:</span> {{ selectedShipment.dimensions?.length }}×{{ selectedShipment.dimensions?.width }}×{{ selectedShipment.dimensions?.height }}cm</p>
                  <p class="text-sm"><span class="font-medium">Priority:</span> {{ selectedShipment.priority.toUpperCase() }}</p>
                  <div v-if="selectedShipment.temperature_controlled || selectedShipment.fragile" class="flex flex-wrap gap-1 mt-2">
                    <span v-if="selectedShipment.temperature_controlled" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      Temperature Controlled
                    </span>
                    <span v-if="selectedShipment.fragile" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">
                      Fragile
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Tracking & Status</h4>
                <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-md space-y-2">
                  <p class="text-sm"><span class="font-medium">Status:</span> 
                    <span :class="getStatusClass(selectedShipment.status)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2">
                      {{ selectedShipment.status.replace('_', ' ').toUpperCase() }}
                    </span>
                  </p>
                  <p class="text-sm"><span class="font-medium">Progress:</span> {{ getProgressPercentage(selectedShipment.status) }}%</p>
                  <p class="text-sm"><span class="font-medium">ETA:</span> {{ formatDate(selectedShipment.estimated_delivery) }}</p>
                  <p class="text-sm"><span class="font-medium">Risk Level:</span> 
                    <span :class="getRiskLevelClass(selectedShipment.risk_score)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2">
                      {{ getRiskLevel(selectedShipment.risk_score) }}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Financial Details</h4>
                <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-md space-y-2">
                  <p class="text-sm"><span class="font-medium">Estimated Cost:</span> ${{ formatCurrency(selectedShipment.estimated_cost) }}</p>
                  <p class="text-sm"><span class="font-medium">Actual Cost:</span> ${{ formatCurrency(selectedShipment.actual_cost || 0) }}</p>
                  <p class="text-sm"><span class="font-medium">Created:</span> {{ formatDate(selectedShipment.created_at) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useShipmentsStore } from '../stores/shipments'
import { saveAs } from 'file-saver'
import {
  Package,
  Truck,
  DollarSign,
  Weight,
  Search,
  Download,
  Plus,
  Eye,
  Edit,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Plane,
  Ship,
  Calculator,
  Thermometer,
  Clock,
  CheckCircle,
  AlertTriangle,
  Brain
} from 'lucide-vue-next'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const shipmentsStore = useShipmentsStore()

// Reactive state
const loading = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDetailsModal = ref(false)
const selectedShipment = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const loadingPredictions = ref({})

// Cost calculation
const estimatedCost = ref(0)
const baseCost = ref(0)
const weightCost = ref(0)
const specialServicesCost = ref(0)

// Form data
const shipmentForm = ref({
  origin: '',
  destination: '',
  transport_mode: '',
  weight: 0,
  dimensions: {
    length: 0,
    width: 0,
    height: 0
  },
  priority: 'standard',
  temperature_controlled: false,
  fragile: false
})

// Filters
const filters = ref({
  search: '',
  status: '',
  transportMode: '',
  riskLevel: '',
  region: ''
})

// Computed properties
const filteredShipments = computed(() => {
  let shipments = shipmentsStore.shipments

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    shipments = shipments.filter(shipment =>
      shipment.tracking_number.toLowerCase().includes(search) ||
      shipment.origin.toLowerCase().includes(search) ||
      shipment.destination.toLowerCase().includes(search)
    )
  }

  if (filters.value.status) {
    shipments = shipments.filter(shipment => shipment.status === filters.value.status)
  }

  if (filters.value.transportMode) {
    shipments = shipments.filter(shipment => shipment.transport_mode === filters.value.transportMode)
  }

  if (filters.value.riskLevel) {
    shipments = shipments.filter(shipment => {
      const riskLevel = getRiskLevel(shipment.risk_score)
      return riskLevel.toLowerCase() === filters.value.riskLevel
    })
  }

  if (filters.value.region) {
    shipments = shipments.filter(shipment =>
      shipment.origin.includes(filters.value.region) ||
      shipment.destination.includes(filters.value.region)
    )
  }

  return shipments
})

const paginatedShipments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredShipments.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredShipments.value.length / itemsPerPage.value)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US').format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getRiskLevel = (riskScore) => {
  if (riskScore <= 0.3) return 'Low'
  if (riskScore <= 0.7) return 'Medium'
  return 'High'
}

const getRiskLevelClass = (riskScore) => {
  if (riskScore <= 0.3) return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
  if (riskScore <= 0.7) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
  return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
}

const getStatusClass = (status) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
    case 'in_transit':
      return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
    case 'pending':
      return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
    case 'delayed':
      return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    default:
      return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
  }
}

const getPriorityClass = (priority) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    case 'express':
      return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
    case 'standard':
      return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
    default:
      return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
  }
}

const getProgressPercentage = (status) => {
  switch (status) {
    case 'pending': return 10
    case 'in_transit': return 60
    case 'delivered': return 100
    case 'delayed': return 40
    default: return 0
  }
}

const getProgressColor = (status) => {
  switch (status) {
    case 'delivered': return 'bg-green-500'
    case 'in_transit': return 'bg-blue-500'
    case 'delayed': return 'bg-red-500'
    default: return 'bg-yellow-500'
  }
}

const getTransportIcon = (mode) => {
  switch (mode) {
    case 'air': return Plane
    case 'sea': return Ship
    case 'road': return Truck
    default: return Truck
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'delivered': return CheckCircle
    case 'in_transit': return Truck
    case 'delayed': return AlertTriangle
    default: return Clock
  }
}

const calculateShippingCost = (weight, transportMode, priority) => {
  const baseCosts = {
    road: 10,
    air: 50,
    sea: 25
  }

  const priorityMultipliers = {
    standard: 1,
    express: 1.5,
    urgent: 2
  }

  const base = baseCosts[transportMode] || baseCosts.road
  const weightFactor = weight * 2
  const priorityMultiplier = priorityMultipliers[priority] || 1

  return (base + weightFactor) * priorityMultiplier
}

const calculateEstimatedCost = () => {
  if (!shipmentForm.value.weight || !shipmentForm.value.transport_mode) {
    estimatedCost.value = 0
    return
  }

  // Base cost calculation
  baseCost.value = calculateShippingCost(
    shipmentForm.value.weight,
    shipmentForm.value.transport_mode,
    shipmentForm.value.priority
  )

  // Weight-based cost
  weightCost.value = shipmentForm.value.weight * 1.5

  // Special services cost
  specialServicesCost.value = 0
  if (shipmentForm.value.temperature_controlled) {
    specialServicesCost.value += 25
  }
  if (shipmentForm.value.fragile) {
    specialServicesCost.value += 15
  }

  // Volume-based cost (if dimensions provided)
  if (shipmentForm.value.dimensions.length && shipmentForm.value.dimensions.width && shipmentForm.value.dimensions.height) {
    const volume = (shipmentForm.value.dimensions.length * shipmentForm.value.dimensions.width * shipmentForm.value.dimensions.height) / 1000
    specialServicesCost.value += volume * 0.5
  }

  estimatedCost.value = baseCost.value + weightCost.value + specialServicesCost.value
}

const resetForm = () => {
  shipmentForm.value = {
    origin: '',
    destination: '',
    transport_mode: '',
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0
    },
    priority: 'standard',
    temperature_controlled: false,
    fragile: false
  }
  estimatedCost.value = 0
  baseCost.value = 0
  weightCost.value = 0
  specialServicesCost.value = 0
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  showDetailsModal.value = false
  selectedShipment.value = null
  resetForm()
}

const createShipment = async () => {
  try {
    loading.value = true
    const shipmentData = {
      ...shipmentForm.value,
      estimated_cost: estimatedCost.value,
      status: 'pending',
      risk_score: Math.random() * 0.5, // Random risk score for demo
      tracking_number: 'TRK' + Date.now(),
      created_at: new Date().toISOString(),
      estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    }
    
    await shipmentsStore.createShipment(shipmentData)
    closeModal()
  } catch (error) {
    console.error('Failed to create shipment:', error)
  } finally {
    loading.value = false
  }
}

const editShipment = (shipment) => {
  selectedShipment.value = shipment
  shipmentForm.value = { ...shipment }
  estimatedCost.value = shipment.estimated_cost || 0
  showEditModal.value = true
}

const updateShipment = async () => {
  try {
    loading.value = true
    const shipmentData = {
      ...shipmentForm.value,
      estimated_cost: estimatedCost.value
    }
    
    await shipmentsStore.updateShipment(selectedShipment.value.id, shipmentData)
    closeModal()
  } catch (error) {
    console.error('Failed to update shipment:', error)
  } finally {
    loading.value = false
  }
}

const viewShipmentDetails = (shipment) => {
  selectedShipment.value = shipment
  showDetailsModal.value = true
}

const trackShipment = (shipment) => {
  // Implement tracking functionality
  console.log('Track shipment:', shipment.tracking_number)
}

const predictETA = async (shipment) => {
  try {
    // Set loading state for this specific shipment
    loadingPredictions.value[shipment.id] = true
    
    // Import the API client
    const apiClient = (await import('../services/api')).default
    
    // Call the ETA prediction endpoint
    const prediction = await apiClient.predictETA(shipment.id, {
      origin: shipment.origin,
      destination: shipment.destination,
      weight: shipment.weight,
      priority: shipment.priority,
      transport_mode: shipment.transport_mode
    })
    
    // Show notification with prediction results
    alert(`🤖 AI ETA Prediction Results:
    
📅 Predicted ETA: ${new Date(prediction.predictedETA).toLocaleString()}
🎯 Confidence: ${prediction.confidence}%
⚠️ Risk Level: ${prediction.riskLevel}
🔍 Key Factors: ${prediction.factors.join(', ')}

📋 Recommendations:
${prediction.recommendations.map(rec => `• ${rec}`).join('\n')}`)
    
    // Update the shipment with new prediction if successful
    shipmentsStore.updateShipmentPrediction(shipment.id, prediction)
    
  } catch (error) {
    console.error('Failed to predict ETA:', error)
    alert('❌ Failed to generate AI prediction. Please try again.')
  } finally {
    // Remove loading state
    delete loadingPredictions.value[shipment.id]
  }
}

const exportToCSV = () => {
  const headers = [
    'Tracking Number',
    'Origin',
    'Destination',
    'Transport Mode',
    'Weight',
    'Dimensions',
    'Priority',
    'Status',
    'Estimated Cost',
    'Risk Score',
    'Created Date',
    'ETA'
  ]

  const csvContent = [
    headers.join(','),
    ...filteredShipments.value.map(shipment => [
      `"${shipment.tracking_number}"`,
      `"${shipment.origin}"`,
      `"${shipment.destination}"`,
      `"${shipment.transport_mode}"`,
      shipment.weight,
      `"${shipment.dimensions?.length}×${shipment.dimensions?.width}×${shipment.dimensions?.height}"`,
      `"${shipment.priority}"`,
      `"${shipment.status}"`,
      shipment.estimated_cost,
      shipment.risk_score,
      `"${formatDate(shipment.created_at)}"`,
      `"${formatDate(shipment.estimated_delivery)}"`
    ].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, `shipments-export-${new Date().toISOString().split('T')[0]}.csv`)
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Reset page when filters change
watch([filters], () => {
  currentPage.value = 1
}, { deep: true })

// Lifecycle
onMounted(async () => {
  loading.value = true
  try {
    await shipmentsStore.fetchShipments()
  } catch (error) {
    console.error('Failed to fetch shipments:', error)
  } finally {
    loading.value = false
  }
})
</script>