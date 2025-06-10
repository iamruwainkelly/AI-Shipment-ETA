import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { shipmentsAPI, type Shipment, type ETACalculation } from '@/services/api-types'

export const useShipmentsStore = defineStore('shipments', () => {
  const shipments = ref<Shipment[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const shipmentsCount = computed(() => shipments.value.length)
  const pendingShipments = computed(() => shipments.value.filter(s => s.status === 'pending'))
  const inTransitShipments = computed(() => shipments.value.filter(s => s.status === 'in_transit'))
  const deliveredShipments = computed(() => shipments.value.filter(s => s.status === 'delivered'))
  const delayedShipments = computed(() => shipments.value.filter(s => s.status === 'delayed'))
  
  const getShipmentsByStatus = computed(() => {
    const statusGroups: Record<string, Shipment[]> = {}
    shipments.value.forEach(shipment => {
      if (!statusGroups[shipment.status]) {
        statusGroups[shipment.status] = []
      }
      statusGroups[shipment.status].push(shipment)
    })
    return statusGroups
  })

  const averageConfidenceScore = computed(() => {
    if (shipments.value.length === 0) return 0
    return shipments.value.reduce((sum, shipment) => sum + shipment.confidence_score, 0) / shipments.value.length
  })

  async function fetchShipments() {
    loading.value = true
    error.value = null
    try {
      const response = await shipmentsAPI.getAll()
      shipments.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to fetch shipments'
    } finally {
      loading.value = false
    }
  }

  async function createShipment(shipmentData: Omit<Shipment, 'id' | 'created_at'>) {
    loading.value = true
    error.value = null
    try {
      const response = await shipmentsAPI.create(shipmentData)
      shipments.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to create shipment'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateShipment(id: number, shipmentData: Partial<Shipment>) {
    loading.value = true
    error.value = null
    try {
      const response = await shipmentsAPI.update(id, shipmentData)
      const index = shipments.value.findIndex(s => s.id === id)
      if (index !== -1) {
        shipments.value[index] = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to update shipment'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteShipment(id: number) {
    loading.value = true
    error.value = null
    try {
      await shipmentsAPI.delete(id)
      shipments.value = shipments.value.filter(s => s.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to delete shipment'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function calculateETA(origin: string, destination: string): Promise<ETACalculation> {
    loading.value = true
    error.value = null
    try {
      const response = await shipmentsAPI.calculateETA(origin, destination)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to calculate ETA'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function generateInvoice(id: number) {
    loading.value = true
    error.value = null
    try {
      const response = await shipmentsAPI.generateInvoice(id)
      // Create download link for the PDF
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `invoice-${id}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to generate invoice'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getOptimalDriver(shipmentData: any) {
    loading.value = true
    error.value = null
    try {
      const response = await shipmentsAPI.getOptimalDriver(shipmentData)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to get optimal driver'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    shipments,
    loading,
    error,
    shipmentsCount,
    pendingShipments,
    inTransitShipments,
    deliveredShipments,
    delayedShipments,
    getShipmentsByStatus,
    averageConfidenceScore,
    fetchShipments,
    createShipment,
    updateShipment,
    deleteShipment,
    calculateETA,
    generateInvoice,
    getOptimalDriver
  }
})
