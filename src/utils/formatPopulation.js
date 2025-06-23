export function formatPopulation(num) {
  if (typeof num !== 'number') return '-'
  return num.toLocaleString()
}