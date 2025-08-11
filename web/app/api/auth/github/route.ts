import { db } from "@/db/connection";
import { userAuthProviders, users } from "@/db/schema";
import { env } from "@/lib/env";
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod";
import { SignJWT } from "jose";

export async function POST(request: NextRequest) {
  const { code } = await request.json();

  const githubOAuthURL = new URL(
    'https://github.com/login/oauth/access_token',
  );

  githubOAuthURL.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID)
  githubOAuthURL.searchParams.set(
    'client_secret',
    env.GITHUB_OAUTH_CLIENT_SECRET,
  )
  githubOAuthURL.searchParams.set(
    'redirect_uri',
    env.GITHUB_OAUTH_CLIENT_REDIRECT_URI,
  )
  githubOAuthURL.searchParams.set('code', code)

  const githubAccessTokenResponse = await fetch(githubOAuthURL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  })

  const githubAccessTokenData = await githubAccessTokenResponse.json();

  const { access_token: githubAccessToken } = z
    .object({
      access_token: z.string(),
      token_type: z.literal('bearer'),
      scope: z.string(),
    })
    .parse(githubAccessTokenData)

  const githubUserResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${githubAccessToken}`,
    },
  })

  const githubUserData = await githubUserResponse.json()

  const githubEmailsResponse = await fetch('https://api.github.com/user/emails', {
    headers: {
      Authorization: `Bearer ${githubAccessToken}`,
    },
  })

  const githubEmailsData = await githubEmailsResponse.json()

  const primaryEmail = githubEmailsData.find((emailObj: { primary: boolean }) => emailObj.primary)?.email;

  const {
    id: githubId,
    name,
    avatar_url: avatarUrl,
  } = z
    .object({
      id: z.number().int().transform(String),
      avatar_url: z.url(),
      name: z.string().nullable(),

    })
    .parse(githubUserData)

  if (primaryEmail === undefined || name === null) {
    return NextResponse.json(
      { message: 'Github OAuth error: Unable to get user email or name.' },
      { status: 500 },
    );
  }

  let user = await db.query.users.findFirst({
    columns: { id: true },
    with: {
      authProviders: {
        columns: { id: true },
        where: (authProviders, { eq }) => eq(authProviders.provider, "GITHUB"),
      },
    },
    where: (users, { eq }) => eq(users.email, primaryEmail),
  });

  if (!user) {
    user = await db.transaction(async (tx) => {
      const [newUser] = await tx.insert(users).values({
        email: primaryEmail,
        name,
        avatarUrl,
      }).returning({ id: users.id });

      await tx.insert(userAuthProviders).values({
        userId: newUser.id,
        provider: "GITHUB",
        providerId: githubId,
      });

      return {
        id: newUser.id,
        authProviders: [{ id: "" }] // just to satisfy the type
      };
    });
  }

  const secret = new TextEncoder().encode(env.JWT_SECRET);

  const token = await new SignJWT({
    sub: user.id,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  return NextResponse.json({ token });
}