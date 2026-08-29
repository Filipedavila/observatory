export function roundScore(score: number): number {
  const factor = Math.pow(10, 1);
  const roundedScore = Math.round(score * factor) / factor;
  if (!(roundedScore % 1 === 0)) {
    return Math.round(roundedScore);
  }
  return roundedScore; 
}