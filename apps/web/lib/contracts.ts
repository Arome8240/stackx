import {
  callReadOnlyFunction,
  cvToValue,
  stringAsciiCV,
  bufferCV,
  principalCV,
  uintCV,
  type ClarityValue,
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

const DEPLOYER =
  process.env.NEXT_PUBLIC_CONTRACT_DEPLOYER ?? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

// Singleton network for read-only calls
export const readNetwork =
  process.env.NEXT_PUBLIC_STACKS_NETWORK === 'mainnet' ? new StacksMainnet() : new StacksTestnet();

export const Contracts = {
  patientRegistry: `${DEPLOYER}.patient-registry`,
  medicalRecords: `${DEPLOYER}.medical-records`,
  appointments: `${DEPLOYER}.appointments`,
} as const;

async function readOnly(contractId: string, fn: string, args: ClarityValue[], sender: string) {
  const [contractAddress, contractName] = contractId.split('.');
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName,
    functionName: fn,
    functionArgs: args,
    network: readNetwork,
    senderAddress: sender,
  });
  return cvToValue(result);
}

export async function getPatient(address: string) {
  return readOnly(Contracts.patientRegistry, 'get-patient', [principalCV(address)], address);
}

export async function isRegistered(address: string) {
  return readOnly(Contracts.patientRegistry, 'is-registered', [principalCV(address)], address);
}

export async function getPatientRecords(address: string) {
  return readOnly(Contracts.medicalRecords, 'get-patient-records', [principalCV(address)], address);
}

export async function getPatientAppointments(address: string) {
  return readOnly(
    Contracts.appointments,
    'get-patient-appointments',
    [principalCV(address)],
    address,
  );
}

export async function getDoctorAppointments(address: string) {
  return readOnly(
    Contracts.appointments,
    'get-doctor-appointments',
    [principalCV(address)],
    address,
  );
}

export { stringAsciiCV, bufferCV, principalCV, uintCV };
