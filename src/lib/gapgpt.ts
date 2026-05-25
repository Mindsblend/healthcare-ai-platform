import OpenAI from 'openai'

export const gapgpt = new OpenAI({
  apiKey: process.env.GAPGPT_API_KEY,
  baseURL: process.env.GAPGPT_BASE_URL || 'https://api.gapgpt.app/v1',
  dangerouslyAllowBrowser: false, // Only use on server side
})
