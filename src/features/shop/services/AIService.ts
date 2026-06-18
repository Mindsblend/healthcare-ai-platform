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
   * Generate complete health analysis from user answers and scores
   * Makes ACTUAL API call to GapGPT using axios
   */
  static async generateAnalysis(
    answers: UserAnswers,
    scores: DomainScores,
    overallScore: number,
  ): Promise<AIAnalysisResult> {
    const userPrompt = buildUserPrompt(scores, overallScore, answers)

    try {
      console.log('URL:', GAPGPT_API_URL)
      console.log('API KEY:', GAPGPT_API_KEY?.slice(0, 10))
      console.log(`${GAPGPT_API_URL}/chat/completions`)
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

      const content = response.data.choices[0]?.message?.content

      if (!content) {
        console.error('Empty response from GapGPT, using fallback')
        return getFallbackAnalysis(scores, answers)
      }

      // Parse the JSON response
      let parsed: Partial<AIAnalysisResult>
      try {
        parsed = JSON.parse(content) as Partial<AIAnalysisResult>
      } catch (parseError) {
        console.error(
          'Failed to parse GapGPT response as JSON. Length:',
          content.length,
          'Tail:',
          content.slice(-200),
        )
        return getFallbackAnalysis(scores, answers)
      }

      // Merge with fallbacks for any missing fields
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
      if (axios.isAxiosError(error)) {
        console.log('STATUS:', error.response?.status)
        console.log('DATA:', error.response?.data)
      }

      console.error(error)

      return getFallbackAnalysis(scores, answers)
    }
  }

  /**
   * Save analysis results to database
   */
  static async saveAnalysis(
    userId: string,
    answers: UserAnswers,
    scores: DomainScores,
    overallScore: number,
    analysis: AIAnalysisResult,
  ) {
    const assessment = await prisma.healthAssessment.create({
      data: {
        userId,
        answers: answers,
        sleepScore: scores.sleep,
        nutritionScore: scores.nutrition,
        activityScore: scores.activity,
        stressScore: scores.stress,
        beautyScore: scores.beauty,
        medicalScore: scores.medical,
        overallScore: overallScore,

        // FULL AI STRUCTURED OUTPUT
        aiOutput: analysis as unknown as Prisma.InputJsonValue,

        // Behavioral insights (promoted top-level for indexing/filtering)
        healthArchetype: analysis.healthArchetype,
        readinessStage: analysis.readinessStage,

        // SYSTEM STATE
        domains: analysis.domains as unknown as Prisma.InputJsonValue,
      },
    })

    return assessment
  }

  /**
   * Get user's latest assessment
   */
  static async getUserLatestAssessment(userId: string) {
    return prisma.healthAssessment.findFirst({
      where: { userId, isActive: true },
      orderBy: { completedAt: 'desc' },
    })
  }

  /**
   * Get a single assessment by id, scoped to the requesting user.
   * Flattens aiOutput (the full structured AIAnalysisResult JSON) onto the
   * top level of the returned object, so consumers can read fields like
   * .summary, .startingPoint, .mainBottleneck, .priorityFactors directly
   * instead of reaching into .aiOutput.<field>.
   */
  static async getAssessmentById(id: string, userId: string) {
    const assessment = await prisma.healthAssessment.findFirst({
      where: { id, userId },
    })

    if (!assessment) {
      return null
    }

    const aiOutput = (assessment.aiOutput as Record<string, unknown>) || {}

    return {
      ...assessment,
      ...aiOutput,
    }
  }
}
