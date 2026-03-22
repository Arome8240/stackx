import {
  callReadOnlyFunction,
  cvToValue,
  stringAsciiCV,
  bufferCV,
  principalCV,
  uintCV,
  type ClarityValue,
} from '@stacks/transactions';
import type { StacksNetwork } from '@stacks/network';

const DEPLOYER =
  process.env.NEXT_PUBLIC_CONTRACT_DEPLOYER ?? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

export const Contracts = {
  patientRegistry: `${DEPLOYER}.patient-registry`,
  medicalRecords: `${DEPLOYER}.medical-records`,
  appointments: `${DEPLOYER}.appointments`,
} as const;

async function readOnly(
  contractId: string,
  fn: string,
  args: ClarityValue[],
  network: StacksNetwork,
  sender: string,
) {
  const [contractAddress, contractName] = contractId.split('.');
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName,
    functionName: fn,
    functionArgs: args,
    network,
    senderAddress: sender,
  });
  return cvToValue(result);
}

export async function getPatient(address: string, network: StacksNetwork) {
  return readOnly(
    Contracts.patientRegistry,
    'get-patient',
    [principalCV(address)],
    network,
    address,
  );
}

export async function isRegistered(address: string, network: StacksNetwork) {
  return readOnly(
    Contracts.patientRegistry,
    'is-registered',
    [principalCV(address)],
    network,
    address,
  );
}

export async function getPatientRecords(address: string, network: StacksNetwork) {
  return readOnly(
    Contracts.medicalRecords,
    'get-patient-records',
    [principalCV(address)],
    network,
    address,
  );
}

export async function getPatientAppointments(address: string, network: StacksNetwork) {
  return readOnly(
    Contracts.appointments,
    'get-patient-appointments',
    [principalCV(address)],
    network,
    address,
  );
}

export async function getDoctorAppointments(address: string, network: StacksNetwork) {
  return readOnly(
    Contracts.appointments,
    'get-doctor-appointments',
    [principalCV(address)],
    network,
    address,
  );
}

// Re-export CV helpers for use in pages
export { stringAsciiCV, bufferCV, principalCV, uintCV };
