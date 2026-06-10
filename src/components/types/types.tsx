// ============================================
// NAVIGATION TYPES
// ============================================

export interface NavItem {
  name: string
  icon: string
  path: string
  subItems?: { name: string; path: string }[]
}

// ============================================
// LOCATION TYPES
// ============================================

export interface City {
  id: number
  name: string
}

export interface Province {
  id: number
  name: string
  cities: City[]
}

// ============================================
// IMAGE UPLOADING
// ============================================

export interface UploadData {
  url: string
  filename: string
  originalName: string
  size: number
}

// Separate response types for single vs multiple uploads
export interface SingleUploadResponse {
  success: boolean
  data?: UploadData // Always a single object, never an array
  error?: string
}

export interface MultipleUploadResponse {
  success: boolean
  data?: UploadData[] // Always an array
  error?: string
}

export interface FileInput {
  file: File
  folder: string
  filename: string
}

export interface MultipleFilesInput {
  files: File[]
  folder?: string
}

export interface DeleteState {
  isDeleting: boolean
  error: string | null
  success: boolean
}

export interface DeleteFileInput {
  folder: string // The folder path where the file is stored (e.g., 'products', 'general', 'users')
  filename: string // The name of the file to delete (e.g., 'image-123.jpg')
}

export interface DeleteUploadResponse {
  success: boolean
  error?: string
}

export interface UploadState {
  isUploading: boolean
  progress: number
  error: string | null
  success: boolean
}

export interface UploadResult {
  url: string
  filename: string
  originalName: string
  size: number
}

export interface FileInputOptions {
  accept?: string
  multiple?: boolean
  maxSize?: number
  maxFiles?: number
}

export interface FileValidationResult {
  isValid: boolean
  error?: string
  file?: File
  files?: File[]
}

// ============================================
// AI
// ============================================

export interface DomainScores {
  sleep: number
  nutrition: number
  activity: number
  stress: number
  beauty: number
  medical: number
  energy: number
  behavioral: number
}

export interface AIAnalysisResult {
  summary: string
  diagnosis: string
  goals: Array<{
    goal: string
    domain: string
    priority: number
  }>
  healthArchetype: string
  readinessStage: string
  // New fields for causal intelligence
  keyInsight?: string // optional for backward compatibility
  causalChain?: string[] // optional for backward compatibility
}

export interface UserAnswers {
  [key: string]: string | string[]
}

export interface ProductRecommendation {
  productId: number
  reason: string
  domain: string
  priority: number
}

export interface HealthAssessmentResult {
  id: string
  overallScore: number
  sleepScore: number
  nutritionScore: number
  activityScore: number
  stressScore: number
  beautyScore: number
  medicalScore: number
  aiSummary: string | null
  aiDiagnosis: string | null
  aiGoals: Array<{ goal: string; domain: string; priority: number }> | null
  healthArchetype: string | null
  readinessStage: string | null
  recommendations: Array<{
    id: string
    productId: number
    reason: string
    domain: string
    priority: number
  }>

  // New optional fields for causal intelligence (can be added later)
  keyInsight?: string | null
  causalChain?: string[] | null
}
