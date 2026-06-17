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

export interface DomainNode {
  score: number
  status: 'strong' | 'moderate' | 'weak'
  insight: string
  roleInSystem: string
  whatDrivesIt: string
  whatItAffects: string
  microAction: string
}

export interface AIAnalysisResult {
  summary: string
  diagnosis: string

  keyInsight: string
  whyThisMatters: string

  causalChain: [string, string, string]

  mainBottleneck: {
    domain: string
    title: string
    explanation: string
    affectedAreas: string[]
    leverageReason: string
  }

  startingPoint: {
    title: string
    description: string
    expectedBenefits: string[]
    firstAction: string
  }

  futureProjection: {
    ifNoChange: string
    ifImproved: string
    expectedTimeframe: string
    confidence: 'low' | 'medium' | 'high'
  }

  healthArchetype: string
  readinessStage: string

  priorityFactors: Array<{
    title: string
    domain: string
    priority: number
    whyImportant: string
    systemImpact: string
    personalImpact: string
    microAction: string
  }>

  goals: Array<{
    goal: string
    domain: string
    priority: number
  }>

  domains: Record<string, DomainNode>
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
  energyScore?: number
  behavioralScore?: number

  // =========================
  // CORE TEXT OUTPUT
  // =========================
  summary: string | null
  diagnosis: string | null

  keyInsight: string | null
  whyThisMatters: string | null

  causalChain: [string, string, string] | null

  // =========================
  // SYSTEM CRITICAL BLOCK
  // =========================
  mainBottleneck: {
    domain: string
    title: string
    explanation: string
    affectedAreas: string[]
    leverageReason: string
  } | null

  startingPoint: {
    title: string
    description: string
    firstAction: string
    expectedBenefits: string[]
  } | null

  futureProjection: {
    ifNoChange: string
    ifImproved: string
    expectedTimeframe: string
    confidence: 'low' | 'medium' | 'high'
  } | null

  // =========================
  // STRATEGIC LAYERS
  // =========================
  priorityFactors: Array<{
    title: string
    domain: string
    priority: number
    whyImportant: string
    systemImpact: string
    personalImpact: string
    microAction: string
  }> | null

  goals: Array<{
    goal: string
    domain: string
    priority: number
  }> | null

  // =========================
  // PERSONALIZATION
  // =========================
  healthArchetype: string | null
  readinessStage: string | null

  // =========================
  // SYSTEM MAP (LOW LEVEL)
  // =========================
  domains: Record<string, DomainNode> | null

  // =========================
  // RECOMMENDATIONS (OPTIONAL LAYER)
  // =========================
  recommendations: Array<{
    id: string
    productId: number
    reason: string
    domain: string
    priority: number
  }> | null
}
