// services/aiHealthService.ts

import axios from 'axios'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import {
  DomainScores,
  AIAnalysisResult,
  UserAnswers,
} from '@/components/types/types'
import {
  SYSTEM_PROMPT,
  buildUserPrompt,
  getFallbackAnalysis,
} from '@/lib/healthAIFineTune'

const GAPGPT_API_URL = process.env.GAPGPT_BASE_URL || 'https://api.gapgpt.ir/v1'
const GAPGPT_API_KEY = process.env.GAPGPT_API_KEY

export class AIHealthService {
  /**
   * Generate AI analysis
   */
  static async generateAnalysis(
    answers: UserAnswers,
    scores: DomainScores,
    overallScore: number,
  ): Promise<AIAnalysisResult> {
    const userPrompt = buildUserPrompt(scores, overallScore, answers)

    try {
      const response = await axios.post(
        `${GAPGPT_API_URL}/chat/completions`,
        {
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 4000,
          response_format: { type: 'json_object' },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GAPGPT_API_KEY}`,
          },
          timeout: 15000,
        },
      )

      const content = response.data?.choices?.[0]?.message?.content

      if (!content) {
        return getFallbackAnalysis(scores, answers)
      }

      const parsed = JSON.parse(content) as Partial<AIAnalysisResult>
      const fallback = getFallbackAnalysis(scores, answers)

      return {
        summary: parsed.summary || fallback.summary,
        diagnosis: parsed.diagnosis || fallback.diagnosis,
        keyInsight: parsed.keyInsight || fallback.keyInsight,
        whyThisMatters: parsed.whyThisMatters || fallback.whyThisMatters,
        causalChain: parsed.causalChain || fallback.causalChain,

        mainBottleneck: parsed.mainBottleneck || fallback.mainBottleneck,
        startingPoint: parsed.startingPoint || fallback.startingPoint,
        futureProjection: parsed.futureProjection || fallback.futureProjection,

        healthArchetype: parsed.healthArchetype || fallback.healthArchetype,
        readinessStage: parsed.readinessStage || fallback.readinessStage,

        priorityFactors: parsed.priorityFactors || fallback.priorityFactors,
        goals: parsed.goals || fallback.goals,
        domains: parsed.domains || fallback.domains,
      }
    } catch (error) {
      console.error(error)
      return getFallbackAnalysis(scores, answers)
    }
  }

  /**
   * Save analysis
   */
  static async saveAnalysis(
    userId: string,
    answers: UserAnswers,
    scores: DomainScores,
    overallScore: number,
    analysis: AIAnalysisResult,
  ) {
    return prisma.healthAssessment.create({
      data: {
        userId,
        answers,
        sleepScore: scores.sleep,
        nutritionScore: scores.nutrition,
        activityScore: scores.activity,
        stressScore: scores.stress,
        beautyScore: scores.beauty,
        medicalScore: scores.medical,
        overallScore,

        aiOutput: analysis as unknown as Prisma.InputJsonValue,

        healthArchetype: analysis.healthArchetype,
        readinessStage: analysis.readinessStage,

        domains: analysis.domains as unknown as Prisma.InputJsonValue,
      },
    })
  }

  /**
   * Latest assessment (FIXED)
   */
  static async getUserLatestAssessment(userId: string) {
    return prisma.healthAssessment.findFirst({
      where: { userId, isActive: true },
      orderBy: { completedAt: 'desc' },
      include: {
        recommendations: {
          include: {
            product: true,
          },
        },
      },
    })
  }

  /**
   * Get assessment by id (FIXED + SAFE)
   */
  static async getAssessmentById(id: string, userId: string) {
    const assessment = await prisma.healthAssessment.findFirst({
      where: { id, userId },
      include: {
        recommendations: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!assessment) return null

    const aiOutput = (assessment.aiOutput as Record<string, unknown>) || {}

    return {
      ...assessment,
      ...aiOutput,
    }
  }
}