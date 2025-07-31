import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { message: 'Github OAuth code was not found.' },
      { status: 400 },
    );
  }

  const response = await fetch(`${request.nextUrl.origin}/api/auth/github`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { message: 'Github OAuth error.' },
      { status: 500 },
    );
  }

  const { token } = await response.json();

  (await cookies()).set({
    name: "auth_token",
    value: token,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
  })

  const redirectUrl = request.nextUrl.clone();

  redirectUrl.pathname = '/';
  redirectUrl.search = '';

  return NextResponse.redirect(redirectUrl);
}