import { useState } from "react";

import { matchResumeWithJob } from "../services/resumeService";

function JobMatch({ resumeId, resumeName, onBack }) {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMatch = async () => {
    if (!jobDescription.trim()) {
      setError("Please paste a job description first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const data = await matchResumeWithJob(
        resumeId,
        jobDescription.trim()
      );

      setResult(data?.result || data?.match || data);
    } catch (error) {
      setError(error.message || "Failed to analyze job match.");
    } finally {
      setLoading(false);
    }
  };

  const score =
    result?.matchScore ??
    result?.score ??
    result?.compatibilityScore ??
    null;

  const matchLevel =
    result?.matchLevel ||
    (typeof score === "number"
      ? score >= 80
        ? "Excellent"
        : score >= 60
        ? "Good"
        : score >= 40
        ? "Moderate"
        : "Low"
      : null);

  const strengths =
    result?.matchingSkills ||
    result?.strengths ||
    [];

  const missingSkills =
    result?.missingSkills ||
    result?.skillGaps ||
    result?.missing ||
    [];

  const recommendations = result?.recommendations || [];

  return (
    <main className="min-h-screen bg-[#080C18] text-white">

      {/* HEADER */}
      <header className="border-b border-white/[0.08] bg-[#0D1220]">
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">

          <button
            type="button"
            onClick={onBack}
            className="group flex items-center gap-2 text-sm font-medium text-[#94A3B8] transition hover:text-white"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-1">
              ←
            </span>

            Dashboard
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#6366F1]/20 bg-[#6366F1]/10 text-[10px] font-bold text-[#818CF8]">
              RA
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-[#F8FAFC]">
                Resume Analyzer
              </p>

              <p className="text-[10px] uppercase tracking-[0.14em] text-[#64748B]">
                Job matching
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8 lg:px-10 lg:py-12">

        {/* PAGE INTRO */}
        <section className="mb-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#10B981]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#10B981]">
                  Career fit
                </span>
              </div>

              <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.035em] text-[#F8FAFC] sm:text-4xl lg:text-5xl">
                Match your resume
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#94A3B8]">
                Compare your resume against a job description to identify
                matching strengths, missing skills, and your overall
                compatibility with the role.
              </p>
            </div>

            <div className="hidden min-w-[220px] rounded-xl border border-white/[0.08] bg-[#121827] px-5 py-4 lg:block">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                Selected resume
              </p>

              <p className="mt-2 truncate text-sm font-medium text-[#CBD5E1]">
                {resumeName}
              </p>
            </div>

          </div>

          {/* MOBILE RESUME */}
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#121827] px-4 py-3 lg:hidden">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#10B981]/10">
              <span className="h-2 w-2 rounded-full bg-[#10B981]" />
            </span>

            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#64748B]">
                Selected resume
              </p>

              <p className="mt-0.5 truncate text-xs font-medium text-[#CBD5E1]">
                {resumeName}
              </p>
            </div>
          </div>
        </section>

        {/* JOB DESCRIPTION */}
        <section className="rounded-2xl border border-white/[0.08] bg-[#121827] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] sm:p-7">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                Job description
              </p>

              <h2 className="mt-2 text-lg font-semibold text-[#F8FAFC]">
                Paste the role you're applying for
              </h2>
            </div>

            <span className="text-xs text-[#64748B]">
              {jobDescription.length} characters
            </span>

          </div>

          <textarea
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder="Paste the complete job description here..."
            rows={12}
            className="mt-6 w-full resize-y rounded-xl border border-white/[0.08] bg-[#0D1220] p-5 text-sm leading-7 text-[#CBD5E1] outline-none transition placeholder:text-[#475569] focus:border-[#6366F1]/60 focus:ring-1 focus:ring-[#6366F1]/20"
          />

          {error && (
            <div className="mt-4 rounded-xl border border-[#EF4444]/20 bg-[#EF4444]/[0.06] px-5 py-4 text-sm text-[#FCA5A5]">
              {error}
            </div>
          )}

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={handleMatch}
              disabled={loading}
              className="flex min-w-[170px] items-center justify-center gap-2 rounded-xl bg-[#6366F1] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(99,102,241,0.18)] transition hover:bg-[#818CF8] hover:shadow-[0_10px_28px_rgba(99,102,241,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Analyzing...
                </>
              ) : (
                "Analyze Match"
              )}
            </button>
          </div>
        </section>

        {/* RESULTS */}
        {result && (
          <section className="mt-14">

            <div className="mb-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#10B981]">
                Match results
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-[#F8FAFC]">
                How well you fit this role
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                Review your compatibility score, strengths, skill gaps,
                and recommended improvements.
              </p>
            </div>

            {/* SCORE + ASSESSMENT */}
            <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">

              {/* SCORE */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#121827] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)] sm:p-7">

                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                  Match score
                </p>

                <div className="mt-5 flex items-end gap-2">
                  <span className="text-6xl font-semibold tracking-[-0.06em] text-[#F8FAFC]">
                    {typeof score === "number"
                      ? Math.min(Math.max(score, 0), 100)
                      : "—"}
                  </span>

                  {typeof score === "number" && (
                    <span className="mb-2 text-sm text-[#64748B]">
                      /100
                    </span>
                  )}
                </div>

                {typeof score === "number" && (
                  <>
                    <div className="mt-7">
                      <ScoreBar score={score} />
                    </div>

                    <div className="mt-2 flex justify-between text-[10px] text-[#64748B]">
                      <span>0</span>
                      <span>100</span>
                    </div>
                  </>
                )}

                {matchLevel && (
                  <div className="mt-6 flex items-center gap-3 rounded-xl border border-[#10B981]/15 bg-[#10B981]/[0.05] px-4 py-3">
                    <span className="h-2 w-2 rounded-full bg-[#10B981]" />

                    <div>
                      <p className="text-xs font-semibold text-[#10B981]">
                        {matchLevel} match
                      </p>

                      <p className="mt-0.5 text-[11px] text-[#64748B]">
                        Based on your resume and the provided role.
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* ASSESSMENT */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#121827] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)] sm:p-7">

                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                  Assessment
                </p>

                <p className="mt-5 text-sm leading-8 text-[#94A3B8]">
                  {result?.summary ||
                    result?.feedback ||
                    result?.assessment ||
                    "Your job compatibility analysis has been completed."}
                </p>

                {typeof score === "number" && (
                  <div className="mt-7 border-t border-white/[0.06] pt-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#64748B]">
                        Compatibility
                      </span>

                      <span className="text-xs font-semibold text-[#818CF8]">
                        {score}%
                      </span>
                    </div>

                    <div className="mt-3">
                      <ScoreBar score={score} />
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* STRENGTHS + GAPS */}
            <div className="mt-5 grid gap-5 lg:grid-cols-2">

              <ResultList
                title="Matching strengths"
                items={strengths}
                type="success"
                emptyText="No matching strengths were returned."
              />

              <ResultList
                title="Skills to improve"
                items={missingSkills}
                type="warning"
                emptyText="No skill gaps were returned."
              />

            </div>

            {/* RECOMMENDATIONS */}
            <div className="mt-5 rounded-2xl border border-white/[0.08] bg-[#121827] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.16)] sm:p-6">

              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                Recommendations
              </p>

              {Array.isArray(recommendations) &&
              recommendations.length > 0 ? (
                <div className="mt-5 space-y-3">

                  {recommendations.map((recommendation, index) => (
                    <div
                      key={index}
                      className="flex gap-4 rounded-xl border border-white/[0.07] bg-[#0D1220] p-4 sm:p-5"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#6366F1]/10 text-[11px] font-semibold text-[#818CF8]">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <p className="text-sm leading-7 text-[#94A3B8]">
                        {typeof recommendation === "string"
                          ? recommendation
                          : recommendation?.text ||
                            recommendation?.description ||
                            JSON.stringify(recommendation)}
                      </p>
                    </div>
                  ))}

                </div>
              ) : (
                <p className="mt-5 text-sm leading-7 text-[#64748B]">
                  Review the missing skills and tailor your resume to
                  better reflect the requirements of this role.
                </p>
              )}

            </div>

          </section>
        )}

      </div>
    </main>
  );
}

/* ============================================================
   SCORE BAR
============================================================ */

function ScoreBar({ score = 0 }) {
  const safeScore = Math.min(
    Math.max(Number(score) || 0, 0),
    100
  );

  return (
    <div className="h-2 overflow-hidden rounded-full bg-[#0D1220]">
      <div
        className="h-full rounded-full bg-[#6366F1] transition-all duration-700"
        style={{
          width: `${safeScore}%`,
        }}
      />
    </div>
  );
}

/* ============================================================
   RESULT LIST
============================================================ */

function ResultList({
  title,
  items,
  type,
  emptyText,
}) {
  const isSuccess = type === "success";

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#121827] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.16)] sm:p-6">

      <div className="flex items-center justify-between gap-4">

        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
          {title}
        </p>

        {Array.isArray(items) && items.length > 0 && (
          <span
            className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold ${
              isSuccess
                ? "bg-[#10B981]/10 text-[#10B981]"
                : "bg-[#F59E0B]/10 text-[#F59E0B]"
            }`}
          >
            {items.length}
          </span>
        )}

      </div>

      {Array.isArray(items) && items.length > 0 ? (
        <div className="mt-5 space-y-2.5">

          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#0D1220] px-4 py-3 transition hover:border-white/[0.12]"
            >

              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                  isSuccess
                    ? "bg-[#10B981]/10 text-[#10B981]"
                    : "bg-[#F59E0B]/10 text-[#F59E0B]"
                }`}
              >
                {isSuccess ? "✓" : "!"}
              </span>

              <p className="text-sm leading-6 text-[#CBD5E1]">
                {typeof item === "string"
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
        <p className="mt-5 text-sm leading-6 text-[#64748B]">
          {emptyText}
        </p>
      )}

    </div>
  );
}

export default JobMatch;