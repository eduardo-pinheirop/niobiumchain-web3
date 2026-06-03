// ABIs dos contratos - alinhadas com os contratos Solidity em /contracts

// Tipos de etapa da cadeia (enum SupplyChain.StepType)
export const STEP_TYPES = [
  'Mineração',
  'Transporte',
  'Processamento',
  'Embalagem',
  'Porto (Carregamento)',
  'Embarque',
  'Porto (Descarregamento)',
  'Transporte Final',
  'Fabricação',
  'Montagem',
  'Entrega',
] as const;

// Status de etapa (enum SupplyChain.StepStatus)
export const STEP_STATUS = [
  'Pendente',
  'Em Progresso',
  'Concluído',
  'Falhou',
  'Pulada',
] as const;

const SUPPLY_CHAIN_STEP_COMPONENTS = [
  { internalType: 'uint256', name: 'stepId', type: 'uint256' },
  { internalType: 'uint8', name: 'stepType', type: 'uint8' },
  { internalType: 'uint8', name: 'status', type: 'uint8' },
  { internalType: 'uint256', name: 'batchId', type: 'uint256' },
  { internalType: 'address', name: 'operator', type: 'address' },
  { internalType: 'uint256', name: 'startTime', type: 'uint256' },
  { internalType: 'uint256', name: 'endTime', type: 'uint256' },
  { internalType: 'string', name: 'location', type: 'string' },
  { internalType: 'string', name: 'qrCodeHash', type: 'string' },
  { internalType: 'string', name: 'cvDataHash', type: 'string' },
  { internalType: 'string', name: 'metadata', type: 'string' },
  { internalType: 'uint256[]', name: 'previousSteps', type: 'uint256[]' },
  { internalType: 'uint256[]', name: 'nextSteps', type: 'uint256[]' },
] as const;

