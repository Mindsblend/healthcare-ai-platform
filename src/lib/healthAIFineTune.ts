// lib/healthAIFineTune.ts
import { DomainScores, AIAnalysisResult } from '@/components/types/types'

// ============================================
// PROMPT TEMPLATES (exported for use in service)
// ============================================

export const SYSTEM_PROMPT = `You are a warm, empathetic health coach for a wellness platform. Your users are women who want to feel beautiful, calm, and healthy WITHOUT feeling like patients.

NEVER use clinical words like: disease, disorder, patient, treatment, cure, symptom
ALWAYS use words like: feel, energy, calm, glow, balance, rhythm, nurture, support

Generate a response in the following JSON format exactly. Do not add any text outside the JSON:

{
  "summary": "A 2-sentence warm opening acknowledging their effort",
  "diagnosis": "3-4 sentences analyzing their strengths and opportunities",
  "goals": [
    {
      "goal": "Specific, small, actionable goal in Persian or English based on user's language",
      "domain": "sleep|nutrition|activity|stress|beauty|medical",
      "priority": 1
    }
  ],
  "healthArchetype": "One of: The Busy Achiever, The Self-Care Seeker, The Skeptical Beginner, The Consistency Queen, The Stressed Overachiever, The Hopeful Restarter",
  "readinessStage": "One of: Contemplation, Preparation, Action, Maintenance"
}

The goals array must have exactly 3 goals, with priority 1, 2, and 3.
Keep the summary and diagnosis warm, encouraging, and under 150 words total.`

export function buildUserPrompt(
  scores: DomainScores,
  overallScore: number,
  answers: Record<string, any>,
): string {
  // Find highest and lowest domains
  const entries = Object.entries(scores)
  const highest = entries.reduce((a, b) => (a[1] > b[1] ? a : b))
  const lowest = entries.reduce((a, b) => (a[1] < b[1] ? a : b))

  // Extract behavioral data from answers
  const decisionStyle = answers['D1'] || 'Not specified'
  const consistencyLevel = answers['B2'] || 'Not specified'
  const motivationSource = answers['B3'] || 'Not specified'
  const readinessAnswer = answers['L4'] || 'Not specified'

  return `
User Health Assessment Data:

Overall Score: ${overallScore}/100

Domain Scores:
- Sleep: ${scores.sleep}/100
- Nutrition: ${scores.nutrition}/100
- Physical Activity: ${scores.activity}/100
- Stress & Mental Health: ${scores.stress}/100
- Beauty & Vitality: ${scores.beauty}/100
- Medical Foundation: ${scores.medical}/100

Strongest Domain: ${highest[0]} (${highest[1]}/100)
Weakest Domain: ${lowest[0]} (${lowest[1]}/100)

Behavioral Data:
- Decision Style: ${decisionStyle}
- Consistency Level: ${consistencyLevel}
- Motivation Source: ${motivationSource}
- Readiness: ${readinessAnswer}

Key Answers Summary:
${JSON.stringify(answers, null, 2)}

Generate a personalized health analysis in the required JSON format.
`
}

// ============================================
// FALLBACK RESPONSES (exported for use in service)
// ============================================

export function getDefaultSummary(scores: DomainScores): string {
  if (scores.beauty > 70) {
    return 'از اینکه این ارزیابی را کامل کردید متشکرم. زیبایی طبیعی شما درخشان است و پایه خوبی برای سلامت کلی دارید.'
  }
  if (scores.stress < 40) {
    return 'از اعتماد شما سپاسگزارم. قدم اول را برداشته‌اید و من اینجا هستم تا در این مسیر همراهتان باشم. باور دارم که می‌توانید احساس بهتری داشته باشید.'
  }
  return 'از اینکه این ارزیابی را با من به اشتراک گذاشتید سپاسگزارم. شجاعت شما برای نگاه کردن به سلامت خود تحسین‌برانگیز است. من در این مسیر همراه شما هستم.'
}

export function getDefaultDiagnosis(weakestDomain: keyof DomainScores): string {
  const diagnoses: Record<keyof DomainScores, string> = {
    sleep:
      'کیفیت خواب شما فرصتی برای رشد دارد. خواب عمیق و آرام بر روی انرژی، تمرکز و حتی زیبایی پوست شما تأثیر می‌گذارد. خبر خوب این است که با تغییرات کوچک می‌توانید تفاوت بزرگی ایجاد کنید.',
    nutrition:
      'تغذیه شما می‌تواند بهبود پیدا کند. غذایی که می‌خورید سوخت بدن شماست و تأثیر مستقیمی روی انرژی، خلق و خو و درخشندگی پوستتان دارد. بیایید با قدم‌های کوچک شروع کنیم.',
    activity:
      'تحرک بدنی شما فرصت رشد دارد. لازم نیست ورزش حرفه‌ای انجام دهید. یک قدم ساده روزانه می‌تواند شما را سرحال و پرانرژی کند و به آرامش بیشتری برسید.',
    stress:
      'استرس بخشی از زندگی مدرن است. اما می‌توانید یاد بگیرید چگونه با آن کنار بیایید تا آرامش را به زندگی خود بازگردانید. نفس عمیق بکشید، قرار است با هم کار کنیم.',
    beauty:
      'زیبایی شما از درون شروع می‌شود. مراقبت از پوست و مو نه تنها ظاهر شما را بهبود می‌بخشد، بلکه به شما حس خوبی می‌دهد. بیایید درخشش طبیعی شما را تقویت کنیم.',
    medical:
      'آگاهی از سلامت پایه اهمیت زیادی دارد. با معاینات دوره‌ای می‌توانید خیالتان از سلامت بدنتان راحت باشد. پیشگیری همیشه بهتر از درمان است.',
  }
  return diagnoses[weakestDomain] || diagnoses.stress
}

