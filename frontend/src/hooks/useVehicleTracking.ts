import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { VEHICLE_TRACKING_ABI, CONTRACT_ADDRESSES } from '../lib/contracts'

export function useVehicleTracking() {
  const { data: hash, writeContract, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const createNewVehicle = async (params: {
    vin: string
    make: string
    model: string
    year: number
    vehicleType: string
    tokenURI: string
  }) => {
    try {
      writeContract({
        address: CONTRACT_ADDRESSES.vehicleTracking,
        abi: VEHICLE_TRACKING_ABI,
        functionName: 'createVehicle',
        args: [
          params.vin,
          params.make,
          params.model,
          BigInt(params.year),
          params.vehicleType,
          params.tokenURI,
        ] as const,
      })
    } catch (error) {
      console.error('Error creating vehicle:', error)
      throw error
    }
  }

  return {
    createNewVehicle,
    isPending,
    isConfirming,
    isConfirmed,
  }
}

export interface VehicleInfo {
  vehicleId: bigint
  vin: string
  make: string
  model: string
  year: bigint
  vehicleType: string
  currentLocation: string
  currentOwner: `0x${string}`
  manufacturingDate: bigint
  isActive: boolean
}

export function useVehicleInfo(vehicleId: number, enabled = true) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.vehicleTracking,
    abi: VEHICLE_TRACKING_ABI,
    functionName: 'vehicles',
    args: [BigInt(Number.isFinite(vehicleId) ? vehicleId : 0)],
    query: { enabled: enabled && Number.isFinite(vehicleId) && vehicleId >= 0 },
  })

  const vehicle: VehicleInfo | undefined = data
    ? {
        vehicleId: data[0],
        vin: data[1],
        make: data[2],
        model: data[3],
        year: data[4],
        vehicleType: data[5],
        currentLocation: data[6],
        currentOwner: data[7],
        manufacturingDate: data[8],
        isActive: data[9],
      }
    : undefined

  const exists = !!vehicle && vehicle.vin.length > 0

  return {
    vehicle: exists ? vehicle : undefined,
    isLoading,
    error,
    refetch,
  }
}
