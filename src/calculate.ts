import { type ValidInput, type MortgageResult, assertNever } from './types'

const getResult = (data: ValidInput): MortgageResult => {
  switch (data.type) {
    case 'interestOnly':
      return calculateForInterestOnly(data)
    case 'repayment':
      return calculateForRepayment(data)
    default:
      return assertNever(data.type)
  }
}

type CalculationParams = Omit<ValidInput, 'type'>

const calculateForInterestOnly = ({amount, years, rate}: CalculationParams): MortgageResult => {
  const monthly = amount * (rate / 100) / 12
  const total = years * 12 * monthly

  return {monthly, total}
}

const calculateForRepayment = ({amount, years, rate}: CalculationParams): MortgageResult => {
  const numberOfPayments = years * 12
  if (rate === 0) {
    return {
      monthly: amount / numberOfPayments,
      total: amount,
    }
  }
  const monthlyInterestRate = rate / 100 / 12
  const growthFactor = (1 + monthlyInterestRate) ** numberOfPayments
  const monthly = amount * monthlyInterestRate * growthFactor / (growthFactor - 1)
  const total = monthly * numberOfPayments
  return { monthly, total,}
}

export default getResult