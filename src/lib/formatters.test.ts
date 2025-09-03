import { describe, it, expect } from 'vitest'
import { formatDisplay } from './formatters'

describe('formatDisplay', () => {
  it('should format currency correctly', () => {
    expect(formatDisplay(1234.56, 'currency')).toMatch(/1\.234,56.*€/)
    expect(formatDisplay(1000000, 'currency')).toMatch(/1\.000\.000.*€/)
    expect(formatDisplay(0, 'currency')).toMatch(/0.*€/)
  })

  it('should format percentage correctly', () => {
    expect(formatDisplay(5.5, 'percentage')).toMatch(/5,5.*%/)
    expect(formatDisplay(100, 'percentage')).toMatch(/100.*%/)
    expect(formatDisplay(0, 'percentage')).toMatch(/0,0.*%/)
  })

  it('should format default numbers correctly', () => {
    expect(formatDisplay(1234.56, 'invalid' as any)).toBe('1.234,56')
    expect(formatDisplay(1000000, 'invalid' as any)).toBe('1.000.000')
    expect(formatDisplay(0, 'invalid' as any)).toBe('0')
  })

  it('should handle edge cases', () => {
    expect(formatDisplay(0.01, 'currency')).toMatch(/0,01.*€/)
    expect(formatDisplay(0.1, 'percentage')).toMatch(/0,1.*%/)
    expect(formatDisplay(999999.99, 'currency')).toMatch(/999\.999,99.*€/)
  })

  it('handles negatives', () => {
    expect(formatDisplay(-1234.56, 'currency')).toMatch(/[-−]1\.234,56\s*€/)
    expect(formatDisplay(-5, 'percentage')).toMatch(/[-−]5,0\s*%/)
  })

  it('rounds at boundaries', () => {
    expect(formatDisplay(1.005, 'currency')).toMatch(/1,01\s*€/)
    expect(formatDisplay(999.995, 'currency')).toMatch(/^1\.000(?:,00)?\s*€$/)
    expect(formatDisplay(99.995, 'percentage')).toMatch(/100,0\s*%/)
  })

  it('keeps integers clean for currency', () => {
    const s = formatDisplay(1000, 'currency')
    expect(s).toMatch(/1\.000/)
    expect(s).not.toMatch(/,00/)
  })
})

