import { useEffect, useState } from 'react'
import { getSavedAnalysis } from '../services/resumeService'

function Analysis({ resumeId, resumeName, onBack }) {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getSavedAnalysis(resumeId)

        setAnalysis(data?.analysis || data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (resumeId) {
      loadAnalysis()
    }
  }, [resumeId])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0d2024] text-[#edf5f2]">
        <div className="flex items-center gap-3 text-sm text-[#8da39f]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#8fcdbc]" />
          Loading analysis
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#0d2024] px-6 py-10 text-[#edf5f2]">
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-[#8fcdbc] transition hover:text-[#b0e0d3]"
          >
            ← Back to dashboard
          </button>

          <div className="mt-8 border border-[#d89572]/20 bg-[#d89572]/[0.07] p-6 text-sm text-[#e3ad96]">
            {error}
          </div>
        </div>
      </main>
    )
  }

  const score =
    analysis?.score ??
    analysis?.overallScore ??
    analysis?.resumeScore ??
    null

  const strengths =
    analysis?.strengths ||
    analysis?.keyStrengths ||
    []

  const weaknesses =
    analysis?.weaknesses ||
    analysis?.areasForImprovement ||
    []

  const suggestions =
    analysis?.suggestions ||
    analysis?.recommendations ||
    []

  return (
    <main className="min-h-screen bg-[#0d2024] text-[#edf5f2]">
      <header className="border-b border-white/[0.07] bg-[#10272b]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-6xl items-center justify-between px-6 sm:px-8">
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-medium text-[#8fcdbc] transition hover:text-[#b0e0d3]"
          >
            ← Dashboard
          </button>

          <span className="text-xs uppercase tracking-[0.16em] text-[#617a76]">
            Resume analysis
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:py-14">
        <section className="border-b border-white/[0.07] pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8fcdbc]">
            Analysis report
          </p>

          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.035em] text-[#f0f5f2] sm:text-4xl">
            {resumeName || 'Resume analysis'}
          </h1>

          <p className="mt-3 text-sm text-[#7f9692]">
            A breakdown of your resume and areas that can be improved.
          </p>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[240px_1fr]">
          <div className="border border-white/[0.08] bg-[#142c30]/75 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718986]">
              Overall score
            </p>

            <div className="mt-5 flex items-end gap-2">
              <span className="text-5xl font-semibold tracking-tight text-[#8fcdbc]">
                {score ?? '—'}
              </span>

              {score !== null && (
                <span className="mb-2 text-sm text-[#637c78]">/ 100</span>
              )}
            </div>

            <div className="mt-6 h-1.5 overflow-hidden bg-white/[0.06]">
              <div
                className="h-full bg-[#8fcdbc] transition-all"
                style={{
                  width:
                    typeof score === 'number'
                      ? `${Math.min(Math.max(score, 0), 100)}%`
                      : '0%',
                }}
              />
            </div>
          </div>

          <div className="border border-white/[0.08] bg-[#142c30]/75 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718986]">
              Summary
            </p>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#9aadaa]">
              {analysis?.summary ||
                analysis?.overallFeedback ||
                'Your resume analysis is available. Review the sections below for specific strengths and improvements.'}
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <AnalysisList
            title="Strengths"
            items={strengths}
            emptyText="No strengths were returned."
          />

          <AnalysisList
            title="Areas to improve"
            items={weaknesses}
            emptyText="No improvement areas were returned."
          />
        </section>

        <section className="mt-8 border border-white/[0.08] bg-[#142c30]/75 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718986]">
            Recommendations
          </p>

          {Array.isArray(suggestions) && suggestions.length > 0 ? (
            <div className="mt-5 space-y-3">
              {suggestions.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 border border-white/[0.06] bg-[#10272b]/70 p-4"
                >
                  <span className="text-xs font-semibold text-[#8fcdbc]">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <p className="text-sm leading-6 text-[#9aadaa]">
                    {typeof item === 'string'
                      ? item
                      : item?.text ||
                        item?.description ||
                        JSON.stringify(item)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-[#718986]">
              No recommendations were returned.
            </p>
          )}
        </section>
      </div>
    </main>
  )
}

function AnalysisList({ title, items, emptyText }) {
  return (
    <div className="border border-white/[0.08] bg-[#142c30]/75 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718986]">
        {title}
      </p>

      {Array.isArray(items) && items.length > 0 ? (
        <div className="mt-5 space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="border border-white/[0.06] bg-[#10272b]/70 p-4"
            >
              <p className="text-sm leading-6 text-[#9aadaa]">
                {typeof item === 'string'
                  ? item
                  : item?.text ||
                    item?.description ||
                    JSON.stringify(item)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-[#718986]">{emptyText}</p>
      )}
    </div>
  )
}

export default Analysis