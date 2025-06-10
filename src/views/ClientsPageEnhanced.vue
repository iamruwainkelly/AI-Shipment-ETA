<template>
  <div class="clients-page-enhanced">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Client Management</h1>
      <p class="text-gray-600 dark:text-gray-400">Manage client relationships, contracts, and performance metrics</p>
    </div>

    <!-- Statistics Dashboard -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
            <Users class="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Clients</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ clientsStore.totalClients }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle class="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Clients</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ clientsStore.activeClients }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
            <DollarSign class="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Revenue</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">${{ formatNumber(clientsStore.totalMonthlyRevenue) }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
            <Star class="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Satisfaction</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ clientsStore.averageSatisfactionScore }}/5.0</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats and Actions Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Risk Analysis -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <AlertTriangle class="h-5 w-5 mr-2" />
          Risk Analysis
        </h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">Low Risk</span>
            <div class="flex items-center">
              <div class="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                <div class="h-2 bg-green-500 rounded-full" :style="{ width: (clientsStore.riskAnalysis.low / clientsStore.riskAnalysis.total * 100) + '%' }"></div>
              </div>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ clientsStore.riskAnalysis.low }}</span>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">Medium Risk</span>
            <div class="flex items-center">
              <div class="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                <div class="h-2 bg-yellow-500 rounded-full" :style="{ width: (clientsStore.riskAnalysis.medium / clientsStore.riskAnalysis.total * 100) + '%' }"></div>
              </div>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ clientsStore.riskAnalysis.medium }}</span>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">High Risk</span>
            <div class="flex items-center">
              <div class="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                <div class="h-2 bg-red-500 rounded-full" :style="{ width: (clientsStore.riskAnalysis.high / clientsStore.riskAnalysis.total * 100) + '%' }"></div>
              </div>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ clientsStore.riskAnalysis.high }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Clients by Revenue -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Trophy class="h-5 w-5 mr-2" />
          Top Revenue Clients
        </h3>
        <div class="space-y-3">
          <div v-for="(client, index) in clientsStore.topClientsByRevenue" :key="client.id" class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                <span class="text-xs font-medium text-blue-600 dark:text-blue-400">{{ index + 1 }}</span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ client.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ client.industry }}</p>
              </div>
            </div>
            <span class="text-sm font-medium text-green-600 dark:text-green-400">${{ formatNumber(client.monthly_revenue) }}</span>
          </div>
        </div>
      </div>

      <!-- Client Tier Distribution -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Award class="h-5 w-5 mr-2" />
          Client Tiers
        </h3>
        <div class="space-y-3">
          <div v-for="(count, tier) in clientsStore.clientTierDistribution" :key="tier" class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400 capitalize">{{ tier }}</span>
            <div class="flex items-center">
              <div class="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                <div class="h-2 rounded-full" 
                     :class="{
                       'bg-purple-500': tier === 'enterprise',
                       'bg-blue-500': tier === 'premium',
                       'bg-green-500': tier === 'standard',
                       'bg-gray-500': tier === 'basic'
                     }" 
                     :style="{ width: (count / clientsStore.totalClients * 100) + '%' }"></div>
              </div>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ count }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Actions -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex flex-col sm:flex-row gap-4 flex-1">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Search clients..."
              class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <select v-model="statusFilter" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
          
          <select v-model="tierFilter" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">All Tiers</option>
            <option value="enterprise">Enterprise</option>
            <option value="premium">Premium</option>
            <option value="standard">Standard</option>
            <option value="basic">Basic</option>
          </select>
          
          <select v-model="industryFilter" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">All Industries</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Retail">Retail</option>
            <option value="Electronics">Electronics</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Fashion">Fashion</option>
          </select>
        </div>
        
        <div class="flex gap-2">
          <button
            @click="exportToCSV"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center"
          >
            <Download class="h-4 w-4 mr-2" />
            Export CSV
          </button>
          <button
            @click="showCreateModal = true"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
          >
            <Plus class="h-4 w-4 mr-2" />
            Add Client
          </button>
        </div>
      </div>
    </div>

    <!-- Clients Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Client</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Industry</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tier</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Monthly Revenue</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Satisfaction</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Risk</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="client in paginatedClients" :key="client.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <span class="text-white font-medium">{{ client.name.charAt(0) }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ client.name }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ client.contact_person }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{{ client.industry }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ client.region }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="{
                        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200': client.tier === 'enterprise',
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': client.tier === 'premium',
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': client.tier === 'standard',
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200': client.tier === 'basic'
                      }">
                  {{ client.tier }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="{
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': client.status === 'active',
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': client.status === 'pending',
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': client.status === 'inactive'
                      }">
                  {{ client.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">${{ formatNumber(client.monthly_revenue) }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">${{ formatNumber(client.contract_value) }} total</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <Star class="h-4 w-4 text-yellow-400 mr-1" />
                  <span class="text-sm text-gray-900 dark:text-white">{{ client.satisfaction_score }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="{
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': client.risk_score <= 0.1,
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': client.risk_score > 0.1 && client.risk_score <= 0.2,
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': client.risk_score > 0.2
                      }">
                  {{ client.risk_score <= 0.1 ? 'Low' : client.risk_score <= 0.2 ? 'Medium' : 'High' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <div class="flex space-x-2">
                  <button @click="viewClientDetails(client)" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                    <Eye class="h-4 w-4" />
                  </button>
                  <button @click="editClient(client)" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                    <Edit class="h-4 w-4" />
                  </button>
                  <button @click="deleteClient(client.id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="currentPage > 1 && currentPage--"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Previous
            </button>
            <button
              @click="currentPage < totalPages && currentPage++"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Showing <span class="font-medium">{{ startIndex + 1 }}</span> to <span class="font-medium">{{ endIndex }}</span> of <span class="font-medium">{{ filteredClients.length }}</span> results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="currentPage > 1 && currentPage--"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
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
                      ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-200'
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="currentPage < totalPages && currentPage++"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <ChevronRight class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Client Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {{ showCreateModal ? 'Add New Client' : 'Edit Client' }}
          </h3>
          <form @submit.prevent="saveClient" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                <input v-model="clientForm.name" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Person</label>
                <input v-model="clientForm.contact_person" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input v-model="clientForm.email" type="email" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <input v-model="clientForm.phone" type="tel" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Industry</label>
                <select v-model="clientForm.industry" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">Select Industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Fashion">Fashion</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tier</label>
                <select v-model="clientForm.tier" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">Select Tier</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="premium">Premium</option>
                  <option value="standard">Standard</option>
                  <option value="basic">Basic</option>
                </select>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeModal" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                Cancel
              </button>
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                {{ showCreateModal ? 'Create Client' : 'Update Client' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Client Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div class="mt-3">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Client Details</h3>
            <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X class="h-6 w-6" />
            </button>
          </div>
          
          <div v-if="selectedClient" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company Information</h4>
                <div class="mt-2 space-y-2">
                  <p class="text-sm text-gray-900 dark:text-white"><span class="font-medium">Name:</span> {{ selectedClient.name }}</p>
                  <p class="text-sm text-gray-900 dark:text-white"><span class="font-medium">Contact:</span> {{ selectedClient.contact_person }}</p>
                  <p class="text-sm text-gray-900 dark:text-white"><span class="font-medium">Email:</span> {{ selectedClient.email }}</p>
                  <p class="text-sm text-gray-900 dark:text-white"><span class="font-medium">Phone:</span> {{ selectedClient.phone }}</p>
                  <p class="text-sm text-gray-900 dark:text-white"><span class="font-medium">Industry:</span> {{ selectedClient.industry }}</p>
                  <p class="text-sm text-gray-900 dark:text-white"><span class="font-medium">Region:</span> {{ selectedClient.region }}</p>
                </div>
              </div>
              
              <div>
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Business Metrics</h4>
                <div class="mt-2 space-y-2">
                  <p class="text-sm text-gray-900 dark:text-white"><span class="font-medium">Tier:</span> {{ selectedClient.tier }}</p>
                  <p class="text-sm text-gray-900 dark:text-white"><span class="font-medium">Contract Value:</span> ${{ formatNumber(selectedClient.contract_value) }}</p>
                  <p class="text-sm text-gray-900 dark:text-white"><span class="font-medium">Monthly Revenue:</span> ${{ formatNumber(selectedClient.monthly_revenue) }}</p>
                  <p class="text-sm text-gray-900 dark:text-white"><span class="font-medium">Total Shipments:</span> {{ selectedClient.total_shipments }}</p>
                  <p class="text-sm text-gray-900 dark:text-white"><span class="font-medium">Satisfaction Score:</span> {{ selectedClient.satisfaction_score }}/5.0</p>
                  <p class="text-sm text-gray-900 dark:text-white"><span class="font-medium">Risk Score:</span> {{ selectedClient.risk_score }}</p>
                </div>
              </div>
            </div>
            
            <div class="space-y-4">
              <div>
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Preferences</h4>
                <div class="mt-2 space-y-2">
                  <p class="text-sm text-gray-900 dark:text-white"><span class="font-medium">Payment Terms:</span> {{ selectedClient.payment_terms }}</p>
                  <p class="text-sm text-gray-900 dark:text-white"><span class="font-medium">Preferred Transport:</span> {{ selectedClient.preferred_transport }}</p>
                  <p class="text-sm text-gray-900 dark:text-white"><span class="font-medium">Account Manager:</span> {{ selectedClient.account_manager }}</p>
                </div>
              </div>
              
              <div v-if="selectedClient.address">
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Address</h4>
                <div class="mt-2">
                  <p class="text-sm text-gray-900 dark:text-white">
                    {{ selectedClient.address.street }}<br>
                    {{ selectedClient.address.city }}, {{ selectedClient.address.state }} {{ selectedClient.address.zip }}<br>
                    {{ selectedClient.address.country }}
                  </p>
                </div>
              </div>
              
              <div v-if="selectedClient.special_requirements">
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Special Requirements</h4>
                <div class="mt-2 flex flex-wrap gap-1">
                  <span v-for="req in selectedClient.special_requirements" :key="req" class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {{ req.replace('_', ' ') }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useClientsStore } from '../stores/clients'
import { 
  Users, CheckCircle, DollarSign, Star, AlertTriangle, Trophy, Award,
  Search, Plus, Download, Eye, Edit, Trash2, X, ChevronLeft, ChevronRight
} from 'lucide-vue-next'

export default {
  name: 'ClientsPageEnhanced',
  components: {
    Users, CheckCircle, DollarSign, Star, AlertTriangle, Trophy, Award,
    Search, Plus, Download, Eye, Edit, Trash2, X, ChevronLeft, ChevronRight
  },
  setup() {
    const clientsStore = useClientsStore()
    
    // Reactive data
    const searchTerm = ref('')
    const statusFilter = ref('')
    const tierFilter = ref('')
    const industryFilter = ref('')
    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    
    // Modal states
    const showCreateModal = ref(false)
    const showEditModal = ref(false)
    const showDetailsModal = ref(false)
    const selectedClient = ref(null)
    
    // Form data
    const clientForm = ref({
      name: '',
      contact_person: '',
      email: '',
      phone: '',
      industry: '',
      tier: ''
    })

    // Computed properties
    const filteredClients = computed(() => {
      let clients = clientsStore.clients
      
      if (searchTerm.value) {
        const search = searchTerm.value.toLowerCase()
        clients = clients.filter(client => 
          client.name.toLowerCase().includes(search) ||
          client.contact_person.toLowerCase().includes(search) ||
          client.email.toLowerCase().includes(search)
        )
      }
      
      if (statusFilter.value) {
        clients = clients.filter(client => client.status === statusFilter.value)
      }
      
      if (tierFilter.value) {
        clients = clients.filter(client => client.tier === tierFilter.value)
      }
      
      if (industryFilter.value) {
        clients = clients.filter(client => client.industry === industryFilter.value)
      }
      
      return clients
    })

    const totalPages = computed(() => Math.ceil(filteredClients.value.length / itemsPerPage.value))
    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
    const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredClients.value.length))
    
    const paginatedClients = computed(() => {
      return filteredClients.value.slice(startIndex.value, endIndex.value)
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
    const formatNumber = (num) => {
      return new Intl.NumberFormat().format(num)
    }

    const viewClientDetails = (client) => {
      selectedClient.value = client
      showDetailsModal.value = true
    }

    const editClient = (client) => {
      selectedClient.value = client
      clientForm.value = { ...client }
      showEditModal.value = true
    }

    const closeModal = () => {
      showCreateModal.value = false
      showEditModal.value = false
      selectedClient.value = null
      clientForm.value = {
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        industry: '',
        tier: ''
      }
    }

    const saveClient = async () => {
      try {
        if (showCreateModal.value) {
          await clientsStore.createClient(clientForm.value)
        } else {
          await clientsStore.updateClient(selectedClient.value.id, clientForm.value)
        }
        closeModal()
      } catch (error) {
        console.error('Error saving client:', error)
      }
    }

    const deleteClient = async (id) => {
      if (confirm('Are you sure you want to delete this client?')) {
        try {
          await clientsStore.deleteClient(id)
        } catch (error) {
          console.error('Error deleting client:', error)
        }
      }
    }

    const exportToCSV = () => {
      const headers = ['Name', 'Contact Person', 'Email', 'Phone', 'Industry', 'Tier', 'Status', 'Monthly Revenue', 'Satisfaction Score', 'Risk Score']
      const csvContent = [
        headers.join(','),
        ...filteredClients.value.map(client => [
          `"${client.name}"`,
          `"${client.contact_person}"`,
          client.email,
          client.phone,
          client.industry,
          client.tier,
          client.status,
          client.monthly_revenue,
          client.satisfaction_score,
          client.risk_score
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'clients-export.csv'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }

    // Lifecycle
    onMounted(() => {
      clientsStore.fetchClients()
    })

    return {
      // Store
      clientsStore,
      
      // Reactive data
      searchTerm,
      statusFilter,
      tierFilter,
      industryFilter,
      currentPage,
      
      // Modal states
      showCreateModal,
      showEditModal,
      showDetailsModal,
      selectedClient,
      
      // Form
      clientForm,
      
      // Computed
      filteredClients,
      totalPages,
      startIndex,
      endIndex,
      paginatedClients,
      visiblePages,
      
      // Methods
      formatNumber,
      viewClientDetails,
      editClient,
      closeModal,
      saveClient,
      deleteClient,
      exportToCSV
    }
  }
}
</script>