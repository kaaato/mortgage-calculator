import { describe, test, expect } from 'vitest'
import validateInput from './validation'

describe('validateInput', () => {
  // amount
  test.each([
    ['12,34', false, 'Enter a valid amount format (e.g., 1250.5 or 1,250.50)'],
    ['1,2,3,4', false, 'Enter a valid amount format (e.g., 1250.5 or 1,250.50)'],
    ['1250.555', false, 'Enter a valid amount format (e.g., 1250.5 or 1,250.50)'],
    ["-5", false, 'Enter a valid amount format (e.g., 1250.5 or 1,250.50)'],
    ["abc", false, 'Enter a valid amount format (e.g., 1250.5 or 1,250.50)'],
    ["100000000", false, `Value is too big. Must be less than ${1e8.toLocaleString()}`],
    ["99999999.99", true, undefined],
    ['0', false, '0 is not allowed'],
    ['0.00', false, '0 is not allowed'],
    ['', false, 'This field is required'],
    [' 5 ', true, undefined]
  ])('amount %s -> result.ok %s -> msg: %s', (input, expected, msg) => {
    const result = validateInput({amount: input, years: '5', rate: '2', type: 'repayment'})

    expect(result.ok).toBe(expected)

    if (!result.ok) {
      expect(result.errors.amount).toBe(msg)
    }
  })

  // years
  test.each([
    ['1', true],
    ['1,1', false],
    ['1.00', false],
    ['01', false],
    ['0', false],
    ['-1', false],
    ['100', false],
    ['99.99', false],
    ['3.55', false],
    ['abc', false],
    [' 5 ', true],
  ])('years %s -> result.ok %s ', (input, expected ) => {
    const result = validateInput({ amount: '1000', years: input, rate: '2', type: 'repayment'})

    expect(result.ok).toBe(expected)
  })

  // rate
  test.each([
    ['1', true],
    ['01', false],
    ['-1', false],
    ['2%', true],
    ['-2%', false],
    ['%2', false],
    ['2%%', false],
    ['2% %', false],
    ['02%', false],
    ["%", false],
    ["0%", true],
    ['0', true],
    ['12.345%', true],
    ['.75', true],
    ['.', false],
    ['5.', false],
    ['abc', false],
    [' 5 ', true],
    ['5,25', false],
  ])('rate %s -> result.ok %s ', (input, expected) => {
    const result = validateInput({ amount: '1000', years: '10', rate: input, type: 'repayment'})

    expect(result.ok).toBe(expected)
    if (!result.ok) {
      expect(result.errors.rate).toBe('Enter a valid percentage rate. Use a dot, not a comma, for decimals (e.g. 4.5, 0.75 or 4.5%)')
    }
  } )

  test('passes with right values', () => {
    const result = validateInput({amount: '250', years: '5', rate: '2', type: 'repayment'})

    expect(result).toEqual({ok: true, value: {amount: 250, years: 5, rate: 2, type: 'repayment'}})
  })

  test('passes with "99.99" on rate because it is within the limit', () => {
    const result = validateInput({amount: '250', years: '5', rate: '99.99', type: 'repayment'})

    expect(result).toEqual({ok: true, value: {amount: 250, years: 5, rate: 99.99, type: 'repayment'}})
  })

  test('fails with "100" on rate because it is over the limit', () => {
    const result = validateInput({amount: '250', years: '5', rate: '100', type: 'repayment'})

    expect(result).toEqual({ok: false, errors: {rate: 'Value is too big. Must be less than 100'}})
  })

  test('fails on years due to getting empty value', () => {
    const result = validateInput({amount: '250', years: '', rate: '2', type: 'repayment'})

    expect(result).toEqual({ok: false, errors: {years: 'This field is required'}})
  })

  test('fails on rate due to getting empty value', () => {
    const result = validateInput({amount: '250', years: '5', rate: '', type: 'repayment'})

    expect(result).toEqual({ok: false, errors: {rate: 'This field is required'}})
  })

  test('fails all', () => {
    const result = validateInput({amount: '', years: '', rate: '', type: null})

    expect(result).toEqual({ok: false, errors: {amount: 'This field is required', years: 'This field is required', rate: 'This field is required', type: 'This field is required'}})
  })

  test('failes only rate', () => {
    const result = validateInput({amount: '250', years: '5', rate: '2', type: null})

    expect(result).toEqual({ok: false, errors: {type: 'This field is required'}})
  })

  test('whitespace are trimmed correctly', () => {
    const result = validateInput({amount: '  5  ', years: '  5  ', rate: '  5  ', type: 'repayment'})

    expect(result).toEqual({ok: true, value: {amount: 5, years: 5, rate: 5, type: 'repayment'}})
  })

  test('value with "," fails on rate with the format', () => {
    const result = validateInput({amount: '5', years: '5', rate: ',', type: 'repayment'})
    expect(result).toEqual({ok: false, errors: {rate: 'Enter a valid percentage rate. Use a dot, not a comma, for decimals (e.g. 4.5, 0.75 or 4.5%)'}})
  })

})