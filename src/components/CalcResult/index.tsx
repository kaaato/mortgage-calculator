import EmptyIllustration from '../../assets/images/illustration-empty.svg?react'
import { type MortgageResult } from '../../types'
import formatCurrency from '../../currency'
import styles from './CalcResult.module.css'

interface Props {
  result: MortgageResult | null
}

const CalcResult = ({result}: Props) => {
  const isEmpty = !result
  return (
    <div className={`flex flex-col ${styles.result} ${isEmpty ? styles.emptyResult : styles.calcResult}`} aria-live='polite'>
      {isEmpty ? (
        <>
          <EmptyIllustration className={styles.emptyImg} aria-hidden="true" />
          <h2 className={styles.emptyTitle}>Results shown here</h2>
          <div className={styles.emptyText}>Complete the form and click “calculate repayments” to see what your monthly repayments would be.</div>
        </>
      )
      : (
        <>
          <h2 className={styles.calcTitle}>Your results</h2>
          <div className={styles.calcText}>Your results are shown below based on the information you provided. To adjust the results, edit the form and click “calculate repayments” again.</div>
          <div className={`flex flex-col ${styles.resultContainer}`}>
            <div>
              <div className={styles.calcText}>Your monthly repayments</div>
              <div className={styles.monthlyText}>
                {formatCurrency(result.monthly)}
              </div>
            </div>
            <div className={styles.line}></div>
            <div>
              <div className={styles.calcText}>Total you'll repay over the term</div>
              <div className={`${styles.totalText}`}>
                {formatCurrency(result.total)}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CalcResult
