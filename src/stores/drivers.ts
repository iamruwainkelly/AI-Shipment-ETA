import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { driversAPI, type Driver } from '@/services/api-types'

export const useDriversStore = defineStore('drivers', () => {
  const drivers = ref<Driver[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const driversCount = computed(() => drivers.value.length)
  const availableDrivers = computed(() => drivers.value.filter(d => d.availability))
  const availableDriversCount = computed(() => availableDrivers.value.length)
  
  const getDriversByVehicleType = computed(() => {
    const vehicleGroups: Record<string, Driver[]> = {}
    drivers.value.forEach(driver => {
      if (!vehicleGroups[driver.vehicle_type]) {
        vehicleGroups[driver.vehicle_type] = []
      }
      vehicleGroups[driver.vehicle_type].push(driver)
    })
    return vehicleGroups
  })

  const averageRating = computed(() => {
    if (drivers.value.length === 0) return 0
    return drivers.value.reduce((sum, driver) => sum + driver.rating, 0) / drivers.value.length
  })

  async function fetchDrivers() {
    loading.value = true
    error.value = null
    try {
      const response = await driversAPI.getAll()
      drivers.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to fetch drivers'
    } finally {
      loading.value = false
    }
  }

  async function createDriver(driverData: Omit<Driver, 'id' | 'created_at'>) {
    loading.value = true
    error.value = null
    try {
      const response = await driversAPI.create(driverData)
      drivers.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to create driver'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateDriver(id: number, driverData: Partial<Driver>) {
    loading.value = true
    error.value = null
    try {
      const response = await driversAPI.update(id, driverData)
      const index = drivers.value.findIndex(d => d.id === id)
      if (index !== -1) {
        drivers.value[index] = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to update driver'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteDriver(id: number) {
    loading.value = true
    error.value = null
    try {
      await driversAPI.delete(id)
      drivers.value = drivers.value.filter(d => d.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to delete driver'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function uploadCSV(file: File) {
    loading.value = true
    error.value = null
    try {
      const response = await driversAPI.uploadCSV(file)
      await fetchDrivers()
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to upload CSV'
      throw err
    } finally {
      loading.value = false
    }
  }

  function getOptimalDrivers(capacity: number, vehicleType?: string) {
    return drivers.value
      .filter(driver => 
        driver.availability && 
        driver.capacity >= capacity &&
        (!vehicleType || driver.vehicle_type === vehicleType)
      )
      .sort((a, b) => b.rating - a.rating)
  }

  return {
    drivers,
    loading,
    error,
    driversCount,
    availableDrivers,
    availableDriversCount,
    getDriversByVehicleType,
    averageRating,
    fetchDrivers,
    createDriver,
    updateDriver,
    deleteDriver,
    uploadCSV,
    getOptimalDrivers
  }
})
