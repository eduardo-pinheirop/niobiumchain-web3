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
        address: CONTRACT_ADDRESSES.vehicleTracking as `0x${string}`,
        abi: VEHICLE_TRACKING_ABI,
        functionName: 'createVehicle',
        args: [
          params.vin,
          params.make,
          params.model,
          BigInt(params.year),
          params.vehicleType,
          params.tokenURI,
        ],
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
  vin: string
  make: string
  model: string
  year: bigint
  vehicleType: string
  currentLocation: string
}

export function useVehicleInfo(vehicleId: number) {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESSES.vehicleTracking as `0x${string}`,
    abi: VEHICLE_TRACKING_ABI,
    functionName: 'vehicles',
    args: [BigInt(vehicleId)],
  })

  return {
    vehicle: data as VehicleInfo | undefined,
    isLoading,
    error,
  }
}
