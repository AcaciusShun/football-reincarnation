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
            ⚽️ {t('appName')}
          </button>
          <div className="flex items-center gap-3">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-white/80 transition hover:text-white"
            >
              <svg viewBox="0 0 16 16" width="22" height="22" fill="currentColor" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
            <LangToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {phase === 'title' && <Title onStart={start} />}
        {phase === 'play' && (
          <Scene chapter={CHAPTERS[state.step]} state={state} total={CHAPTERS.length} onChoose={choose} />
        )}
        {phase === 'result' && outcome && (
          <Result outcome={outcome} moments={state.moments} flops={state.flops} onRestart={restart} />
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
