// services/aiHealthService.ts
import axios from 'axios'
import { prisma } from '@/lib/prisma'
import { DomainScores, AIAnalysisResult, UserAnswers, ProductRecommendation } from '@/components/types/types'
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
      const response = await axios.post(
        `${GAPGPT_API_URL}/chat/completions`,
        {
          model: 'gpt-4-turbo',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 800,
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
      const parsed = JSON.parse(content) as Partial<AIAnalysisResult>

      // Merge with fallbacks for any missing fields
      const fallback = getFallbackAnalysis(scores, answers)

      return {
        summary: parsed.summary || fallback.summary,
        diagnosis: parsed.diagnosis || fallback.diagnosis,
        goals: parsed.goals || fallback.goals,
        healthArchetype: parsed.healthArchetype || fallback.healthArchetype,
        readinessStage: parsed.readinessStage || fallback.readinessStage,
      }
    } catch (error) {
      console.error('GapGPT API error:', error)

      // Return fallback response from fine tune file
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
        aiSummary: analysis.summary,
        aiDiagnosis: analysis.diagnosis,
        aiGoals: analysis.goals,
        healthArchetype: analysis.healthArchetype,
        readinessStage: analysis.readinessStage,
      },
    })

    return assessment
  }

  /**
   * Get product recommendations based on assessment scores
   */
  static async getProductRecommendations(
    assessmentId: string,
    scores: DomainScores,
  ): Promise<ProductRecommendation[]> {
    const weakDomains: Array<{ domain: string; score: number }> = []

    if (scores.sleep < 50)
      weakDomains.push({ domain: 'sleep', score: scores.sleep })
    if (scores.nutrition < 50)
      weakDomains.push({ domain: 'nutrition', score: scores.nutrition })
    if (scores.activity < 50)
      weakDomains.push({ domain: 'activity', score: scores.activity })
    if (scores.stress < 50)
      weakDomains.push({ domain: 'stress', score: scores.stress })
    if (scores.beauty < 50)
      weakDomains.push({ domain: 'beauty', score: scores.beauty })
    if (scores.medical < 50)
      weakDomains.push({ domain: 'medical', score: scores.medical })

    weakDomains.sort((a, b) => a.score - b.score)
    const topDomains = weakDomains.slice(0, 3)

    if (topDomains.length === 0) {
      return this.getMaintenanceRecommendations(assessmentId)
    }

    const recommendations: ProductRecommendation[] = []
    let priority = 1

    for (const domain of topDomains) {
      const products = await this.findProductsByDomain(domain.domain)

      if (products.length > 0) {
        const product = products[0]
        const reason = this.getRecommendationReason(domain.domain)

        await prisma.healthRecommendation.create({
          data: {
            healthAssessmentId: assessmentId,
            productId: product.id,
            reason: reason,
            domain: domain.domain,
            priority: priority,
          },
        })

        recommendations.push({
          productId: product.id,
          reason,
          domain: domain.domain,
          priority,
        })

        priority++
      }
    }

    return recommendations
  }

  /**
   * Get user's latest assessment with recommendations
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

  // Private helper methods

  private static async findProductsByDomain(domain: string) {
    const domainToCategory: Record<string, string[]> = {
      sleep: ['sleep', 'relax', 'calm', 'night'],
      nutrition: ['nutrition', 'food', 'supplement', 'vitamin'],
      activity: ['energy', 'fitness', 'sport'],
      stress: ['calm', 'relax', 'stress', 'adaptogen'],
      beauty: ['beauty', 'skin', 'hair', 'collagen'],
      medical: ['wellness', 'health', 'immune'],
    }

    const categories = domainToCategory[domain] || ['wellness']

    const products = await prisma.product.findMany({
      where: {
        OR: categories.map((cat) => ({
          category: {
            name: {
              contains: cat,
              mode: 'insensitive',
            },
          },
        })),
        isActive: true,
      },
      take: 3,
    })

    if (products.length === 0) {
      return await prisma.product.findMany({
        where: { isActive: true },
        take: 3,
      })
    }

    return products
  }

  private static getRecommendationReason(domain: string): string {
    const reasons: Record<string, string> = {
      sleep: 'برای بهبود کیفیت خواب و تنظیم ریتم شبانه‌روزی شما',
      nutrition: 'برای تقویت تغذیه و افزایش انرژی روزانه شما',
      activity: 'برای افزایش تحرک و بهبود سلامت جسمانی شما',
      stress: 'برای کاهش استرس و ایجاد آرامش در زندگی روزمره شما',
      beauty: 'برای تقویت زیبایی طبیعی و درخشندگی پوست و موی شما',
      medical: 'برای حمایت از سلامت پایه و پیشگیری از مشکلات آتی',
    }
    return reasons[domain] || 'برای بهبود سلامت و افزایش کیفیت زندگی شما'
  }

  private static async getMaintenanceRecommendations(
    assessmentId: string,
  ): Promise<ProductRecommendation[]> {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      take: 3,
    })

    const recommendations: ProductRecommendation[] = []
    let priority = 1

    for (const product of products) {
      await prisma.healthRecommendation.create({
        data: {
          healthAssessmentId: assessmentId,
          productId: product.id,
          reason: 'برای حفظ سلامت و تداوم حس خوب شما',
          domain: 'maintenance',
          priority: priority,
        },
      })

      recommendations.push({
        productId: product.id,
        reason: 'برای حفظ سلامت و تداوم حس خوب شما',
        domain: 'maintenance',
        priority,
      })

      priority++
    }

    return recommendations
  }
}
