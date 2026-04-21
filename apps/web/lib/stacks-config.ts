import { AppConfig, UserSession } from '@stacks/connect';

export const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export const APP_NAME = 'Staxial Health';
export const APP_ICON = '/logo.png';

export const NETWORK = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? 'mainnet' : 'testnet';

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
export const DEPLOYER_ADDRESS = process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS || '';

// Contract names
export const CONTRACTS = {
  HEALTH_TOKEN: 'health-token',
  HOSPITAL_REGISTRY: 'hospital-registry',
  PATIENT_RECORDS: 'patient-records',
  APPOINTMENTS: 'appointments',
  PRESCRIPTIONS: 'prescriptions',
} as const;
