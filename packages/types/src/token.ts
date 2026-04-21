// Token and transaction-related types

export interface TokenBalance {
  address: string;
  balance: bigint;
  locked: bigint;
  available: bigint;
}

export interface TokenTransfer {
  from: string;
  to: string;
  amount: bigint;
  timestamp: number;
  txHash: string;
  memo?: string;
}

export interface StakeInfo {
  staker: string;
  amount: bigint;
  stakedAt: number;
  unlockAt?: number;
  purpose: StakePurpose;
}

export enum StakePurpose {
  HOSPITAL_REGISTRATION = "hospital_registration",
  GOVERNANCE = "governance",
  LIQUIDITY = "liquidity",
}

export interface RewardDistribution {
  recipient: string;
  amount: bigint;
  reason: RewardReason;
  distributedAt: number;
  txHash: string;
}

export enum RewardReason {
  APPOINTMENT_COMPLETION = "appointment_completion",
  PATIENT_REFERRAL = "patient_referral",
  HOSPITAL_RATING = "hospital_rating",
  PLATFORM_CONTRIBUTION = "platform_contribution",
}

export interface TokenMetrics {
  totalSupply: bigint;
  circulatingSupply: bigint;
  totalStaked: bigint;
  totalBurned: bigint;
  holders: number;
}

export interface PlatformFees {
  appointmentFeePercentage: number;
  prescriptionFeePercentage: number;
  totalFeesCollected: bigint;
  feesDistributed: bigint;
}
