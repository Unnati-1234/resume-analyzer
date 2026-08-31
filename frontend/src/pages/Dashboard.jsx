import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import {
  analyzeResume,
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

  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const [selectedAnalysis, setSelectedAnalysis] = useState(null)
  const [selectedJobMatch, setSelectedJobMatch] = useState(null)
  const [showHistory, setShowHistory] = useState(false)

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

      // Allow the same file to be selected again
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
    <main className="min-h-screen bg-[#0d2024] text-[#edf5f2]">

      {/* ========================================
          HEADER
      ======================================== */}

      <header className="border-b border-white/[0.07] bg-[#10272b]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">

          {/* BRAND */}

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center border border-[#8fcdbc]/20 bg-[#8fcdbc]/[0.07] text-xs font-bold text-[#8fcdbc]">
              RA
            </div>

            <div>
              <p className="text-sm font-semibold tracking-wide text-[#e4efec]">
                Resume Analyzer
              </p>

              <p className="hidden text-[11px] text-[#657d79] sm:block">
                Career intelligence workspace
              </p>
            </div>

          </div>

          {/* HEADER ACTIONS */}

          <div className="flex items-center gap-2">

            {/* HISTORY */}

            <button
              type="button"
              onClick={() => {
                setError('')
                setMessage('')
                setShowHistory(true)
              }}
              className="border border-white/[0.09] bg-white/[0.035] px-4 py-2.5 text-xs font-semibold text-[#9fb1ae] transition duration-200 hover:border-[#8fcdbc]/25 hover:bg-[#8fcdbc]/[0.06] hover:text-[#a9d9cc]"
            >
              History
            </button>

            {/* LOGOUT */}

            <button
              type="button"
              onClick={logout}
              className="border border-white/[0.09] bg-white/[0.035] px-4 py-2.5 text-xs font-semibold text-[#9fb1ae] transition duration-200 hover:border-[#d89572]/30 hover:bg-[#d89572]/[0.07] hover:text-[#e3b19b]"
            >
              Sign out
            </button>

          </div>

        </div>
      </header>

      {/* ========================================
          MAIN CONTENT
      ======================================== */}

      <div className="mx-auto max-w-7xl px-6 py-9 sm:px-8 lg:px-10 lg:py-12">

        {/* ========================================
            HERO
        ======================================== */}

        <section className="flex flex-col gap-7 border-b border-white/[0.07] pb-9 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8fcdbc]">
              Overview
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#f0f5f2] sm:text-4xl">
              Your workspace
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#879d99]">
              Upload your resume, analyze your profile, and understand where
              you can improve.
            </p>

          </div>

          {/* UPLOAD BUTTON */}

          <div>

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
              className="group flex min-w-[165px] items-center justify-center gap-3 bg-[#8fcdbc] px-5 py-3 text-sm font-semibold text-[#10282c] shadow-[0_10px_30px_rgba(143,205,188,0.1)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#a5ddcd] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {uploading ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#10282c]/30 border-t-[#10282c]" />

                  Uploading...
                </>
              ) : (
                <>
                  Upload resume

                  <span className="transition-transform duration-200 group-hover:-translate-y-0.5">
                    ↑
                  </span>
                </>
              )}

            </button>

          </div>

        </section>

        {/* ========================================
            SUCCESS / ERROR MESSAGE
        ======================================== */}

        {(error || message) && (
          <div className="mt-6">

            {error && (
              <div className="border border-[#d89572]/20 bg-[#d89572]/[0.07] px-5 py-4 text-sm leading-6 text-[#e3ad96]">
                {error}
              </div>
            )}

            {message && !error && (
              <div className="border border-[#8fcdbc]/20 bg-[#8fcdbc]/[0.07] px-5 py-4 text-sm leading-6 text-[#a9d9cc]">
                {message}
              </div>
            )}

          </div>
        )}

        {/* ========================================
            STATS
        ======================================== */}

        <section className="mt-8 grid gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07] sm:grid-cols-3">

          {/* RESUMES */}

          <div className="bg-[#142c30]/80 p-6">

            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718986]">
              Resumes
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-[#e8f1ee]">
              {loading ? '—' : resumes.length}
            </p>

            <p className="mt-2 text-xs text-[#718986]">
              Uploaded to your workspace
            </p>

          </div>

          {/* ANALYSIS */}

          <div className="bg-[#142c30]/80 p-6">

            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718986]">
              Analysis
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-[#e8f1ee]">
              —
            </p>

            <p className="mt-2 text-xs text-[#718986]">
              Resume insights
            </p>

          </div>

          {/* JOB MATCH */}

          <div className="bg-[#142c30]/80 p-6">

            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718986]">
              Job matches
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-[#e8f1ee]">
              —
            </p>

            <p className="mt-2 text-xs text-[#718986]">
              Role compatibility
            </p>

          </div>

        </section>

        {/* ========================================
            RESUME LIBRARY
        ======================================== */}

        <section className="mt-10">

          {/* SECTION HEADER */}

          <div className="mb-5 flex items-end justify-between gap-4">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#718986]">
                Resume library
              </p>

              <h2 className="mt-2 text-xl font-semibold text-[#e8f1ee]">
                Your resumes
              </h2>

            </div>

            <span className="text-xs text-[#657c78]">
              {resumes.length}{' '}
              {resumes.length === 1 ? 'resume' : 'resumes'}
            </span>

          </div>

          {/* ========================================
              LOADING STATE
          ======================================== */}

          {loading && (
            <div className="border border-white/[0.08] bg-[#142c30]/60 p-10 text-center">

              <div className="flex items-center justify-center gap-3 text-sm text-[#8da39f]">

                <span className="h-2 w-2 animate-pulse rounded-full bg-[#8fcdbc]" />

                Loading your resumes

              </div>

            </div>
          )}

          {/* ========================================
              EMPTY STATE
          ======================================== */}

          {!loading && resumes.length === 0 && !error && (
            <div className="border border-dashed border-white/[0.12] bg-[#142c30]/40 px-6 py-16 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[#8fcdbc]/15 bg-[#8fcdbc]/[0.06] text-xl font-light text-[#8fcdbc]">
                +
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#dce8e4]">
                No resumes yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#718986]">
                Upload your first resume to begin your analysis.
              </p>

              <button
                type="button"
                onClick={openFilePicker}
                disabled={uploading}
                className="mt-6 bg-[#8fcdbc] px-5 py-3 text-sm font-semibold text-[#10282c] transition hover:bg-[#a5ddcd] disabled:cursor-not-allowed disabled:opacity-60"
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

                return (
                  <div
                    key={resumeId || index}
                    className="group flex flex-col gap-5 border border-white/[0.08] bg-[#142c30]/65 p-5 transition duration-200 hover:border-[#8fcdbc]/20 hover:bg-[#173237] sm:flex-row sm:items-center sm:justify-between"
                  >

                    {/* RESUME INFORMATION */}

                    <div className="flex min-w-0 items-center gap-4">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#8fcdbc]/15 bg-[#8fcdbc]/[0.06] text-xs font-bold text-[#8fcdbc]">
                        CV
                      </div>

                      <div className="min-w-0">

                        <h3 className="truncate text-sm font-semibold text-[#dce8e4]">
                          {resumeName}
                        </h3>

                        <p className="mt-1 text-xs text-[#718986]">
                          Ready for analysis
                        </p>

                      </div>

                    </div>

                    {/* ACTION BUTTONS */}

                    <div className="flex flex-col gap-2 sm:flex-row">

                      {/* ANALYZE */}

                      <button
                        type="button"
                        onClick={() =>
                          handleAnalyze(
                            resumeId,
                            resumeName
                          )
                        }
                        disabled={
                          isAnalyzing ||
                          !resumeId
                        }
                        className="flex min-w-[130px] items-center justify-center gap-2 border border-[#8fcdbc]/20 bg-[#8fcdbc]/[0.06] px-4 py-2.5 text-xs font-semibold text-[#9fd6c7] transition duration-200 hover:border-[#8fcdbc]/40 hover:bg-[#8fcdbc]/[0.1] disabled:cursor-not-allowed disabled:opacity-50"
                      >

                        {isAnalyzing ? (
                          <>
                            <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#8fcdbc]/30 border-t-[#8fcdbc]" />

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
                        disabled={!resumeId}
                        className="flex min-w-[110px] items-center justify-center border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-xs font-semibold text-[#9aaea9] transition hover:border-[#8fcdbc]/25 hover:text-[#a9d9cc] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Job match
                      </button>

                    </div>

                  </div>
                )
              })}

            </div>
          )}

        </section>

      </div>

    </main>
  )
}

export default Dashboard