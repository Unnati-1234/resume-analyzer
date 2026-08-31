import { api } from './api'

export const uploadResume = async (file) => {
  const formData = new FormData()
  formData.append('resume', file)

  return api.upload('/api/resumes/upload', formData)
}

export const getUserResumes = async () => {
  return api.get('/api/resumes/')
}

export const getAnalysisHistory = async () => {
  return api.get('/api/resumes/history')
}

export const analyzeResume = async (resumeId) => {
  return api.post(`/api/resumes/${resumeId}/analyze`)
}

export const getSavedAnalysis = async (resumeId) => {
  return api.get(`/api/resumes/${resumeId}/analysis`)
}

export const matchResumeWithJob = async (resumeId, jobDescription) => {
  return api.post(`/api/resumes/${resumeId}/match-job`, {
    jobDescription,
  })
}

export const deleteResume = async (resumeId) => {
  return api.delete(`/api/resumes/${resumeId}`)
}

export const downloadResume = async (resumeId) => {
  return api.get(`/api/resumes/${resumeId}/download`)
}