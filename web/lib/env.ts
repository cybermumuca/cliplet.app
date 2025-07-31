import { z } from 'zod'

const envSchema = z.object({
  GITHUB_OAUTH_CLIENT_ID: z.string().min(1, 'GitHub OAuth Client ID is required'),
  GITHUB_OAUTH_CLIENT_SECRET: z.string().min(1, 'GitHub OAuth Client Secret is required'),
  GITHUB_OAUTH_CLIENT_REDIRECT_URI: z.url('Invalid GitHub OAuth redirect URI'),

  GOOGLE_OAUTH_CLIENT_ID: z.string().min(1, 'Google OAuth Client ID is required'),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string().min(1, 'Google OAuth Client Secret is required'),
  GOOGLE_OAUTH_CLIENT_REDIRECT_URI: z.url('Invalid Google OAuth redirect URI'),

  DATABASE_URL: z.url('Invalid Database URL'),
  
  JWT_SECRET: z.string().min(1, 'JWT Secret is required'),
})

export type Env = z.infer<typeof envSchema>

export const env = envSchema.parse(process.env)