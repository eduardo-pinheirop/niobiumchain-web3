import { usePublicClient } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import { parseAbiItem } from 'viem'
import { CONTRACT_ADDRESSES, DEPLOY_FROM_BLOCK, STEP_TYPES } from '../lib/contracts'

const BATCH_CREATED = parseAbiItem(
  'event BatchCreated(uint256 indexed batchId, string did, address indexed creator)',
)
const BATTERY_CREATED = parseAbiItem(
  'event BatteryCreated(uint256 indexed batteryId, string serialNumber, string model, uint256 niobiumBatchId, address indexed manufacturer)',
)
const VEHICLE_CREATED = parseAbiItem(
  'event VehicleCreated(uint256 indexed vehicleId, string vin, string make, string model, address indexed manufacturer)',
)
const STEP_CREATED = parseAbiItem(
  'event StepCreated(uint256 indexed stepId, uint8 stepType, uint256 indexed batchId, address indexed operator)',
)

export interface ActivityItem {
  type: string
  description: string
  blockNumber: bigint
}

export interface ProtocolStats {
  batches: number
  batteries: number
  vehicles: number
  steps: number
  recentActivity: ActivityItem[]
}

export function useProtocolStats() {
  const client = usePublicClient()

  return useQuery<ProtocolStats>({
    queryKey: ['protocol-stats'],
    enabled: !!client,
    refetchInterval: 30_000,
    queryFn: async () => {
      if (!client) throw new Error('Public client indisponível')

      const fromBlock = DEPLOY_FROM_BLOCK
      const [batchLogs, batteryLogs, vehicleLogs, stepLogs] = await Promise.all([
        client.getLogs({ address: CONTRACT_ADDRESSES.supplyChain, event: BATCH_CREATED, fromBlock }),
        client.getLogs({ address: CONTRACT_ADDRESSES.batteryTracking, event: BATTERY_CREATED, fromBlock }),
        client.getLogs({ address: CONTRACT_ADDRESSES.vehicleTracking, event: VEHICLE_CREATED, fromBlock }),
        client.getLogs({ address: CONTRACT_ADDRESSES.supplyChain, event: STEP_CREATED, fromBlock }),
      ])

      const recentActivity: ActivityItem[] = [
        ...batchLogs.map((l) => ({
          type: 'Lote Criado',
          description: `Lote #${l.args.batchId?.toString()} (${l.args.did ?? '—'})`,
          blockNumber: l.blockNumber ?? 0n,
        })),
        ...batteryLogs.map((l) => ({
          type: 'Bateria Registrada',
          description: `Bateria #${l.args.batteryId?.toString()} — ${l.args.model ?? ''}`,
          blockNumber: l.blockNumber ?? 0n,
        })),
        ...vehicleLogs.map((l) => ({
          type: 'Veículo Registrado',
          description: `Veículo #${l.args.vehicleId?.toString()} — VIN ${l.args.vin ?? ''}`,
          blockNumber: l.blockNumber ?? 0n,
        })),
        ...stepLogs.map((l) => ({
          type: 'Etapa Criada',
          description: `Etapa #${l.args.stepId?.toString()} — ${STEP_TYPES[Number(l.args.stepType ?? 0)] ?? 'Etapa'}`,
          blockNumber: l.blockNumber ?? 0n,
        })),
      ]
        .sort((a, b) => (b.blockNumber > a.blockNumber ? 1 : -1))
        .slice(0, 8)

      return {
        batches: batchLogs.length,
        batteries: batteryLogs.length,
        vehicles: vehicleLogs.length,
        steps: stepLogs.length,
        recentActivity,
      }
    },
  })
}
