import { useState } from 'react'
import { matchResumeWithJob } from '../services/resumeService'

function JobMatch({ resumeId, resumeName, onBack }) {
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleMatch = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description first.')
      return
    }

    try {
      setLoading(true)
      setError('')
      setResult(null)

      const data = await matchResumeWithJob(
        resumeId,
        jobDescription.trim()
      )

      setResult(data?.result || data?.match || data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const score =
    result?.score ??
    result?.matchScore ??
    result?.compatibilityScore ??
    null

  const strengths =
    result?.strengths ||
    result?.matchingSkills ||
    []

  const missingSkills =
    result?.missingSkills ||
    result?.skillGaps ||
    result?.missing ||
    []

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
            Job matching
          </span>

        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:py-14">

        {/* TITLE */}
        <section className="border-b border-white/[0.07] pb-8">

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8fcdbc]">
            Career fit
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#f0f5f2] sm:text-4xl">
            Match your resume
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#879d99]">
            Compare your resume against a job description to identify
            strengths and skill gaps.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 border border-white/[0.07] bg-[#142c30]/60 px-3 py-2 text-xs text-[#8da39f]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8fcdbc]" />

            {resumeName}
          </div>

        </section>

        {/* INPUT */}
        <section className="mt-8 border border-white/[0.08] bg-[#142c30]/70 p-6 sm:p-7">

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718986]">
                Job description
              </p>

              <h2 className="mt-2 text-lg font-semibold text-[#e8f1ee]">
                Paste the role you're applying for
              </h2>
            </div>

            <span className="hidden text-xs text-[#617a76] sm:block">
              {jobDescription.length} characters
            </span>
          </div>

          <textarea
            value={jobDescription}
            onChange={(event) =>
              setJobDescription(event.target.value)
            }
            placeholder="Paste the complete job description here..."
            rows={12}
            className="mt-6 w-full resize-y border border-white/[0.08] bg-[#0d2024]/70 p-5 text-sm leading-6 text-[#dce8e4] outline-none transition placeholder:text-[#536c68] focus:border-[#8fcdbc]/35"
          />

          {error && (
            <div className="mt-4 border border-[#d89572]/20 bg-[#d89572]/[0.07] px-5 py-4 text-sm text-[#e3ad96]">
              {error}
            </div>
          )}

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={handleMatch}
              disabled={loading}
              className="flex min-w-[160px] items-center justify-center gap-2 bg-[#8fcdbc] px-5 py-3 text-sm font-semibold text-[#10282c] transition hover:bg-[#a5ddcd] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#10282c]/30 border-t-[#10282c]" />
                  Analyzing...
                </>
              ) : (
                'Analyze match'
              )}
            </button>
          </div>

        </section>

        {/* RESULTS */}
        {result && (
          <section className="mt-8">

            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#718986]">
                Match results
              </p>

              <h2 className="mt-2 text-xl font-semibold text-[#e8f1ee]">
                How well you fit this role
              </h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-[240px_1fr]">

              {/* SCORE */}
              <div className="border border-white/[0.08] bg-[#142c30]/75 p-6">

                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718986]">
                  Match score
                </p>

                <div className="mt-5">
                  <span className="text-5xl font-semibold tracking-tight text-[#8fcdbc]">
                    {score ?? '—'}
                  </span>

                  {score !== null && (
                    <span className="ml-2 text-sm text-[#637c78]">
                      / 100
                    </span>
                  )}
                </div>

                <div className="mt-6 h-1.5 overflow-hidden bg-white/[0.06]">
                  <div
                    className="h-full bg-[#8fcdbc] transition-all duration-500"
                    style={{
                      width:
                        typeof score === 'number'
                          ? `${Math.min(Math.max(score, 0), 100)}%`
                          : '0%',
                    }}
                  />
                </div>

              </div>

              {/* SUMMARY */}
              <div className="border border-white/[0.08] bg-[#142c30]/75 p-6">

                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718986]">
                  Assessment
                </p>

                <p className="mt-4 text-sm leading-7 text-[#9aadaa]">
                  {result?.summary ||
                    result?.feedback ||
                    result?.assessment ||
                    'Your job compatibility analysis has been completed.'}
                </p>

              </div>

            </div>

            {/* SKILLS */}
            <div className="mt-4 grid gap-4 lg:grid-cols-2">

              <ResultList
                title="Matching strengths"
                items={strengths}
                emptyText="No matching strengths were returned."
              />

              <ResultList
                title="Skills to improve"
                items={missingSkills}
                emptyText="No skill gaps were returned."
              />

            </div>

            {/* RECOMMENDATIONS */}
            <div className="mt-4 border border-white/[0.08] bg-[#142c30]/75 p-6">

              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718986]">
                Recommendations
              </p>

              <p className="mt-4 text-sm leading-7 text-[#9aadaa]">
                {result?.recommendations ||
                  result?.recommendation ||
                  'Review the missing skills and tailor your resume to better reflect the requirements of this role.'}
              </p>

            </div>

          </section>
        )}

      </div>
    </main>
  )
}

function ResultList({
  title,
  items,
  emptyText,
}) {
  return (
    <div className="border border-white/[0.08] bg-[#142c30]/75 p-6">

      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718986]">
        {title}
      </p>

      {Array.isArray(items) && items.length > 0 ? (
        <div className="mt-5 space-y-2">

          {items.map((item, index) => (
            <div
              key={index}
              className="flex gap-3 border border-white/[0.06] bg-[#10272b]/70 p-4"
            >
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8fcdbc]" />

              <p className="text-sm leading-6 text-[#9aadaa]">
                {typeof item === 'string'
                  ? item
                  : item?.name ||
                    item?.skill ||
                    item?.text ||
                    item?.description ||
                    JSON.stringify(item)}
              </p>
            </div>
          ))}

        </div>
      ) : (
        <p className="mt-4 text-sm text-[#718986]">
          {emptyText}
        </p>
      )}

    </div>
  )
}

export default JobMatch