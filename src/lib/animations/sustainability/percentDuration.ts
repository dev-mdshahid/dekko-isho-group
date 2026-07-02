/** Duration scales with magnitude — matches snapshot gauge timing. */
export function percentDuration(percentage: number) {
  return Math.max(2, Math.min(4, 1.5 + (percentage / 100) * 2))
}
