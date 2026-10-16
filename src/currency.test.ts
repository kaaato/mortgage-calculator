import { describe, test, expect } from 'vitest'
import formatCurrency from './currency'

describe('formatCurrency', () => {
  test.each([
    [1797.7437, "£1,797.74"],
    [539322.94, "£539,322.94"],
    [0, "£0.00"],
    [1000, "£1,000.00"],
    [0.005, "£0.01"],
    [1.005, "£1.01"],
  ])('number %s -> string %s', (input, expected) => {
    const pounds = formatCurrency(input)
    expect(pounds).toBe(expected)
  })
})