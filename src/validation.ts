import type { FieldErrors, FormValues, ValidInput, MortgageType } from "./types"

export type StringFieldGroup = keyof Omit<FormValues, 'type'>

const LIMITS = {
  amount: 1e8,
  years: 100,
  rate: 100
} as const satisfies Record<StringFieldGroup, number>

type ValidationResult = 
  | { ok: true; value: ValidInput }
  | { ok: false; errors: FieldErrors}

type FieldResult<T> = 
  | { ok: true; value: T }
  | { ok: false; error: string }

const validateInput = (obj: FormValues): ValidationResult => {
  const trimmedObj = {
    ...obj,
    amount: obj.amount.trim(),
    years: obj.years.trim(),
    rate: obj.rate.trim(),
  }

  const errors: FieldErrors = {}

  const amount = validateAmount(trimmedObj.amount)
  const years = validateYears(trimmedObj.years)
  const rate = validateRate(trimmedObj.rate)
  const type = validateType(trimmedObj.type)
  
  if (amount.ok && years.ok && rate.ok && type.ok) {
    return {
      ok: true,
      value: {
        amount: amount.value,
        years: years.value,
        rate: rate.value,
        type: type.value,
      }
    }
  } 
  
  if (!amount.ok) {
    errors.amount = amount.error
  }
  
  if (!years.ok) {
    errors.years = years.error
  }
  
  if (!rate.ok) {
    errors.rate = rate.error
  } 
  
  if (!type.ok) {
    errors.type = type.error
  }

  return {
    ok: false,
    errors,
  }
}

export const validateType = ( type : MortgageType | null): FieldResult<MortgageType> => {
  if (type === null) {
    return {
      ok: false,
      error: 'This field is required'
    }
  }

  return {
    ok: true,
    value: type,
  }
}

export const validateRate = ( rate : string): FieldResult<number> => {
  if(isEmpty(rate)) {
    return { ok: false, error: 'This field is required', }
  }

  if (!hasValidRateFormat(rate)) {
    return { ok: false, error: 'Enter a valid percentage rate. Use a dot, not a comma, for decimals (e.g. 4.5, 0.75 or 4.5%)', }
  }

  const normalized = rate.replace(/%/g, '')

  return parseAndUpperLimitCheck({
    value: normalized,
    maxLimit: LIMITS.rate,
  })
  /* rate = 0% is possible so leaving 0 as accepted */
}

export const validateYears = (years: string): FieldResult<number> => {
  if(isEmpty(years)) {
    return { ok: false, error: 'This field is required', }
  }

  if (!hasValidYearsFormat(years)) {
    return { ok: false, error: 'Enter a whole number of years greater than 0', }
  }

  return parseAndUpperLimitCheck({
    value: years,
    maxLimit: LIMITS.years,
  })
}

export const validateAmount = (amount: string): FieldResult<number> => {
  if(isEmpty(amount)) {
    return { ok: false, error: 'This field is required', }
  }
  
  if (!hasValidAmountFormat(amount)) {
    return { ok: false, error: 'Enter a valid amount format (e.g., 1250.5 or 1,250.50)', }
  }

  const normalized = amount.replace(/,/g, '')

  const parsed = parseAndUpperLimitCheck({
    value: normalized,
    maxLimit: LIMITS.amount
  })

  if (parsed.ok && isZero(parsed.value)) {
    return { ok: false, error: '0 is not allowed'}
  }

  return parsed
}

const isExceedingLimit = (value: number, limit: number) => value >= limit

const isZero = (val: number) => val === 0

const hasValidAmountFormat = (val: string) => {
  const regex = /^(?:0|[1-9]\d*|[1-9]\d{0,2}(?:,\d{3})+)(?:\.\d{1,2})?$/
  return regex.test(val)
}

const hasValidYearsFormat = (val: string) => {
  const regex = /^[1-9]\d*$/
  return regex.test(val)
}

const hasValidRateFormat = (val: string) => {
const regex = /^(?:[1-9]\d*(?:\.\d+)?|0(?:\.\d+)?|\.\d+)%?$/;
  return regex.test(val);
}

const isEmpty = (val: string) => val.length === 0

interface NumericValidationParams {
  value: string;
  maxLimit: number;
}

const parseAndUpperLimitCheck = ({value, maxLimit}: NumericValidationParams): FieldResult<number> => {
  const parsed = Number(value)
  
  // this should not run after Number(normalized) but leaving as a safeguard
  if (!Number.isFinite(parsed)) {
    return { ok: false, error: 'Value is not a number'}
  }
  
  if (isExceedingLimit(parsed, maxLimit)) {
    return { ok: false, error: `Value is too big. Must be less than ${maxLimit.toLocaleString()}`, }
  }
  
  return {
    ok: true,
    value: parsed,
  }
}

export default validateInput
