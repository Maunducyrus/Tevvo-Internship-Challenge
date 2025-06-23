import { describe, it, expect } from 'vitest'
import { formatPopulation } from './formatPopulation'

describe('formatPopulation', () => {
  it('formats numbers with commas', () => {
    expect(formatPopulation(1234567)).toBe('1,234,567')
  })
  it('returns "-" for non-number input', () => {
    expect(formatPopulation('abc')).toBe('-')
    expect(formatPopulation(null)).toBe('-')
    expect(formatPopulation(undefined)).toBe('-')
  })
})