'use server';

import { redirect } from "next/navigation";

export async function signInWithGithub() {
  const githubSignInURL = new URL('login/oauth/authorize', 'https://github.com')

  githubSignInURL.searchParams.set('client_id', process.env.GITHUB_OAUTH_CLIENT_ID!)
  githubSignInURL.searchParams.set('redirect_uri', process.env.GITHUB_OAUTH_CLIENT_REDIRECT_URI!)
  githubSignInURL.searchParams.set('scope', 'user:email')

  redirect(githubSignInURL.toString())
}

export async function signInWithGoogle() {
  const googleSignInURL = new URL('oauth2/v2/auth', 'https://accounts.google.com')

  googleSignInURL.searchParams.set('client_id', process.env.GOOGLE_OAUTH_CLIENT_ID!)
  googleSignInURL.searchParams.set('redirect_uri', process.env.GOOGLE_OAUTH_CLIENT_REDIRECT_URI!)
  googleSignInURL.searchParams.set('response_type', 'code')
  googleSignInURL.searchParams.set('scope', 'openid email profile')

  redirect(googleSignInURL.toString())
}