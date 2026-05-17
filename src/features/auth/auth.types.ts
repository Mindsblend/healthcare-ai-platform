// ============================================
// OTM MANAMGEMENT TYPES
// ============================================

export interface VerifyOtpInput {
  identifier: string
  code: string
}

export interface VerifyOtpResponse {
  success: boolean
}

export interface RequestOtpInput {
  identifier: string
}

export interface RequestOtpResponse {
  success: boolean
  message?: string
}

// ============================================
// EMAIL CONFIGURATION TYPES
// ============================================

export interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

export interface EmailOptions {
  to: string
  subject: string
  text?: string
  html?: string
}

// ============================================
// SMS PROVIDER TYPES
// ============================================

export interface SendSmsInput {
  phone: string
}

export interface SmsProviderResponse {
  success: boolean
  code: string
}

export interface SmsApiPayload {
  mobile: string
  templateId: number
  parameters: {
    name: string
    value: string
  }[]
}

// ============================================
// SESSION TYPES
// ============================================

export interface SessionPayload {
  id: string
  email: string | null
  phone: string | null
  role: string | null
}

export interface JwtPayload {
  id: string
  email: string | null
  phone: string | null
  role: string | null
  exp?: number
  iat?: number
}

export interface CookieOptions {
  httpOnly: boolean
  secure: boolean
  sameSite: 'lax' | 'strict' | 'none'
  path: string
  maxAge: number
}

export interface CreateSessionInput {
  id: string
  email: string | null
  phone: string | null
  role: string | null
}

export interface RequireAuthorityInput {
  requiredRole: 'ADMIN' | 'USER'
}

export interface RefreshTokenSessionResponse {
  success: boolean
  message?: string
}

export interface LogOutResponse {
  success: boolean
  message?: string
}

// ============================================
// TOKEN VERIFICATION TYPES
// ============================================

export interface VerifyTokenInput {
  token: string
}

export interface EdgeSession {
  id: string
  role: string
}
