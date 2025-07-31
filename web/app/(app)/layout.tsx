import { redirect } from 'next/navigation'

import { cookies } from 'next/headers'

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies();

  if (!cookieStore.get('auth_token')?.value) {
    redirect('/auth/sign-in');
  }

  return (
    <>
      {children}
    </>
  )
}