
import { useEffect, useRef, useState } from 'react'

import { useAuth } from '../context/AuthContext.jsx'

import {
  analyzeResume,
  deleteResume,
  downloadResume,
  getUserResumes,
  uploadResume,
} from '../services/resumeService'

import Analysis from './Analysis.jsx'
import JobMatch from './JobMatch.jsx'
import History from './History.jsx'

function Dashboard() {
  const { logout } = useAuth()

  const fileInputRef = useRef(null)

  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [analyzingId, setAnalyzingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [downloadingId, setDownloadingId] = useState(null)

  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const [selectedAnalysis, setSelectedAnalysis] = useState(null)
  const [selectedJobMatch, setSelectedJobMatch] = useState(null)
  const [showHistory, setShowHistory] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  // ========================================
  // LOAD RESUMES
  // ========================================

  const loadResumes = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getUserResumes()

      const resumeList = Array.isArray(data)
        ? data
        : Array.isArray(data?.resumes)
          ? data.resumes
          : []

      setResumes(resumeList)
    } catch (error) {
      setError(error.message || 'Failed to load resumes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResumes()
  }, [])

  // ========================================
  // OPEN FILE PICKER
  // ========================================

  const openFilePicker = () => {
    if (uploading) return

    setError('')
    setMessage('')

    fileInputRef.current?.click()
  }

  // ========================================
  // UPLOAD RESUME
  // ========================================

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    setError('')
    setMessage('')

    const fileName = file.name.toLowerCase()

    const validFile =
      fileName.endsWith('.pdf') ||
      fileName.endsWith('.doc') ||
      fileName.endsWith('.docx')

    if (!validFile) {
      setError('Please select a PDF, DOC, or DOCX file.')
      event.target.value = ''
      return
    }

    try {
      setUploading(true)

      await uploadResume(file)

      setMessage('Resume uploaded successfully.')

      await loadResumes()
    } catch (error) {
      setError(error.message || 'Failed to upload resume.')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  // ========================================
  // ANALYZE RESUME
  // ========================================

  const handleAnalyze = async (resumeId, resumeName) => {
    if (!resumeId) {
      setError('Unable to identify this resume.')
      return
    }

    try {
      setAnalyzingId(resumeId)
      setError('')
      setMessage('Analyzing your resume...')

      await analyzeResume(resumeId)

      setMessage('Resume analysis completed successfully.')

      setSelectedAnalysis({
        id: resumeId,
        name: resumeName,
      })
    } catch (error) {
      setError(error.message || 'Failed to analyze resume.')
      setMessage('')
    } finally {
      setAnalyzingId(null)
    }
  }

  // ========================================
  // DOWNLOAD RESUME
  // ========================================

  const handleDownload = async (resumeId, resumeName) => {
    if (!resumeId) {
      setError('Unable to identify this resume.')
      return
    }

    try {
      setDownloadingId(resumeId)
      setError('')
      setMessage('Preparing your resume...')

      const response = await downloadResume(resumeId)

      const blob =
        response instanceof Blob
          ? response
          : response?.data instanceof Blob
            ? response.data
            : new Blob([response])

      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')

      link.href = url
      link.download = resumeName || 'resume.pdf'

      document.body.appendChild(link)

      link.click()

      link.remove()

      window.URL.revokeObjectURL(url)

      setMessage('Resume downloaded successfully.')
    } catch (error) {
      setError(error.message || 'Failed to download resume.')
      setMessage('')
    } finally {
      setDownloadingId(null)
    }
  }

  // ========================================
  // DELETE RESUME
  // ========================================

  const handleDelete = async () => {
    if (!deleteTarget?.id) return

    try {
      setDeletingId(deleteTarget.id)
      setError('')
      setMessage('')

      await deleteResume(deleteTarget.id)

      setResumes((currentResumes) =>
        currentResumes.filter((resume) => {
          const id =
            resume.id ||
            resume.resume_id ||
            resume.resumeId

          return id !== deleteTarget.id
        }),
      )

      setDeleteTarget(null)

      setMessage('Resume deleted successfully.')
    } catch (error) {
      setError(error.message || 'Failed to delete resume.')
    } finally {
      setDeletingId(null)
    }
  }

  // ========================================
  // ANALYSIS PAGE
  // ========================================

  if (selectedAnalysis) {
    return (
      <Analysis
        resumeId={selectedAnalysis.id}
        resumeName={selectedAnalysis.name}
        onBack={() => {
          setSelectedAnalysis(null)
          setMessage('')
          setError('')
        }}
      />
    )
  }

  // ========================================
  // JOB MATCH PAGE
  // ========================================

  if (selectedJobMatch) {
    return (
      <JobMatch
        resumeId={selectedJobMatch.id}
        resumeName={selectedJobMatch.name}
        onBack={() => {
          setSelectedJobMatch(null)
          setMessage('')
          setError('')
        }}
      />
    )
  }

  // ========================================
  // HISTORY PAGE
  // ========================================

  if (showHistory) {
    return (
      <History
        onBack={() => {
          setShowHistory(false)
          setMessage('')
          setError('')
        }}
      />
    )
  }

  // ========================================
  // DASHBOARD
  // ========================================

  return (
    <main className="min-h-screen bg-[#080C18] text-[#F8FAFC]">

      {/* ========================================
          HEADER
      ======================================== */}

      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0D1220]/95 backdrop-blur-md">

        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">

          {/* BRAND */}

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#6366F1]/30 bg-[#6366F1]/10 text-sm font-bold tracking-wide text-[#A5B4FC]">
              RA
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-wide text-[#F8FAFC]">
                Resume Analyzer
              </p>

              <p className="hidden text-[11px] text-[#64748B] sm:block">
                Career intelligence workspace
              </p>
            </div>

          </div>

          {/* HEADER ACTIONS */}

          <div className="flex shrink-0 items-center gap-2">

            <button
              type="button"
              onClick={() => {
                setError('')
                setMessage('')
                setShowHistory(true)
              }}
              className="rounded-lg border border-white/[0.08] bg-[#121827] px-3.5 py-2.5 text-xs font-semibold text-[#CBD5E1] transition duration-200 hover:border-[#6366F1]/35 hover:bg-[#6366F1]/10 hover:text-[#A5B4FC]"
            >
              History
            </button>

            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-white/[0.08] bg-[#121827] px-3.5 py-2.5 text-xs font-semibold text-[#94A3B8] transition duration-200 hover:border-[#EF4444]/30 hover:bg-[#EF4444]/10 hover:text-[#FCA5A5]"
            >
              Sign out
            </button>

          </div>

        </div>

      </header>

      {/* ========================================
          MAIN CONTENT
      ======================================== */}

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">

        {/* ========================================
            HERO
        ======================================== */}

        <section className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

          <div className="max-w-2xl">

            <div className="mb-4 inline-flex items-center gap-2 border border-[#10B981]/20 bg-[#10B981]/[0.06] px-3 py-1.5 rounded-lg">

              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />

              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6EE7B7]">
                Overview
              </span>

            </div>

            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[#F8FAFC] sm:text-5xl">
              Your workspace
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#94A3B8]">
              Upload your resume, analyze your profile, and understand where
              you can improve your chances of landing the right opportunity.
            </p>

          </div>

          {/* UPLOAD */}

          <div className="shrink-0">

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={openFilePicker}
              disabled={uploading}
              className="group flex min-w-[175px] items-center justify-center gap-3 rounded-lg bg-[#6366F1] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(99,102,241,0.18)] transition duration-200 hover:bg-[#818CF8] hover:shadow-[0_12px_35px_rgba(99,102,241,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {uploading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Uploading...
                </>
              ) : (
                <>
                  Upload resume

                  <span className="text-lg leading-none transition-transform duration-200 group-hover:-translate-y-0.5">
                    ↑
                  </span>
                </>
              )}

            </button>

          </div>

        </section>

        {/* ========================================
            SUCCESS / ERROR
        ======================================== */}

        {(error || message) && (

          <div className="mt-8">

            {error && (
              <div className="border border-[#EF4444]/20 bg-[#EF4444]/[0.06] px-5 py-4 text-sm leading-6 text-[#FCA5A5] rounded-xl">
                {error}
              </div>
            )}

            {message && !error && (
              <div className="border border-[#10B981]/20 bg-[#10B981]/[0.06] px-5 py-4 text-sm leading-6 text-[#6EE7B7] rounded-xl">
                {message}
              </div>
            )}

          </div>

        )}

        {/* ========================================
            STATS
        ======================================== */}

        <section className="mt-10 grid gap-4 md:grid-cols-3">

          {/* RESUMES */}

          <div className="rounded-xl border border-white/[0.08] bg-[#121827] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.15)] transition duration-200 hover:border-[#6366F1]/25">

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748B]">
                  Resumes
                </p>

                <p className="mt-3 text-4xl font-semibold tracking-tight text-[#F8FAFC]">
                  {loading ? '—' : resumes.length}
                </p>

              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#6366F1]/15 bg-[#6366F1]/10 text-sm text-[#A5B4FC]">
                CV
              </div>

            </div>

            <p className="mt-3 text-xs text-[#64748B]">
              Uploaded to your workspace
            </p>

          </div>

          {/* ANALYSIS */}

          <div className="rounded-xl border border-white/[0.08] bg-[#121827] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.15)] transition duration-200 hover:border-[#10B981]/25">

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748B]">
                  Analysis
                </p>

                <p className="mt-3 text-4xl font-semibold tracking-tight text-[#F8FAFC]">
                  —
                </p>

              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#10B981]/15 bg-[#10B981]/10 text-sm text-[#34D399]">
                +
              </div>

            </div>

            <p className="mt-3 text-xs text-[#64748B]">
              Resume insights
            </p>

          </div>

          {/* JOB MATCH */}

          <div className="rounded-xl border border-white/[0.08] bg-[#121827] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.15)] transition duration-200 hover:border-[#6366F1]/25">

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748B]">
                  Job matches
                </p>

                <p className="mt-3 text-4xl font-semibold tracking-tight text-[#F8FAFC]">
                  —
                </p>

              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#6366F1]/15 bg-[#6366F1]/10 text-sm text-[#A5B4FC]">
                %
              </div>

            </div>

            <p className="mt-3 text-xs text-[#64748B]">
              Role compatibility
            </p>

          </div>

        </section>

        {/* ========================================
            RESUME LIBRARY
        ======================================== */}

        <section className="mt-12">

          <div className="mb-6 flex items-end justify-between gap-4">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">
                Resume library
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#F8FAFC]">
                Your resumes
              </h2>

            </div>

            <span className="shrink-0 border border-white/[0.08] bg-[#121827] px-3 py-1.5 text-xs text-[#94A3B8] rounded-lg">
              {resumes.length}{' '}
              {resumes.length === 1 ? 'resume' : 'resumes'}
            </span>

          </div>

          {/* ========================================
              LOADING
          ======================================== */}

          {loading && (

            <div className="rounded-xl border border-white/[0.08] bg-[#121827] p-12 text-center shadow-[0_18px_60px_rgba(0,0,0,0.15)]">

              <div className="flex items-center justify-center gap-3 text-sm text-[#94A3B8]">

                <span className="h-2 w-2 animate-pulse rounded-full bg-[#10B981]" />

                Loading your resumes

              </div>

            </div>

          )}

          {/* ========================================
              EMPTY STATE
          ======================================== */}

          {!loading && resumes.length === 0 && !error && (

            <div className="rounded-xl border border-dashed border-white/[0.12] bg-[#121827] px-6 py-20 text-center shadow-[0_18px_60px_rgba(0,0,0,0.15)]">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-[#6366F1]/20 bg-[#6366F1]/10 text-2xl font-light text-[#A5B4FC]">
                +
              </div>

              <h3 className="mt-6 text-xl font-semibold text-[#F8FAFC]">
                No resumes yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#94A3B8]">
                Upload your first resume to begin your analysis and discover
                where your profile can become stronger.
              </p>

              <button
                type="button"
                onClick={openFilePicker}
                disabled={uploading}
                className="mt-7 rounded-lg bg-[#6366F1] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(99,102,241,0.18)] transition hover:bg-[#818CF8] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? 'Uploading...' : 'Upload resume'}
              </button>

            </div>

          )}

          {/* ========================================
              RESUME LIST
          ======================================== */}

          {!loading && resumes.length > 0 && (

            <div className="grid gap-3">

              {resumes.map((resume, index) => {

                const resumeId =
                  resume.id ||
                  resume.resume_id ||
                  resume.resumeId

                const resumeName =
                  resume.originalname ||
                  resume.originalName ||
                  resume.filename ||
                  resume.fileName ||
                  `Resume ${index + 1}`

                const isAnalyzing =
                  analyzingId === resumeId

                const isDownloading =
                  downloadingId === resumeId

                const isDeleting =
                  deletingId === resumeId

                return (

                  <div
                    key={resumeId || index}
                    className="group rounded-xl border border-white/[0.08] bg-[#121827] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.12)] transition duration-200 hover:border-white/[0.14] hover:bg-[#161D2D]"
                  >

                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                      {/* RESUME INFO */}

                      <div className="flex min-w-0 items-center gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#6366F1]/20 bg-[#6366F1]/10 text-xs font-bold tracking-wide text-[#A5B4FC]">
                          CV
                        </div>

                        <div className="min-w-0">

                          <h3 className="truncate text-sm font-semibold text-[#F8FAFC]">
                            {resumeName}
                          </h3>

                          <div className="mt-1.5 flex items-center gap-2">

                            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />

                            <p className="text-xs text-[#64748B]">
                              Ready for analysis
                            </p>

                          </div>

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="flex flex-wrap gap-2">

                        {/* DOWNLOAD */}

                        <button
                          type="button"
                          onClick={() =>
                            handleDownload(
                              resumeId,
                              resumeName,
                            )
                          }
                          disabled={
                            !resumeId ||
                            isDownloading ||
                            isDeleting
                          }
                          className="flex min-w-[110px] items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-[#161D2D] px-4 py-2.5 text-xs font-semibold text-[#CBD5E1] transition hover:border-[#6366F1]/30 hover:bg-[#6366F1]/10 hover:text-[#A5B4FC] disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          {isDownloading ? (
                            <>
                              <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#818CF8]/30 border-t-[#818CF8]" />
                              Preparing
                            </>
                          ) : (
                            <>
                              ↓
                              Download
                            </>
                          )}

                        </button>

                        {/* ANALYZE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleAnalyze(
                              resumeId,
                              resumeName,
                            )
                          }
                          disabled={
                            isAnalyzing ||
                            !resumeId ||
                            isDeleting
                          }
                          className="flex min-w-[120px] items-center justify-center gap-2 rounded-lg bg-[#6366F1] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_6px_20px_rgba(99,102,241,0.14)] transition hover:bg-[#818CF8] disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          {isAnalyzing ? (
                            <>
                              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              Analyzing
                            </>
                          ) : (
                            'Analyze'
                          )}

                        </button>

                        {/* JOB MATCH */}

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedJobMatch({
                              id: resumeId,
                              name: resumeName,
                            })
                          }
                          disabled={
                            !resumeId ||
                            isDeleting
                          }
                          className="flex min-w-[110px] items-center justify-center rounded-lg border border-[#10B981]/20 bg-[#10B981]/[0.06] px-4 py-2.5 text-xs font-semibold text-[#6EE7B7] transition hover:border-[#10B981]/35 hover:bg-[#10B981]/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Job match
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget({
                              id: resumeId,
                              name: resumeName,
                            })
                          }
                          disabled={
                            !resumeId ||
                            isDeleting
                          }
                          className="flex min-w-[85px] items-center justify-center gap-2 rounded-lg border border-[#EF4444]/20 bg-[#EF4444]/[0.05] px-4 py-2.5 text-xs font-semibold text-[#FCA5A5] transition hover:border-[#EF4444]/35 hover:bg-[#EF4444]/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          {isDeleting ? (
                            <>
                              <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#EF4444]/30 border-t-[#EF4444]" />
                              Deleting
                            </>
                          ) : (
                            'Delete'
                          )}

                        </button>

                      </div>

                    </div>

                  </div>

                )
              })}

            </div>

          )}

        </section>

      </div>

      {/* ========================================
          DELETE CONFIRMATION MODAL
      ======================================== */}

      {deleteTarget && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/80 px-5 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-white/[0.1] bg-[#121827] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.65)]">

            {/* MODAL HEADER */}

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#EF4444]/20 bg-[#EF4444]/10 text-sm font-semibold text-[#FCA5A5]">
                !
              </div>

              <div>

                <h2 className="text-lg font-semibold text-[#F8FAFC]">
                  Delete resume?
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
                  You're about to permanently delete:
                </p>

                <p className="mt-2 break-all text-sm font-medium text-[#E2E8F0]">
                  {deleteTarget.name}
                </p>

              </div>

            </div>

            <p className="mt-6 border-t border-white/[0.08] pt-5 text-xs leading-5 text-[#64748B]">
              This action cannot be undone. The uploaded resume will be
              removed from your account.
            </p>

            {/* ACTIONS */}

            <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deletingId === deleteTarget.id}
                className="rounded-lg border border-white/[0.08] bg-[#161D2D] px-4 py-2.5 text-xs font-semibold text-[#CBD5E1] transition hover:border-white/[0.14] hover:bg-[#1A2233] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deletingId === deleteTarget.id}
                className="flex min-w-[120px] items-center justify-center gap-2 rounded-lg bg-[#EF4444] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(239,68,68,0.15)] transition hover:bg-[#F87171] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {deletingId === deleteTarget.id ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Deleting
                  </>
                ) : (
                  'Delete resume'
                )}

              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  )
}

export default Dashboard
