import { useEffect, useState } from "react";
import { getSavedAnalysis } from "../services/resumeService";

function Analysis({ resumeId, resumeName, onBack }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getSavedAnalysis(resumeId);

        // Temporary debug so we can see the exact API response
        console.log("ANALYSIS API RESPONSE:", data);

        setAnalysis(data?.analysis || data);
      } catch (error) {
        setError(error.message || "Failed to load analysis");
      } finally {
        setLoading(false);
      }
    };

    if (resumeId) {
      loadAnalysis();
    }
  }, [resumeId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080C18] px-6 text-white">
        <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#121827] px-6 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.25)]">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#10B981]" />
          <span className="text-sm text-[#94A3B8]">
            Loading analysis...
          </span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#080C18] px-5 py-8 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <button
            type="button"
            onClick={onBack}
            className="mb-8 text-sm font-medium text-[#94A3B8] transition hover:text-white"
          >
            ← Back to dashboard
          </button>

          <div className="rounded-2xl border border-[#EF4444]/20 bg-[#121827] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.2)] sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EF4444]/10 text-sm font-bold text-[#EF4444]">
                !
              </div>

              <div>
                <p className="text-base font-semibold text-[#F8FAFC]">
                  Unable to load analysis
                </p>

                <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
                  {error}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!analysis) {
    return (
      <main className="min-h-screen bg-[#080C18] px-5 py-8 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <button
            type="button"
            onClick={onBack}
            className="mb-8 text-sm font-medium text-[#94A3B8] transition hover:text-white"
          >
            ← Back to dashboard
          </button>

          <div className="rounded-2xl border border-white/[0.08] bg-[#121827] p-7 shadow-[0_18px_50px_rgba(0,0,0,0.2)] sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
              Resume analysis
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#F8FAFC]">
              No analysis available
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#94A3B8]">
              Analyze this resume first to generate your resume insights.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const score = Number(
    analysis.overall_score ??
      analysis.overallScore ??
      0
  );

  const wordCount = Number(
    analysis.word_count ??
      analysis.wordCount ??
      0
  );

  const skillCount = Number(
    analysis.skill_count ??
      analysis.skillCount ??
      0
  );

  const sectionScore = Number(
    analysis.section_score ??
      analysis.sectionScore ??
      0
  );

  const skillScore = Number(
    analysis.skill_score ??
      analysis.skillScore ??
      0
  );

  const lengthScore = Number(
    analysis.length_score ??
      analysis.lengthScore ??
      0
  );

  const contentScore = Number(
    analysis.content_score ??
      analysis.contentScore ??
      0
  );

  const skills = Array.isArray(analysis.skills)
    ? analysis.skills
    : [];

  let sections = {};

  try {
    sections =
      typeof analysis.sections === "string"
        ? JSON.parse(analysis.sections)
        : analysis.sections || {};
  } catch {
    sections = {};
  }

  const recommendations = Array.isArray(
    analysis.recommendations
  )
    ? analysis.recommendations
    : [];

  /*
   * =========================================================
   * ATS COMPATIBILITY
   * =========================================================
   *
   * Supports multiple possible backend response formats:
   *
   * 1. ats_compatibility: {
   *      score: 75,
   *      checks: [...]
   *    }
   *
   * 2. atsCompatibility: {
   *      score: 75,
   *      checks: [...]
   *    }
   *
   * 3. ats: {
   *      score: 75,
   *      checks: [...]
   *    }
   *
   * 4. ats_score: 75
   *    ats_checks: [...]
   *
   * 5. atsScore: 75
   *    atsChecks: [...]
   */

  const atsCompatibility =
    analysis.ats_compatibility ||
    analysis.atsCompatibility ||
    analysis.ats ||
    {};

  const atsScore = Number(
    atsCompatibility?.score ??
      atsCompatibility?.ats_score ??
      atsCompatibility?.atsScore ??
      analysis.ats_score ??
      analysis.atsScore ??
      analysis.ats_compatibility_score ??
      analysis.atsCompatibilityScore ??
      0
  );

  let atsChecks = [];

  if (Array.isArray(atsCompatibility?.checks)) {
    atsChecks = atsCompatibility.checks;
  } else if (Array.isArray(atsCompatibility?.ats_checks)) {
    atsChecks = atsCompatibility.ats_checks;
  } else if (Array.isArray(atsCompatibility?.atsChecks)) {
    atsChecks = atsCompatibility.atsChecks;
  } else if (Array.isArray(analysis.ats_checks)) {
    atsChecks = analysis.ats_checks;
  } else if (Array.isArray(analysis.atsChecks)) {
    atsChecks = analysis.atsChecks;
  }

  console.log("ATS COMPATIBILITY:", atsCompatibility);
  console.log("ATS SCORE:", atsScore);
  console.log("ATS CHECKS:", atsChecks);

  const sectionLabels = {
    summary: "Professional Summary",
    skills: "Skills",
    experience: "Experience",
    education: "Education",
    projects: "Projects",
    certifications: "Certifications",
  };

  const getScoreLabel = (value) => {
    if (value >= 80) return "Strong";
    if (value >= 60) return "Good";
    if (value >= 40) return "Needs work";
    return "Weak";
  };

  const getATSLabel = (value) => {
    if (value >= 80) return "Excellent ATS compatibility";
    if (value >= 60) return "Good ATS compatibility";
    if (value >= 40) return "Moderate ATS compatibility";
    return "Low ATS compatibility";
  };

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
                Analysis report
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
                  Resume analysis
                </span>
              </div>

              <h1 className="max-w-4xl text-3xl font-semibold tracking-[-0.035em] text-[#F8FAFC] sm:text-4xl lg:text-5xl">
                {resumeName || "Resume analysis"}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#94A3B8]">
                A structured view of your resume performance,
                detected skills, document structure, content quality,
                and ATS compatibility.
              </p>
            </div>

            <div className="hidden min-w-[220px] rounded-xl border border-white/[0.08] bg-[#121827] px-5 py-4 lg:block">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                Resume
              </p>

              <p className="mt-2 truncate text-sm font-medium text-[#CBD5E1]">
                {resumeName}
              </p>
            </div>
          </div>
        </section>

        {/* OVERALL SCORE */}
        <section className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">

          <div className="rounded-2xl border border-white/[0.08] bg-[#121827] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.2)] sm:p-7">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                  Overall resume score
                </p>

                <div className="mt-4 flex items-end gap-2">
                  <span className="text-6xl font-semibold tracking-[-0.06em] text-[#F8FAFC]">
                    {Math.min(Math.max(score, 0), 100)}
                  </span>

                  <span className="mb-2 text-sm text-[#64748B]">
                    /100
                  </span>
                </div>

                <p className="mt-2 text-sm font-medium text-[#818CF8]">
                  {getScoreLabel(score)} resume profile
                </p>
              </div>

              <div className="w-full max-w-xs">
                <ScoreBar score={score} />

                <div className="mt-2 flex justify-between text-[10px] text-[#64748B]">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>
            </div>

            <div className="mt-7 border-t border-white/[0.06] pt-6">
              <p className="text-xs leading-6 text-[#64748B]">
                Based on resume structure, skills, content quality,
                document length, and ATS readiness.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <StatCard
              label="Word count"
              value={wordCount}
              description="Resume content"
            />

            <StatCard
              label="Skills detected"
              value={skillCount}
              description="Technical skills"
            />

            <StatCard
              label="Sections"
              value={Object.values(sections).filter(Boolean).length}
              description="Detected resume sections"
            />
          </div>
        </section>

        {/* ATS */}
        <section className="mt-14">
          <SectionHeading
            eyebrow="ATS compatibility"
            title="How ATS-friendly is your resume?"
            description="Understand how your resume performs against automated screening systems."
          />

          <div className="mt-6 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">

            {/* ATS SCORE */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#121827] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)] sm:p-7">

              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                ATS score
              </p>

              <div className="mt-5 flex items-end gap-2">
                <span className="text-5xl font-semibold tracking-[-0.05em] text-[#F8FAFC]">
                  {Math.min(Math.max(atsScore, 0), 100)}
                </span>

                <span className="mb-2 text-sm text-[#64748B]">
                  /100
                </span>
              </div>

              <div className="mt-6">
                <ScoreBar score={atsScore} />
              </div>

              <p className="mt-5 text-sm font-medium text-[#10B981]">
                {getATSLabel(atsScore)}
              </p>

              <p className="mt-2 text-xs leading-6 text-[#64748B]">
                Evaluates structure, keywords, contact information,
                action language, achievements and resume length.
              </p>
            </div>

            {/* ATS CHECKS */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#121827] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <p className="text-sm font-semibold text-[#F8FAFC]">
                    ATS compatibility checks
                  </p>

                  <p className="mt-1 text-xs text-[#64748B]">
                    Individual factors contributing to your ATS score.
                  </p>
                </div>

                <span className="shrink-0 rounded-lg border border-white/[0.08] bg-[#161D2D] px-3 py-1.5 text-[11px] text-[#94A3B8]">
                  {atsChecks.length} checks
                </span>
              </div>

              <div className="mt-6 space-y-3">
                {atsChecks.length > 0 ? (
                  atsChecks.map((check, index) => (
                    <ATSCheck
                      key={`${check?.name || "check"}-${index}`}
                      name={
                        check?.name ||
                        check?.label ||
                        check?.title ||
                        `ATS Check ${index + 1}`
                      }
                      passed={
                        check?.passed ??
                        check?.pass ??
                        check?.success ??
                        false
                      }
                      score={
                        check?.score ??
                        check?.value ??
                        check?.percentage ??
                        0
                      }
                    />
                  ))
                ) : (
                  <EmptyState text="ATS compatibility details are not available." />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SCORE BREAKDOWN */}
        <section className="mt-14">
          <SectionHeading
            eyebrow="Score breakdown"
            title="Where your resume stands"
            description="A detailed breakdown of the factors behind your overall score."
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <ScoreCard
              title="Section score"
              score={sectionScore}
              description="Resume structure and important sections."
            />

            <ScoreCard
              title="Skill score"
              score={skillScore}
              description="Relevant technical skills detected."
            />

            <ScoreCard
              title="Length score"
              score={lengthScore}
              description="How well your resume length fits the expected range."
            />

            <ScoreCard
              title="Content score"
              score={contentScore}
              description="Action verbs and measurable achievements."
            />
          </div>
        </section>

        {/* SKILLS */}
        <section className="mt-14">
          <SectionHeading
            eyebrow="Detected skills"
            title="Technical skills found"
            description="Technologies and skills detected from your resume."
          />

          <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#121827] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.16)] sm:p-7">
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-lg border border-[#6366F1]/20 bg-[#6366F1]/[0.08] px-3.5 py-2 text-xs font-medium text-[#A5B4FC] transition hover:border-[#6366F1]/35 hover:bg-[#6366F1]/[0.12]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#64748B]">
                No technical skills were detected.
              </p>
            )}
          </div>
        </section>

        {/* RESUME STRUCTURE */}
        <section className="mt-14">
          <SectionHeading
            eyebrow="Resume structure"
            title="Sections detected"
            description="See which important sections are present in your resume."
          />

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(sectionLabels).map(
              ([key, label]) => {
                const exists = Boolean(sections[key]);

                return (
                  <div
                    key={key}
                    className={`flex items-center justify-between rounded-xl border p-4 transition ${
                      exists
                        ? "border-[#10B981]/20 bg-[#10B981]/[0.045] hover:border-[#10B981]/30"
                        : "border-white/[0.07] bg-[#121827] hover:border-white/[0.12]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          exists
                            ? "bg-[#10B981]"
                            : "bg-[#475569]"
                        }`}
                      />

                      <span
                        className={`text-sm ${
                          exists
                            ? "text-[#CBD5E1]"
                            : "text-[#64748B]"
                        }`}
                      >
                        {label}
                      </span>
                    </div>

                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs ${
                        exists
                          ? "bg-[#10B981]/10 text-[#10B981]"
                          : "bg-white/[0.04] text-[#475569]"
                      }`}
                    >
                      {exists ? "✓" : "—"}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </section>

        {/* RECOMMENDATIONS */}
        <section className="mt-14">
          <SectionHeading
            eyebrow="Action items"
            title="Recommendations"
            description="Practical improvements you can make to strengthen your resume."
          />

          <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#121827] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.16)] sm:p-6">
            {recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 rounded-xl border border-white/[0.07] bg-[#0D1220] p-4 transition hover:border-white/[0.12] sm:p-5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#6366F1]/10 text-[11px] font-semibold text-[#818CF8]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <p className="text-sm leading-7 text-[#94A3B8]">
                      {typeof item === "string"
                        ? item
                        : item?.text ||
                          item?.description ||
                          JSON.stringify(item)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="No recommendations were generated." />
            )}
          </div>
        </section>

        {/* FOOTER */}
        <div className="mt-14 border-t border-white/[0.07] py-7">
          <p className="max-w-3xl text-xs leading-6 text-[#64748B]">
            This analysis is based on the resume content extracted from
            your uploaded document. Use the recommendations as guidance
            for improving structure, skills visibility, ATS compatibility,
            and resume completeness.
          </p>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({ label, value, description }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#121827] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.16)] transition hover:border-white/[0.13]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#F8FAFC]">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-[#64748B]">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  eyebrow,
  title,
  description,
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#10B981]">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-[#F8FAFC]">
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
          {description}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   SCORE BAR
========================================================= */

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

/* =========================================================
   SCORE CARD
========================================================= */

function ScoreCard({
  title,
  score,
  description,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#121827] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.15)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[#CBD5E1]">
          {title}
        </p>

        <span className="rounded-lg bg-[#6366F1]/10 px-2.5 py-1 text-sm font-semibold text-[#818CF8]">
          {score}
        </span>
      </div>

      <div className="mt-6">
        <ScoreBar score={score} />
      </div>

      <p className="mt-4 text-xs leading-5 text-[#64748B]">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   ATS CHECK
========================================================= */

function ATSCheck({
  name,
  passed,
  score,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-[#0D1220] p-4 transition hover:border-white/[0.12]">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${
            passed
              ? "bg-[#10B981]/10 text-[#10B981]"
              : "bg-[#F59E0B]/10 text-[#F59E0B]"
          }`}
        >
          {passed ? "✓" : "!"}
        </span>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[#CBD5E1]">
            {name}
          </p>

          <p className="mt-1 text-xs text-[#64748B]">
            {passed
              ? "Requirement passed"
              : "Needs improvement"}
          </p>
        </div>
      </div>

      <span
        className={`shrink-0 text-sm font-semibold ${
          passed
            ? "text-[#10B981]"
            : "text-[#F59E0B]"
        }`}
      >
        {score ?? 0}
      </span>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ text }) {
  return (
    <div className="rounded-xl border border-dashed border-white/[0.08] px-5 py-8 text-center">
      <p className="text-sm text-[#64748B]">
        {text}
      </p>
    </div>
  );
}

export default Analysis;