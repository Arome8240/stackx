export function microStxToStx(microStx: number): number {
  return microStx / 1_000_000;
}

export function stxToMicroStx(stx: number): number {
  return Math.floor(stx * 1_000_000);
}

export function calculatePlatformFee(amountMicroStx: number, feeBps = 250): number {
  return Math.floor((amountMicroStx * feeBps) / 10_000);
}
