export interface FormValues {
  amount: string;
  years: string;
  rate: string;
  type: MortgageType | null;
};

export type FieldErrors = Partial<Record<keyof FormValues, string>>

export interface MortgageResult {
  monthly: number;
  total: number;
};

export interface ValidInput {
  amount: number;
  years: number;
  rate: number;
  type: MortgageType;
};

export const MORTGAGE_TYPES = ['repayment', 'interestOnly'] as const
export type MortgageType = typeof MORTGAGE_TYPES[number]

export const isMortgageType = (value: string): value is MortgageType => {
  return (MORTGAGE_TYPES as readonly string[]).includes(value)
}

export const MORTGAGE_TYPE_LABELS: Record<MortgageType, string> = {
  repayment: 'Repayment',
  interestOnly: 'Interest Only',
}

export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
}
