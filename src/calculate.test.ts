import { describe, test, expect } from 'vitest'
import getResult from './calculate'

describe('getResult', () => {
  test('returns the initial hardcoded value, "interst only" ', () => {
    const result = getResult({ amount: 300000, years: 25, rate: 5.25, type: 'interestOnly' })

    //“total is the sum of all monthly payments, excluding the principal still owed at the end”
    expect(result).toEqual({ monthly: 1312.5, total: 393750 })
  })

  test('returns the calculated value, "interest only"', () => {
    const result = getResult({ amount: 120000, years: 10, rate: 5, type: 'interestOnly'})
    expect(result).toEqual({ monthly: 500, total: 60000})
  })

  test('returns the calculated value, "repayment"', () => {
    const result = getResult({ amount: 300000, years: 25, rate: 5.25, type: 'repayment' })
    console.log(result.monthly)
    expect(result.monthly).toBeCloseTo(1797.74)
    expect(result.total).toBeCloseTo(539322.94)
  })

  test('returns the calculated value with 0% interest rate, "interest only"', () => {
    const result = getResult({ amount: 300000, years: 25, rate: 0, type: 'interestOnly' })
    expect(result).toEqual({ monthly: 0, total: 0})
  })

  test('returns the calculated value with 0% interest rate, "repayment"', () => {
    const result = getResult({ amount: 300000, years: 25, rate: 0, type: 'repayment' })
    expect(result).toEqual({ monthly: 1000, total: 300000})
  })

  test('returns the calculated value with a close to 0% interest rate, "repayment"', () => {
    const result = getResult({ amount: 300000, years: 25, rate: 0.01, type: 'repayment' })
    expect(result.monthly).toBeCloseTo(1001.2547)
    expect(result.total).toBeCloseTo(300376.406)
  })


})