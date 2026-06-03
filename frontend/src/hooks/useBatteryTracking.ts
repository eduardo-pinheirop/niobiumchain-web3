import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { BATTERY_TRACKING_ABI, CONTRACT_ADDRESSES } from '../lib/contracts'

export function useBatteryTracking() {
  const { data: hash, writeContract, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const createNewBattery = async (params: {
    serialNumber: string
    model: string
    capacity: number
    voltage: number
    chemistry: string
    niobiumBatchId: number
    manufacturer: string
    warrantyMonths: number
    qrCode: string
    tokenURI: string
  }) => {
    try {
      writeContract({
        address: CONTRACT_ADDRESSES.batteryTracking,
        abi: BATTERY_TRACKING_ABI,
        functionName: 'createBattery',
        args: [
          params.serialNumber,
          params.model,
          BigInt(params.capacity),
          BigInt(params.voltage),
          params.chemistry,
          BigInt(params.niobiumBatchId),
          params.manufacturer,
          BigInt(params.warrantyMonths),
          params.qrCode,
          params.tokenURI,
        ] as const,
      })
    } catch (error) {
      console.error('Error creating battery:', error)
      throw error
    }
  }

  return {
    createNewBattery,
    isPending,
    isConfirming,
    isConfirmed,
  }
}

export interface BatteryInfo {
  batteryId: bigint
  serialNumber: string
  model: string
  capacity: bigint
  voltage: bigint
  chemistry: string
  niobiumBatchId: bigint
  manufacturer: string
  manufacturingDate: bigint
  warrantyExpiry: bigint
  qrCode: string
  currentLocation: string
  currentOwner: `0x${string}`
  isActive: boolean
  inVehicle: boolean
  vehicleId: bigint
}

export function useBatteryInfo(batteryId: number, enabled = true) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.batteryTracking,
    abi: BATTERY_TRACKING_ABI,
    functionName: 'batteries',
    args: [BigInt(Number.isFinite(batteryId) ? batteryId : 0)],
    query: { enabled: enabled && Number.isFinite(batteryId) && batteryId >= 0 },
  })

  // O getter do mapping retorna uma tupla de valores; mapeamos para objeto.
  const battery: BatteryInfo | undefined = data
    ? {
        batteryId: data[0],
        serialNumber: data[1],
        model: data[2],
        capacity: data[3],
        voltage: data[4],
        chemistry: data[5],
        niobiumBatchId: data[6],
        manufacturer: data[7],
        manufacturingDate: data[8],
        warrantyExpiry: data[9],
        qrCode: data[10],
        currentLocation: data[11],
        currentOwner: data[12],
        isActive: data[13],
        inVehicle: data[14],
        vehicleId: data[15],
      }
    : undefined

  // Uma bateria inexistente retorna serialNumber vazio (struct default).
  const exists = !!battery && battery.serialNumber.length > 0

  return {
    battery: exists ? battery : undefined,
    isLoading,
    error,
    refetch,
  }
}