export function getDefaultGoals(
  scores: DomainScores,
  weakestDomain: keyof DomainScores,
): Array<{ goal: string; domain: string; priority: number }> {
  const goalsByDomain: Record<
    keyof DomainScores,
    Array<{ goal: string; domain: string; priority: number }>
  > = {
    sleep: [
      {
        goal: 'هر شب ۱۵ دقیقه قبل از خواب، موبایل را کنار بگذارید و چشمانتان را ببندید',
        domain: 'sleep',
        priority: 1,
      },
      {
        goal: 'نوشیدن یک لیوان آب ولرم با کمی لیمو ترش قبل از خواب',
        domain: 'sleep',
        priority: 2,
      },
      {
        goal: 'ساعت خواب و بیداری خود را هر روز در یک زمان مشخص تنظیم کنید',
        domain: 'sleep',
        priority: 3,
      },
    ],
    nutrition: [
      {
        goal: 'با هر وعده غذایی، یک مشت سبزیجات تازه اضافه کنید',
        domain: 'nutrition',
        priority: 1,
      },
      {
        goal: 'نوشیدن ۲ لیوان آب بیشتر در طول روز',
        domain: 'nutrition',
        priority: 2,
      },
      {
        goal: 'یک میان وعده ناسالم را با یک مشت مغزیجات جایگزین کنید',
        domain: 'nutrition',
        priority: 3,
      },
    ],
    activity: [
      {
        goal: 'هر روز ۱۰ دقیقه پیاده روی آرام داشته باشید',
        domain: 'activity',
        priority: 1,
      },
      {
        goal: 'پس از هر وعده غذایی، ۵ دقیقه بایستید و قدم بزنید',
        domain: 'activity',
        priority: 2,
      },
      {
        goal: 'یک روز در هفته را به حرکات کششی اختصاص دهید',
        domain: 'activity',
        priority: 3,
      },
    ],
    stress: [
      {
        goal: 'هر روز صبح، ۳ نفس عمیق قبل از چک کردن موبایل',
        domain: 'stress',
        priority: 1,
      },
      {
        goal: 'یک بار در روز، موسیقی آرام‌بخش گوش کنید',
        domain: 'stress',
        priority: 2,
      },
      {
        goal: 'هفته‌ای یک بار با یک دوست صمیمی تماس بگیرید',
        domain: 'stress',
        priority: 3,
      },
    ],
    beauty: [
      {
        goal: 'هر شب صورت خود را با یک پاک‌کننده ملایم بشویید',
        domain: 'beauty',
        priority: 1,
      },
      {
        goal: 'استفاده از کرم ضدآفتاب هر روز صبح',
        domain: 'beauty',
        priority: 2,
      },
      {
        goal: 'ماساژ روزانه پوست صورت به مدت ۲ دقیقه',
        domain: 'beauty',
        priority: 3,
      },
    ],
    medical: [
      {
        goal: 'یک قرار ملاقات برای چکاپ سالانه ثبت کنید',
        domain: 'medical',
        priority: 1,
      },
      {
        goal: 'سابقه خانوادگی سلامتی خود را یادداشت کنید',
        domain: 'medical',
        priority: 2,
      },
      {
        goal: 'به پزشک خود در مورد علائم کوچک اما مداوم بگویید',
        domain: 'medical',
        priority: 3,
      },
    ],
  }
  return goalsByDomain[weakestDomain] || goalsByDomain.stress
}

export function determineArchetype(
  scores: DomainScores,
  answers: Record<string, any>,
): string {
  const stressScore = scores.stress
  const sleepScore = scores.sleep
  const beautyScore = scores.beauty
  const overallScore =
    (scores.sleep +
      scores.nutrition +
      scores.activity +
      scores.stress +
      scores.beauty +
      scores.medical) /
    6

  if (stressScore < 40 && sleepScore < 50) return 'The Stressed Overachiever'
  if (beautyScore > 70 && stressScore < 50) return 'The Self-Care Seeker'
  if (sleepScore < 40 && scores.nutrition < 40 && overallScore < 50)
    return 'The Skeptical Beginner'
  if (scores.sleep > 70 && scores.nutrition > 70 && scores.activity > 70)
    return 'The Consistency Queen'
  if (answers['B2'] === 'Has tried before, fell off, wants back')
    return 'The Hopeful Restarter'

  return 'The Busy Achiever'
}

export function determineReadinessStage(answers: Record<string, any>): string {
  const readiness = answers['L4'] || answers['readiness'] || ''
  const readinessStr = String(readiness).toLowerCase()

  if (readinessStr.includes('contemplation') || readinessStr.includes('تفکر'))
    return 'Contemplation'
  if (
    readinessStr.includes('preparation') ||
    readinessStr.includes('آماده‌سازی')
  )
    return 'Preparation'
  if (readinessStr.includes('action') || readinessStr.includes('عمل'))
    return 'Action'
  if (readinessStr.includes('maintenance') || readinessStr.includes('نگهداری'))
    return 'Maintenance'

  return 'Preparation'
}

// ============================================
// FALLBACK FULL RESPONSE (exported for use in service)
// ============================================

export function getFallbackAnalysis(
  scores: DomainScores,
  answers: Record<string, any>,
): AIAnalysisResult {
  const entries = Object.entries(scores)
  const lowest = entries.reduce((a, b) => (a[1] < b[1] ? a : b))
  const weakestDomain = lowest[0] as keyof DomainScores

  return {
    summary: getDefaultSummary(scores),
    diagnosis: getDefaultDiagnosis(weakestDomain),
    goals: getDefaultGoals(scores, weakestDomain),
    healthArchetype: determineArchetype(scores, answers),
    readinessStage: determineReadinessStage(answers),
  }
}
