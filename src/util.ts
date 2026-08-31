
export function formatScore(score: number | null | undefined): string {
  if (score === null || score === undefined || Number.isNaN(score)) {
    return '0';
  }

  const rounded = Math.round(score * 10) / 10;

  if (rounded === 0) return '0';
  if (rounded === 10) return '10';

  return rounded.toFixed(1);
}