import { useState } from 'react'
import type { MortgageResult, ValidInput } from './types'
import getResult from './calculate'

import CalcForm from './components/CalcForm'
import CalcResult from './components/CalcResult'

import './App.css'

function App() {
  const [result, setResult] = useState<MortgageResult | null>(null)

  const calculate = (data: ValidInput) => {
    setResult(getResult(data))
  }

  const clearResult = () => {
    setResult(null)
  }

  return (
    <main>
      <div className='wrapper grid'>
        <CalcForm onCalculate={calculate} onClearResult={clearResult} />
        <CalcResult result={result} />
      </div>
    </main>
  )
}

export default App
