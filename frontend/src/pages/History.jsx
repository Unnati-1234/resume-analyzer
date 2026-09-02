import { useEffect, useState } from "react";

import { getAnalysisHistory } from "../services/resumeService";

function History({ onBack }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAnalysisHistory();

        const historyList = Array.isArray(data)
          ? data
          : Array.isArray(data?.history)
          ? data.history
          : Array.isArray(data?.analyses)
          ? data.analyses
          : [];

        setHistory(historyList);
      } catch (error) {
        setError(error.message || "Failed to load analysis history.");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const getScore = (item) => {
    const value =
      item.score ??
      item.overallScore ??
      item.resumeScore ??
      item.overall_score;

    if (value === null || value === undefined || value === "") {
      return null;
    }

    return Number(value);
  };

  const getResumeName = (item, index) => {
    return (
      item.originalname ||
      item.originalName ||
      item.filename ||
      item.fileName ||
      item.resumeName ||
      `Resume ${index + 1}`
    );
  };

  const getDate = (item) => {
    return (
      item.createdAt ||
      item.created_at ||
      item.analyzedAt ||
      item.analyzed_at
    );
  };

  const getScoreLabel = (score) => {
    if (score === null) return "Not available";
    if (score >= 80) return "Strong profile";
    if (score >= 60) return "Good profile";
    if (score >= 40) return "Needs improvement";
    return "Needs attention";
  };

  const getScoreColor = (score) => {
    if (score === null) return "text-[#94A3B8]";
    if (score >= 60) return "text-[#10B981]";
    if (score >= 40) return "text-[#F59E0B]";
    return "text-[#EF4444]";
  };

  const getScoreBarColor = (score) => {
    if (score === null) return "bg-[#64748B]";
    if (score >= 60) return "bg-[#10B981]";
    if (score >= 40) return "bg-[#F59E0B]";
    return "bg-[#EF4444]";
  };

  return (
    <main className="min-h-screen bg-[#080C18] text-[#F8FAFC]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#0D1220]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#6366F1]/30 bg-[#6366F1]/10">
              <span className="text-sm font-bold text-[#818CF8]">RA</span>
            </div>

            <div>
              <p className="text-sm font-semibold tracking-[-0.01em] text-[#F8FAFC]">
                Resume Analyzer
              </p>
              <p className="hidden text-[10px] uppercase tracking-[0.16em] text-[#64748B] sm:block">
                Career intelligence
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                Analysis history
              </span>
            </div>

            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-[#121827] px-3.5 py-2 text-xs font-medium text-[#CBD5E1] transition hover:border-[#6366F1]/30 hover:bg-[#161D2D] hover:text-[#F8FAFC]"
            >
              <span>←</span>
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        {/* Hero */}
        <section className="rounded-2xl border border-white/[0.08] bg-[#121827] shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
          <div className="flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#10B981]">
                  Resume intelligence
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#F8FAFC] sm:text-4xl lg:text-5xl">
                Analysis history
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-[#94A3B8]">
                Review your previous resume evaluations, scores, and profile
                insights in one place.
              </p>
            </div>

            {/* Total */}
            <div className="border-t border-white/[0.08] pt-6 lg:min-w-[190px] lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#64748B]">
                Total analyses
              </p>

              <p className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-[#F8FAFC]">
                {loading ? "—" : history.length}
              </p>

              <p className="mt-1 text-xs text-[#64748B]">
                Saved in your workspace
              </p>
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mt-6 flex items-start gap-4 rounded-xl border border-[#EF4444]/20 bg-[#EF4444]/[0.06] p-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#EF4444]/20 bg-[#EF4444]/10 text-sm font-semibold text-[#EF4444]">
              !
            </div>

            <div>
              <p className="text-sm font-medium text-[#FCA5A5]">
                Unable to load history
              </p>

              <p className="mt-1 text-xs leading-5 text-[#94A3B8]">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <section className="mt-8">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="h-3 w-28 animate-pulse rounded bg-white/[0.06]" />
                <div className="mt-3 h-5 w-40 animate-pulse rounded bg-white/[0.05]" />
              </div>

              <div className="h-7 w-16 animate-pulse rounded-lg bg-white/[0.05]" />
            </div>

            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/[0.08] bg-[#121827] p-5 sm:p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 shrink-0 animate-pulse rounded-lg bg-white/[0.06]" />

                    <div className="flex-1 space-y-3">
                      <div className="h-3 w-48 animate-pulse rounded bg-white/[0.06]" />
                      <div className="h-2.5 w-32 animate-pulse rounded bg-white/[0.04]" />
                    </div>

                    <div className="hidden space-y-2 sm:block">
                      <div className="ml-auto h-6 w-12 animate-pulse rounded bg-white/[0.05]" />
                      <div className="h-2 w-20 animate-pulse rounded bg-white/[0.04]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!loading && !error && history.length === 0 && (
          <section className="mt-8 rounded-2xl border border-dashed border-white/[0.1] bg-[#121827]">
            <div className="px-6 py-20 text-center sm:py-24">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-[#6366F1]/20 bg-[#6366F1]/10">
                <span className="text-xl font-light text-[#818CF8]">+</span>
              </div>

              <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#64748B]">
                Nothing here yet
              </p>

              <h2 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-[#F8FAFC]">
                Your analysis archive is empty
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#94A3B8]">
                Analyze a resume from your dashboard and your results will
                automatically appear here.
              </p>

              <button
                type="button"
                onClick={onBack}
                className="mt-7 rounded-lg bg-[#6366F1] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#818CF8] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/30"
              >
                Return to dashboard
              </button>
            </div>
          </section>
        )}

        {/* History List */}
        {!loading && history.length > 0 && (
          <section className="mt-10">
            {/* Section Header */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#64748B]">
                  Saved activity
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-[#F8FAFC]">
                  Previous analyses
                </h2>
              </div>

              <span className="self-start rounded-lg border border-white/[0.08] bg-[#121827] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">
                {history.length}{" "}
                {history.length === 1 ? "analysis" : "analyses"}
              </span>
            </div>

            {/* List */}
            <div className="space-y-3">
              {history.map((item, index) => {
                const score = getScore(item);
                const resumeName = getResumeName(item, index);
                const date = getDate(item);

                return (
                  <article
                    key={item.id || item.analysis_id || index}
                    className="group rounded-xl border border-white/[0.08] bg-[#121827] transition duration-200 hover:border-white/[0.14] hover:bg-[#161D2D]"
                  >
                    <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                      {/* Left */}
                      <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                        {/* Resume Icon */}
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#6366F1]/20 bg-[#6366F1]/10">
                          <svg
                            className="h-5 w-5 text-[#818CF8]"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10A.5.5 0 0 1 7 20V3.5Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14 3.5V8h4"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.5 12h5M9.5 15h5"
                            />
                          </svg>
                        </div>

                        {/* File Info */}
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-[#F8FAFC] sm:text-[15px]">
                            {resumeName}
                          </h3>

                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                            <span className="text-xs text-[#94A3B8]">
                              {date
                                ? formatDate(date)
                                : "Analysis completed"}
                            </span>

                            <span className="hidden h-1 w-1 rounded-full bg-[#475569] sm:block" />

                            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#64748B]">
                              Resume analysis
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right */}
                      <div className="flex flex-col gap-4 border-t border-white/[0.08] pt-4 sm:flex-row sm:items-center sm:justify-between sm:border-t-0 sm:pt-0 lg:justify-end lg:gap-7">
                        {/* Score */}
                        <div className="flex items-center gap-5">
                          <div className="text-left sm:text-right">
                            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#64748B]">
                              Score
                            </p>

                            <p
                              className={`mt-1 text-2xl font-semibold tracking-[-0.04em] ${getScoreColor(
                                score
                              )}`}
                            >
                              {score !== null ? score : "—"}
                            </p>
                          </div>

                          {/* Score Bar */}
                          <div className="hidden w-28 sm:block">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-[9px] text-[#64748B]">
                                {getScoreLabel(score)}
                              </span>

                              {score !== null && (
                                <span className="text-[9px] text-[#64748B]">
                                  /100
                                </span>
                              )}
                            </div>

                            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${getScoreBarColor(
                                  score
                                )}`}
                                style={{
                                  width: `${
                                    score !== null
                                      ? Math.min(
                                          Math.max(score, 0),
                                          100
                                        )
                                      : 0
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex w-fit items-center gap-2 rounded-lg border border-[#10B981]/15 bg-[#10B981]/[0.06] px-3 py-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />

                          <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#10B981]">
                            Analyzed
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* Footer */}
        {!loading && history.length > 0 && (
          <footer className="mt-10 border-t border-white/[0.08] pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] leading-5 text-[#64748B]">
                Your previous resume analysis results are stored in your
                workspace.
              </p>

              <button
                type="button"
                onClick={onBack}
                className="self-start text-[10px] font-semibold uppercase tracking-[0.16em] text-[#94A3B8] transition hover:text-[#818CF8]"
              >
                Back to dashboard →
              </button>
            </div>
          </footer>
        )}
      </div>
    </main>
  );
}

function formatDate(value) {
  try {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Analysis completed";
    }

    return date.toLocaleString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Analysis completed";
  }
}

export default History;