import { useState } from 'react'
import LandingPage from './LandingPage.jsx'
import IntakeFlow from './IntakeFlow.jsx'
import Board from './Board.jsx'

export default function App() {
  const [view, setView] = useState('landing') // 'landing' | 'intake' | 'board'
  const [answers, setAnswers] = useState(null)

  if (view === 'intake') {
    return (
      <IntakeFlow
        onComplete={(a) => { setAnswers(a); setView('board') }}
        onBack={() => setView('landing')}
      />
    )
  }
  if (view === 'board') {
    return (
      <Board
        answers={answers}
        onStartOver={() => { setAnswers(null); setView('intake') }}
      />
    )
  }
  return <LandingPage onShowBoard={() => setView('intake')} />
}
