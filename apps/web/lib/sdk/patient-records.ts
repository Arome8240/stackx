import { getPatient, isPatientRegistered, getMedicalRecord } from 'staxial-sdk';

export interface Patient {
  principal: string;
  name: string;
  dateOfBirth: string;
  bloodType: string;
  allergies: string;
  emergencyContact: string;
  registeredAt: number;
  active: boolean;
}

export interface MedicalRecord {
  id: number;
  patient: string;
  hospital: string;
  doctor: string;
  diagnosis: string;
  treatment: string;
  medications: string;
  notes: string;
  recordDate: number;
  ipfsHash: string;
}

export interface AccessGrant {
  hospital: string;
  grantedAt: number;
  expiresAt: number;
  active: boolean;
}

export async function fetchPatient(
  network: any,
  contractAddress: string,
  contractName: string,
  patientAddress: string
): Promise<Patient | null> {
  try {
    const patient = await getPatient(
      { network, contractAddress, contractName },
      patientAddress
    );
    return patient as any;
  } catch (error) {
    console.error('Error fetching patient:', error);
    return null;
  }
}

export async function checkPatientRegistration(
  network: any,
  contractAddress: string,
  contractName: string,
  patientAddress: string
): Promise<boolean> {
  try {
    return await isPatientRegistered(
      { network, contractAddress, contractName },
      patientAddress
    );
  } catch (error) {
    console.error('Error checking patient registration:', error);
    return false;
  }
}

export async function fetchMedicalRecord(
  network: any,
  contractAddress: string,
  contractName: string,
  recordId: number
): Promise<MedicalRecord | null> {
  try {
    const record = await getMedicalRecord(
      { network, contractAddress, contractName },
      recordId
    );
    return record as any;
  } catch (error) {
    console.error('Error fetching medical record:', error);
    return null;
  }
}
