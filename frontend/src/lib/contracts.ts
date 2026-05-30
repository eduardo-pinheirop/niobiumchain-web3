// ABI dos contratos - versões simplificadas para integração

export const SUPPLY_CHAIN_ABI = [
  {
    "inputs": [],
    "name": "createBatch",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "batchId", "type": "uint256"}],
    "name": "getBatchHistory",
    "outputs": [{"components": [], "internalType": "struct SupplyChain.SupplyChainStep[]", "name": "", "type": "tuple[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "batchId", "type": "uint256"},
      {"indexed": true, "internalType": "string", "name": "did", "type": "string"},
      {"indexed": true, "internalType": "address", "name": "creator", "type": "address"}
    ],
    "name": "BatchCreated",
    "type": "event"
  }
] as const;

export const NIOBIUM_DID_ABI = [
  {
    "inputs": [
      {"internalType": "uint256", "name": "batchId", "type": "uint256"},
      {"internalType": "string", "name": "publicKey", "type": "string"},
      {"internalType": "string[]", "name": "authentication", "type": "string[]"},
      {"internalType": "string[]", "name": "serviceEndpoints", "type": "string[]"}
    ],
    "name": "createDID",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "did", "type": "string"}],
    "name": "resolveDID",
    "outputs": [{"components": [], "internalType": "struct NiobiumDID.DIDDocument", "name": "", "type": "tuple"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const BATTERY_TRACKING_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "serialNumber", "type": "string"},
      {"internalType": "string", "name": "model", "type": "string"},
      {"internalType": "uint256", "name": "capacity", "type": "uint256"},
      {"internalType": "uint256", "name": "voltage", "type": "uint256"},
      {"internalType": "string", "name": "chemistry", "type": "string"},
      {"internalType": "uint256", "name": "niobiumBatchId", "type": "uint256"},
      {"internalType": "string", "name": "manufacturer", "type": "string"},
      {"internalType": "uint256", "name": "warrantyMonths", "type": "uint256"},
      {"internalType": "string", "name": "qrCode", "type": "string"},
      {"internalType": "string", "name": "tokenURI", "type": "string"}
    ],
    "name": "createBattery",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "batteryId", "type": "uint256"}],
    "name": "batteries",
    "outputs": [{"components": [], "internalType": "struct BatteryTracking.Battery", "name": "", "type": "tuple"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const VEHICLE_TRACKING_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "vin", "type": "string"},
      {"internalType": "string", "name": "make", "type": "string"},
      {"internalType": "string", "name": "model", "type": "string"},
      {"internalType": "uint256", "name": "year", "type": "uint256"},
      {"internalType": "string", "name": "vehicleType", "type": "string"},
      {"internalType": "string", "name": "tokenURI", "type": "string"}
    ],
    "name": "createVehicle",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "vehicleId", "type": "uint256"}],
    "name": "vehicles",
    "outputs": [{"components": [], "internalType": "struct VehicleTracking.Vehicle", "name": "", "type": "tuple"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Endereços dos contratos (atualizar após deploy)
export const CONTRACT_ADDRESSES = {
  supplyChain: import.meta.env.VITE_SUPPLY_CHAIN_ADDRESS || '0x0000000000000000000000000000000000000000',
  niobiumDID: import.meta.env.VITE_NIOBIUM_DID_ADDRESS || '0x0000000000000000000000000000000000000000',
  batteryTracking: import.meta.env.VITE_BATTERY_TRACKING_ADDRESS || '0x0000000000000000000000000000000000000000',
  vehicleTracking: import.meta.env.VITE_VEHICLE_TRACKING_ADDRESS || '0x0000000000000000000000000000000000000000',
} as const;
