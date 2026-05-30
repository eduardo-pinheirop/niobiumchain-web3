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
        address: CONTRACT_ADDRESSES.batteryTracking as `0x${string}`,
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
        ],
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

export function useBatteryInfo(batteryId: number) {
  const { data: battery, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESSES.batteryTracking as `0x${string}`,
    abi: BATTERY_TRACKING_ABI,
    functionName: 'batteries',
    args: [BigInt(batteryId)],
  })

  return {
    battery,
    isLoading,
    error,
  }
}
