import { useEffect, useState } from 'react'
import { getAnalysisHistory } from '../services/resumeService'

function History({ onBack }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getAnalysisHistory()

        const historyList = Array.isArray(data)
          ? data
          : Array.isArray(data?.history)
            ? data.history
            : Array.isArray(data?.analyses)
              ? data.analyses
              : []

        setHistory(historyList)
      } catch (error) {
        setError(error.message || 'Failed to load analysis history.')
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [])

  return (
    <main className="min-h-screen bg-[#0d2024] text-[#edf5f2]">

      {/* HEADER */}

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
            History
          </span>

        </div>
      </header>

      {/* CONTENT */}

      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:py-14">

        {/* TITLE */}

        <section className="border-b border-white/[0.07] pb-8">

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8fcdbc]">
            Activity
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#f0f5f2] sm:text-4xl">
            Analysis history
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#879d99]">
            Review your previous resume analyses and the scores you received.
          </p>

        </section>

        {/* ERROR */}

        {error && (
          <div className="mt-8 border border-[#d89572]/20 bg-[#d89572]/[0.07] px-5 py-4 text-sm text-[#e3ad96]">
            {error}
          </div>
        )}

        {/* LOADING */}

        {loading && (
          <div className="mt-8 border border-white/[0.08] bg-[#142c30]/60 p-10 text-center">

            <div className="flex items-center justify-center gap-3 text-sm text-[#8da39f]">

              <span className="h-2 w-2 animate-pulse rounded-full bg-[#8fcdbc]" />

              Loading analysis history

            </div>

          </div>
        )}

        {/* EMPTY */}

        {!loading && !error && history.length === 0 && (
          <div className="mt-8 border border-dashed border-white/[0.12] bg-[#142c30]/40 px-6 py-16 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[#8fcdbc]/15 bg-[#8fcdbc]/[0.06] text-xl text-[#8fcdbc]">
              —
            </div>

            <h2 className="mt-5 text-lg font-semibold text-[#dce8e4]">
              No analysis history
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#718986]">
              Once you analyze a resume, your results will appear here.
            </p>

          </div>
        )}

        {/* HISTORY */}

        {!loading && history.length > 0 && (
          <section className="mt-8">

            <div className="mb-4 flex items-center justify-between">

              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#718986]">
                Previous analyses
              </p>

              <span className="text-xs text-[#617a76]">
                {history.length}{' '}
                {history.length === 1
                  ? 'analysis'
                  : 'analyses'}
              </span>

            </div>

            <div className="grid gap-3">

              {history.map((item, index) => {

                const score =
                  item.score ??
                  item.overallScore ??
                  item.resumeScore ??
                  null

                const resumeName =
                  item.originalname ||
                  item.originalName ||
                  item.filename ||
                  item.fileName ||
                  item.resumeName ||
                  `Resume ${index + 1}`

                const date =
                  item.createdAt ||
                  item.created_at ||
                  item.analyzedAt ||
                  item.analyzed_at

                return (
                  <div
                    key={
                      item.id ||
                      item.analysis_id ||
                      index
                    }
                    className="flex flex-col gap-5 border border-white/[0.08] bg-[#142c30]/65 p-5 transition duration-200 hover:border-[#8fcdbc]/20 hover:bg-[#173237] sm:flex-row sm:items-center sm:justify-between"
                  >

                    {/* LEFT */}

                    <div className="flex min-w-0 items-center gap-4">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#8fcdbc]/15 bg-[#8fcdbc]/[0.06] text-xs font-bold text-[#8fcdbc]">
                        CV
                      </div>

                      <div className="min-w-0">

                        <h3 className="truncate text-sm font-semibold text-[#dce8e4]">
                          {resumeName}
                        </h3>

                        <p className="mt-1 text-xs text-[#718986]">
                          {date
                            ? formatDate(date)
                            : 'Analysis completed'}
                        </p>

                      </div>

                    </div>

                    {/* RIGHT */}

                    <div className="flex items-center gap-6">

                      <div className="text-right">

                        <p className="text-[10px] uppercase tracking-[0.14em] text-[#617a76]">
                          Score
                        </p>

                        <p className="mt-1 text-xl font-semibold text-[#8fcdbc]">
                          {score !== null
                            ? score
                            : '—'}
                        </p>

                      </div>

                      <div className="h-8 w-px bg-white/[0.08]" />

                      <span className="border border-[#8fcdbc]/15 bg-[#8fcdbc]/[0.05] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8fcdbc]">
                        Analyzed
                      </span>

                    </div>

                  </div>
                )
              })}

            </div>

          </section>
        )}

      </div>
    </main>
  )
}

function formatDate(value) {
  try {
    return new Date(value).toLocaleString([], {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return 'Analysis completed'
  }
}

export default History