export const SUPPLY_CHAIN_ABI = [
  {
    inputs: [
      { internalType: 'string', name: 'did', type: 'string' },
      { internalType: 'uint8', name: 'initialStepType', type: 'uint8' },
      { internalType: 'string', name: 'location', type: 'string' },
    ],
    name: 'createBatch',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'batchId', type: 'uint256' }],
    name: 'getBatchHistory',
    outputs: [
      {
        components: SUPPLY_CHAIN_STEP_COMPONENTS,
        internalType: 'struct SupplyChain.SupplyChainStep[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    // getter automático do mapping `batches` (campos não-array do struct Batch)
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'batches',
    outputs: [
      { internalType: 'uint256', name: 'batchId', type: 'uint256' },
      { internalType: 'string', name: 'did', type: 'string' },
      { internalType: 'uint256', name: 'currentStepId', type: 'uint256' },
      { internalType: 'address', name: 'creator', type: 'address' },
      { internalType: 'uint256', name: 'createdAt', type: 'uint256' },
      { internalType: 'bool', name: 'isActive', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'batchId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'did', type: 'string' },
      { indexed: true, internalType: 'address', name: 'creator', type: 'address' },
    ],
    name: 'BatchCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'stepId', type: 'uint256' },
      { indexed: false, internalType: 'uint8', name: 'stepType', type: 'uint8' },
      { indexed: true, internalType: 'uint256', name: 'batchId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'operator', type: 'address' },
    ],
    name: 'StepCreated',
    type: 'event',
  },
] as const;

export const NIOBIUM_DID_ABI = [
  {
    inputs: [
      { internalType: 'uint256', name: 'batchId', type: 'uint256' },
      { internalType: 'string', name: 'publicKey', type: 'string' },
      { internalType: 'string[]', name: 'authentication', type: 'string[]' },
      { internalType: 'string[]', name: 'serviceEndpoints', type: 'string[]' },
    ],
    name: 'createDID',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export const BATTERY_TRACKING_ABI = [
  {
    inputs: [
      { internalType: 'string', name: 'serialNumber', type: 'string' },
      { internalType: 'string', name: 'model', type: 'string' },
      { internalType: 'uint256', name: 'capacity', type: 'uint256' },
      { internalType: 'uint256', name: 'voltage', type: 'uint256' },
      { internalType: 'string', name: 'chemistry', type: 'string' },
      { internalType: 'uint256', name: 'niobiumBatchId', type: 'uint256' },
      { internalType: 'string', name: 'manufacturer', type: 'string' },
      { internalType: 'uint256', name: 'warrantyMonths', type: 'uint256' },
      { internalType: 'string', name: 'qrCode', type: 'string' },
      { internalType: 'string', name: 'tokenURI', type: 'string' },
    ],
    name: 'createBattery',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    // getter automático do mapping `batteries` (Battery não possui campos array)
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'batteries',
    outputs: [
      { internalType: 'uint256', name: 'batteryId', type: 'uint256' },
      { internalType: 'string', name: 'serialNumber', type: 'string' },
      { internalType: 'string', name: 'model', type: 'string' },
      { internalType: 'uint256', name: 'capacity', type: 'uint256' },
      { internalType: 'uint256', name: 'voltage', type: 'uint256' },
      { internalType: 'string', name: 'chemistry', type: 'string' },
      { internalType: 'uint256', name: 'niobiumBatchId', type: 'uint256' },
      { internalType: 'string', name: 'manufacturer', type: 'string' },
      { internalType: 'uint256', name: 'manufacturingDate', type: 'uint256' },
      { internalType: 'uint256', name: 'warrantyExpiry', type: 'uint256' },
      { internalType: 'string', name: 'qrCode', type: 'string' },
      { internalType: 'string', name: 'currentLocation', type: 'string' },
      { internalType: 'address', name: 'currentOwner', type: 'address' },
      { internalType: 'bool', name: 'isActive', type: 'bool' },
      { internalType: 'bool', name: 'inVehicle', type: 'bool' },
      { internalType: 'uint256', name: 'vehicleId', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'batteryId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'serialNumber', type: 'string' },
      { indexed: false, internalType: 'string', name: 'model', type: 'string' },
      { indexed: false, internalType: 'uint256', name: 'niobiumBatchId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'manufacturer', type: 'address' },
    ],
    name: 'BatteryCreated',
    type: 'event',
  },
] as const;

export const VEHICLE_TRACKING_ABI = [
  {
    inputs: [
      { internalType: 'string', name: 'vin', type: 'string' },
      { internalType: 'string', name: 'make', type: 'string' },
      { internalType: 'string', name: 'model', type: 'string' },
      { internalType: 'uint256', name: 'year', type: 'uint256' },
      { internalType: 'string', name: 'vehicleType', type: 'string' },
      { internalType: 'string', name: 'tokenURI', type: 'string' },
    ],
    name: 'createVehicle',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    // getter automático do mapping `vehicles` (omite o array batteryIds)
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'vehicles',
    outputs: [
      { internalType: 'uint256', name: 'vehicleId', type: 'uint256' },
      { internalType: 'string', name: 'vin', type: 'string' },
      { internalType: 'string', name: 'make', type: 'string' },
      { internalType: 'string', name: 'model', type: 'string' },
      { internalType: 'uint256', name: 'year', type: 'uint256' },
      { internalType: 'string', name: 'vehicleType', type: 'string' },
      { internalType: 'string', name: 'currentLocation', type: 'string' },
      { internalType: 'address', name: 'currentOwner', type: 'address' },
      { internalType: 'uint256', name: 'manufacturingDate', type: 'uint256' },
      { internalType: 'bool', name: 'isActive', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'vehicleId', type: 'uint256' }],
    name: 'getVehicleBatteries',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'vehicleId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'vin', type: 'string' },
      { indexed: false, internalType: 'string', name: 'make', type: 'string' },
      { indexed: false, internalType: 'string', name: 'model', type: 'string' },
      { indexed: true, internalType: 'address', name: 'manufacturer', type: 'address' },
    ],
    name: 'VehicleCreated',
    type: 'event',
  },
] as const;

// Endereços dos contratos (lidos do .env; fallback = deploy Sepolia)
export const CONTRACT_ADDRESSES = {
  supplyChain: (import.meta.env.VITE_SUPPLY_CHAIN_ADDRESS ||
    '0x6bf1149D3DE1cf1a6Dfc7267310f844646868ba6') as `0x${string}`,
  niobiumDID: (import.meta.env.VITE_NIOBIUM_DID_ADDRESS ||
    '0x1570cb4dfFEbDb74B0Ee4459C1889af6bcf5c5D0') as `0x${string}`,
  batteryTracking: (import.meta.env.VITE_BATTERY_TRACKING_ADDRESS ||
    '0x0DE5DeE3B6946BD2A540558Fbb5E17163f296dC7') as `0x${string}`,
  vehicleTracking: (import.meta.env.VITE_VEHICLE_TRACKING_ADDRESS ||
    '0x6ae32434d9Ec8C188195326bf321dBe9Ee77C062') as `0x${string}`,
} as const;

// Bloco a partir do qual buscar eventos (evita varrer toda a chain)
export const DEPLOY_FROM_BLOCK: bigint = import.meta.env.VITE_DEPLOY_FROM_BLOCK
  ? BigInt(import.meta.env.VITE_DEPLOY_FROM_BLOCK)
  : 0n;
