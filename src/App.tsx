import { useEffect, useState } from 'react'
import type { Choice, GameState } from './engine/types'
import { CHAPTERS } from './data'
import { applyChoice, initState } from './engine/story'
import { resolveOutcome } from './engine/outcome'
import type { Outcome } from './engine/outcome'
import { decodeOutcome, encodeOutcome } from './engine/share'
import { REPO_URL } from './config'
import { I18nProvider, useI18n } from './i18n'
import LangToggle from './components/LangToggle'
import Title from './components/Title'
import Scene from './components/Scene'
import Result from './components/Result'

const clearHash = () => history.replaceState(null, '', window.location.pathname + window.location.search)

function Shell() {
  const { t } = useI18n()
  const [state, setState] = useState<GameState>(initState)
  const [phase, setPhase] = useState<'title' | 'play' | 'result'>('title')
  const [outcome, setOutcome] = useState<Outcome | null>(null)

  // A shared #o=... link opens that result directly.
  useEffect(() => {
    const shared = decodeOutcome(window.location.hash)
    if (shared) {
      setOutcome(shared)
      setPhase('result')
    }
  }, [])

  const start = () => {
    setState(initState())
    setOutcome(null)
    setPhase('play')
    clearHash()
  }
  const restart = () => {
    setState(initState())
    setOutcome(null)
    setPhase('title')
    clearHash()
  }
  function choose(choice: Choice) {
    const next = applyChoice(state, choice)
    if (next.step >= CHAPTERS.length) {
      const result = resolveOutcome(next)
      setState(next)
      setOutcome(result)
      setPhase('result')
      window.location.hash = encodeOutcome(result)
    } else {
      setState(next)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="bg-pitch text-white">
        <div className="mx-auto flex max-w-xl items-center justify-between px-5 py-3">
          <button onClick={restart} className="text-lg font-extrabold tracking-tight">
            ⚽️🔄 {t('appName')}
          </button>
          <LangToggle />
        </div>
      </header>

      <main className="flex-1">
        {phase === 'title' && <Title onStart={start} />}
        {phase === 'play' && (
          <Scene chapter={CHAPTERS[state.step]} state={state} total={CHAPTERS.length} onChoose={choose} />
        )}
        {phase === 'result' && outcome && (
          <Result outcome={outcome} moments={state.moments} onRestart={restart} />
        )}
      </main>

      <footer className="py-6 text-center text-xs text-neutral-400">
        <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="transition hover:text-pitch">
          {t('github')}
        </a>
        <span className="mx-2">·</span>
        {t('footer')}
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <I18nProvider>
      <Shell />
    </I18nProvider>
  )
}
