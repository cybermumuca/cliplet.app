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

  S3_ENDPOINT: z.string().min(1, 'S3 Endpoint is required'),
  S3_ACCESS_KEY_ID: z.string().min(1, 'S3 Access Key ID is required'),
  S3_SECRET_ACCESS_KEY: z.string().min(1, 'S3 Secret Access Key is required'),
  S3_BUCKET_NAME: z.string().min(1, 'S3 Bucket Name is required'),
})

export type Env = z.infer<typeof envSchema>

export const env = envSchema.parse(process.env)