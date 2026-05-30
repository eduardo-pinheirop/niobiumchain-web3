import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { SUPPLY_CHAIN_ABI, CONTRACT_ADDRESSES } from '../lib/contracts'

export function useSupplyChain() {
  const { data: hash, writeContract, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const createNewBatch = async () => {
    try {
      writeContract({
        address: CONTRACT_ADDRESSES.supplyChain as `0x${string}`,
        abi: SUPPLY_CHAIN_ABI,
        functionName: 'createBatch',
      })
    } catch (error) {
      console.error('Error creating batch:', error)
      throw error
    }
  }

  return {
    createNewBatch,
    isPending,
    isConfirming,
    isConfirmed,
  }
}

export function useBatchHistory(batchId: number) {
  const { data: history, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESSES.supplyChain as `0x${string}`,
    abi: SUPPLY_CHAIN_ABI,
    functionName: 'getBatchHistory',
    args: [BigInt(batchId)],
  })

  return {
    history,
    isLoading,
    error,
  }
}
