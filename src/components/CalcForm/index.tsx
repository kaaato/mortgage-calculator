import { useState, useRef } from 'react';
import { MORTGAGE_TYPES, MORTGAGE_TYPE_LABELS, assertNever } from '../../types';
import type { FieldErrors, ValidInput, FormValues } from '../../types';
import validateInput, { type StringFieldGroup} from '../../validation';

import CalcIcon from '../../assets/images/icon-calculator.svg?react'

import styles from './CalcForm.module.css'

interface Props {
  onCalculate: (data: ValidInput) => void
  onClearResult: () => void
}

const initialValues: FormValues = {
  amount: '',
  years: '',
  rate: '',
  type: null,
}

const fieldOrder = ['amount', 'years', 'rate', 'type'] as const satisfies readonly (keyof FormValues)[]

const CalcForm = ({onCalculate, onClearResult}: Props) => {
  const [formValues, setFormValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const amount = useRef<HTMLInputElement>(null)
  const years = useRef<HTMLInputElement>(null)
  const rate = useRef<HTMLInputElement>(null)
  const type = useRef<HTMLInputElement>(null)

  const validateAndApply = (obj: FormValues) => {
    const result = validateInput(obj)

    if (!result.ok) {
      setErrors(result.errors)
      onClearResult()
      return result
    }
    setErrors({})
    onCalculate(result.value)
    return result
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true)
    const result = validateAndApply(formValues)
    if (result.ok) return

    const firstErrorField = fieldOrder.find((f) => f in result.errors && result.errors[f])
    if (!firstErrorField) return

    focusField(firstErrorField)
  }

  const focusField = (field: keyof FormValues) => {
    switch (field) {
      case 'amount':
        amount.current?.focus()
        break
      case 'years':
        years.current?.focus()
        break
      case 'rate':
        rate.current?.focus()
        break
      case 'type':
        type.current?.focus()
        break
      default:
        assertNever(field)
        break
    }
  }

  const handleReset = () => {
    setErrors({})
    onClearResult()
    setFormValues(initialValues)
    setHasSubmitted(false)
  }
  
  const handleChange = (nextValues: FormValues) => {
    setFormValues(nextValues)
    if (!hasSubmitted) {
      return
    }
    validateAndApply(nextValues)
  }

  const handleTextChange = (field: StringFieldGroup, value: string) => {
    handleChange({...formValues, [field]: value})
  }

  return (
    <form className={`flex flex-col ${styles.form}`} onSubmit={handleSubmit} noValidate>
      <div className={`flex ${styles.titleHeader}`}>
        <h1 className={styles.pageTitle}>Mortgage Calculator</h1>
        <button
          className={styles.resetBtn}
          type="button"
          onClick={handleReset}
        >
          Clear All
        </button>
      </div>

      <div className={`flex flex-col ${styles.formGroup}`}>
        <label htmlFor="amount">Mortgage Amount</label>
        <div className={`grid ${styles.textFieldGroupLeft} ${styles.border}`}>
          <span className={styles.textLabel} aria-hidden="true" >£</span>
          <input 
            className={styles.textField} 
            type="text" 
            id="amount"
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={errors.amount ? "error-amount" : undefined} 
            value={formValues.amount}
            onChange={(e) => {
              handleTextChange('amount', e.target.value)
            }}
            inputMode="decimal"
            ref={amount}
          />
        </div>
        {errors.amount && <div className={styles.errorText} id="error-amount" >{errors.amount}</div>}
      </div>

      <div className={`grid ${styles.fieldGroupContainer}`}>
        <div className={`flex flex-col ${styles.formGroup}`}>
          <label htmlFor="years">Mortgage Term</label>
          <div className={`grid ${styles.textFieldGroupRight} ${styles.border}`}>
            <input
              className={styles.textField} 
              type="text" 
              id="years"
              aria-invalid={Boolean(errors.years)}
              aria-describedby={errors.years ? "term error-years" : 'term'}
              value={formValues.years}
              onChange={(e) => {
                handleTextChange('years', e.target.value)
              }}
              inputMode="numeric"
              ref={years}
            />
            <span className={styles.textLabel} id='term' aria-hidden="true" >years</span>
          </div>
          {errors.years && <div className={styles.errorText} id="error-years" >{errors.years}</div>}
        </div>

        <div className={`flex flex-col ${styles.formGroup}`}>
          <label htmlFor="rate">Interest Rate</label>
          <div className={`grid ${styles.textFieldGroupRight} ${styles.border}`}>
            <span className={styles.textLabel} aria-hidden="true" >%</span>
            <input 
              className={styles.textField} 
              type="text" 
              id="rate"
              aria-invalid={Boolean(errors.rate)}
              aria-describedby={errors.rate ? "error-rate" : undefined}
              value={formValues.rate}
              onChange={(e) => {
                handleTextChange('rate', e.target.value)
              }}
              inputMode="decimal"
              ref={rate}
            />
          </div>
          {errors.rate && <div className={styles.errorText} id="error-rate" >{errors.rate}</div>}
        </div>
      </div>

      <fieldset 
        className={`flex flex-col ${styles.radioSet}`}
        aria-invalid={Boolean(errors.type)}
        aria-describedby={errors.type ? "error-type": undefined}
        role="radiogroup"
      >
        <legend className={styles.fieldsetTitle}>Mortgage Type</legend>

        {MORTGAGE_TYPES.map((v, i) => (
          <div className={`${styles.border} ${styles.radioGroup}`} key={v}>
            <label className={`grid ${styles.radioLabel}`}>
              <input 
                className={styles.radioField} 
                type="radio" 
                name='mortgageType' 
                value={v}
                checked={formValues.type === v}
                onChange={() => {
                  handleChange({...formValues, type: v})
                }}
                ref={i === 0 ? type : undefined}
              />
              {MORTGAGE_TYPE_LABELS[v]}
            </label>
          </div>
        ))}
        {errors.type && <div className={styles.errorText} id="error-type" >{errors.type}</div>}
      </fieldset>

      <button className={`flex flex-row ${styles.submitBtn}`} type="submit">
        <CalcIcon aria-hidden="true" />
        Calculate Repayments
      </button>
    </form>
  )
}

export default CalcForm