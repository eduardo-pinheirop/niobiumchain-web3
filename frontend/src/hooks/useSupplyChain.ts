import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { SUPPLY_CHAIN_ABI, CONTRACT_ADDRESSES } from '../lib/contracts'

export interface SupplyChainStepData {
  stepId: bigint
  stepType: number
  status: number
  batchId: bigint
  operator: `0x${string}`
  startTime: bigint
  endTime: bigint
  location: string
  qrCodeHash: string
  cvDataHash: string
  metadata: string
  previousSteps: readonly bigint[]
  nextSteps: readonly bigint[]
}

export function useSupplyChain() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const createNewBatch = (params: {
    did: string
    initialStepType: number
    location: string
    observation?: string
  }) => {
    writeContract({
      address: CONTRACT_ADDRESSES.supplyChain,
      abi: SUPPLY_CHAIN_ABI,
      functionName: 'createBatch',
      args: [params.did, params.initialStepType, params.location, params.observation ?? ''] as const,
    })
  }

  const addStep = (params: {
    stepType: number
    batchId: number
    location: string
    observation?: string
    previousSteps?: number[]
  }) => {
    writeContract({
      address: CONTRACT_ADDRESSES.supplyChain,
      abi: SUPPLY_CHAIN_ABI,
      functionName: 'createStep',
      args: [
        params.stepType,
        BigInt(params.batchId),
        params.location,
        params.observation ?? '',
        (params.previousSteps ?? []).map((s) => BigInt(s)),
      ] as const,
    })
  }

  return {
    createNewBatch,
    addStep,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}

export function useBatchHistory(batchId: number, enabled = true) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.supplyChain,
    abi: SUPPLY_CHAIN_ABI,
    functionName: 'getBatchHistory',
    args: [BigInt(Number.isFinite(batchId) ? batchId : 0)],
    query: { enabled: enabled && Number.isFinite(batchId) && batchId >= 0 },
  })

  return {
    history: data as readonly SupplyChainStepData[] | undefined,
    isLoading,
    error,
    refetch,
  }
}
