import axios from 'axios'

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      // Forbidden
      console.error('Access forbidden')
    } else if (error.response?.status >= 500) {
      // Server error
      console.error('Server error:', error.response.data)
    }
    
    return Promise.reject(error)
  }
)

/**
 * Enhanced API Client with fallback support
 */
class APIClient {
  constructor() {
    this.api = api
    this.isBackendAvailable = null
  }

  /**
   * Check if backend is available
   */
  async checkBackendHealth() {
    try {
      const response = await this.api.get('/health')
      this.isBackendAvailable = true
      return response.data
    } catch (error) {
      this.isBackendAvailable = false
      console.warn('Backend unavailable, using mock data')
      return { status: 'mock', message: 'Using fallback data' }
    }
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    try {
      const response = await this.api.get('/dashboard/stats')
      return response.data
    } catch (error) {
      console.warn('Using mock dashboard stats')
      return {
        total: 1247,
        inTransit: 312,
        atRisk: 23,
        delivered: 912,
        aiAccuracy: 94.2
      }
    }
  }

  /**
   * Get all clients
   */
  async getClients() {
    try {
      const response = await this.api.get('/clients')
      return response.data
    } catch (error) {
      console.warn('Using mock client data')
      return [
        {
          id: 1,
          name: 'BMW Group SA',
          email: 'logistics@bmw.co.za',
          phone: '+27 11 444 8200',
          address: 'Rosslyn, Pretoria, 0182',
          region: 'South Africa',
          status: 'active',
          tier: 'premium',
          packagePreferences: {
            maxWeight: 1000,
            maxDimensions: '200x200x200',
            specialHandling: ['fragile', 'temperature_controlled']
          },
          pricing: {
            tier: 'premium',
            ratePerKg: 85.50,
            currency: 'ZAR'
          }
        },
        {
          id: 2,
          name: 'Siemens AG',
          email: 'shipping@siemens.de',
          phone: '+49 89 636 00',
          address: 'Munich, Germany, 80333',
          region: 'Europe',
          status: 'active',
          tier: 'enterprise',
          packagePreferences: {
            maxWeight: 2000,
            maxDimensions: '300x300x300',
            specialHandling: ['hazardous', 'electronics']
          },
          pricing: {
            tier: 'enterprise',
            ratePerKg: 125.00,
            currency: 'EUR'
          }
        }
      ]
    }
  }

  /**
   * Get all shipments
   */
  async getShipments() {
    try {
      const response = await this.api.get('/shipments')
      return response.data
    } catch (error) {
      console.warn('Using mock shipment data')
      return [
        {
          id: 'SH001',
          clientId: 1,
          origin: 'Cape Town, South Africa',
          destination: 'Frankfurt, Germany',
          status: 'in_transit',
          estimatedDelivery: '2025-06-15T14:30:00Z',
          actualDelivery: null,
          weight: 25.5,
          dimensions: '50x40x30',
          value: 15750.00,
          currency: 'ZAR',
          aiPrediction: {
            confidence: 94.2,
            factors: ['weather', 'traffic', 'customs']
          }
        },
        {
          id: 'SH002',
          clientId: 2,
          origin: 'Berlin, Germany',
          destination: 'Johannesburg, South Africa',
          status: 'at_risk',
          estimatedDelivery: '2025-06-12T09:15:00Z',
          actualDelivery: null,
          weight: 180.0,
          dimensions: '120x80x60',
          value: 45200.00,
          currency: 'EUR',
          aiPrediction: {
            confidence: 78.5,
            factors: ['customs_delay', 'capacity_constraints']
          }
        }
      ]
    }
  }

  /**
   * Get all vendors/transporters
   */
  async getVendors() {
    try {
      const response = await this.api.get('/transporters')
      return response.data
    } catch (error) {
      console.warn('Using mock vendor data')
      return [
        {
          id: 1,
          name: 'DHL International',
          type: 'express',
          status: 'active',
          performance: 94.2,
          regions: ['South Africa', 'Europe'],
          services: ['express', 'freight', 'logistics'],
          contact: {
            email: 'partnerships@dhl.com',
            phone: '+27 11 921 3600'
          }
        },
        {
          id: 2,
          name: 'FedEx Europe',
          type: 'freight',
          status: 'active',
          performance: 91.8,
          regions: ['Europe', 'South Africa'],
          services: ['freight', 'customs', 'warehousing'],
          contact: {
            email: 'europe@fedex.com',
            phone: '+49 800 123 800'
          }
        }
      ]
    }
  }

  /**
   * Create new client
   */
  async createClient(clientData) {
    try {
      const response = await this.api.post('/clients', clientData)
      return response.data
    } catch (error) {
      console.warn('Mock client creation')
      return { id: Date.now(), ...clientData }
    }
  }

  /**
   * Update client
   */
  async updateClient(clientId, clientData) {
    try {
      const response = await this.api.put(`/clients/${clientId}`, clientData)
      return response.data
    } catch (error) {
      console.warn('Mock client update')
      return { id: clientId, ...clientData }
    }
  }

  /**
   * Delete client
   */
  async deleteClient(clientId) {
    try {
      const response = await this.api.delete(`/clients/${clientId}`)
      return response.data
    } catch (error) {
      console.warn('Mock client deletion')
      return { success: true }
    }
  }

  /**
   * Export data
   */
  async exportData(type, format = 'csv') {
    try {
      const response = await this.api.get(`/export/${type}?format=${format}`, {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      console.warn('Mock export data')
      // Return mock CSV data
      if (type === 'clients') {
        return new Blob(['Name,Email,Region,Status\nBMW Group SA,logistics@bmw.co.za,South Africa,active'], 
          { type: 'text/csv' })
      }
      return new Blob(['Mock export data'], { type: 'text/csv' })
    }
  }

  /**
   * Predict ETA for shipment using AI
   */
  async predictETA(shipmentId, shipmentData = null) {
    try {
      const payload = shipmentData || { shipmentId }
      const response = await this.api.post(`/shipments/${shipmentId}/predict-eta`, payload)
      return response.data
    } catch (error) {
      console.warn('Using mock ETA prediction')
      // Mock AI prediction response
      const mockFactors = ['weather', 'traffic', 'customs', 'carrier_performance']
      const randomFactors = mockFactors.slice(0, Math.floor(Math.random() * 3) + 1)
      
      return {
        shipmentId,
        predictedETA: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        confidence: Math.floor(Math.random() * 20) + 80, // 80-99%
        factors: randomFactors,
        riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        recommendations: [
          'Monitor weather conditions in transit region',
          'Track carrier performance metrics',
          'Prepare alternative routing if needed'
        ]
      }
    }
  }

  /**
   * Get real-time tracking data
   */
  async getTrackingData(shipmentId) {
    try {
      const response = await this.api.get(`/tracking/${shipmentId}`)
      return response.data
    } catch (error) {
      console.warn('Using mock tracking data')
      return {
        shipmentId,
        currentLocation: 'Port Elizabeth, South Africa',
        lastUpdate: new Date().toISOString(),
        status: 'in_transit',
        milestones: [
          { name: 'Shipment Created', completed: true, timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString() },
          { name: 'Picked Up', completed: true, timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
          { name: 'In Transit', completed: true, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
          { name: 'Customs Clearance', completed: false, timestamp: null },
          { name: 'Out for Delivery', completed: false, timestamp: null },
          { name: 'Delivered', completed: false, timestamp: null }
        ]
      }
    }
  }
}

// Create singleton instance
const apiClient = new APIClient()

export default apiClient
export { api }