import { useState } from 'react'
import LandingPage from './LandingPage.jsx'
import IntakeFlow from './IntakeFlow.jsx'
import Board from './Board.jsx'
import Scholarships from './Scholarships.jsx'

export default function App() {
  const [view, setView]       = useState('landing') // 'landing' | 'intake' | 'board' | 'scholarships'
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
        onGoToScholarships={() => setView('scholarships')}
      />
    )
  }
  if (view === 'scholarships') {
    return (
      <Scholarships
        answers={answers}
        onGoToBoard={answers ? () => setView('board') : null}
        onStartOver={() => { setAnswers(null); setView('intake') }}
        onBack={() => setView(answers ? 'board' : 'landing')}
      />
    )
  }
  return (
    <LandingPage
      onShowBoard={() => setView('intake')}
      onGoToScholarships={() => setView('scholarships')}
    />
  )
}
