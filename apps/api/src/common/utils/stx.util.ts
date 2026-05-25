const MICRO_STX_PER_STX = 1_000_000;
const PLATFORM_FEE_BPS = 250;
const BPS_DENOMINATOR = 10_000;

export function microStxToStx(microStx: number): number {
  return microStx / MICRO_STX_PER_STX;
}

export function stxToMicroStx(stx: number): number {
  return Math.round(stx * MICRO_STX_PER_STX);
}

export function calculateFee(amountMicroStx: number, feeBps = PLATFORM_FEE_BPS): number {
  return Math.floor((amountMicroStx * feeBps) / BPS_DENOMINATOR);
}

export function calculateNetAmount(amountMicroStx: number, feeBps = PLATFORM_FEE_BPS): number {
  return amountMicroStx - calculateFee(amountMicroStx, feeBps);
}

export function formatMicroStx(microStx: number): string {
  const stx = microStxToStx(microStx);
  if (stx >= 1_000_000) return `${(stx / 1_000_000).toFixed(1)}M STX`;
  if (stx >= 1_000) return `${(stx / 1_000).toFixed(1)}K STX`;
  return `${stx.toFixed(stx >= 1 ? 2 : 6)} STX`;
}
