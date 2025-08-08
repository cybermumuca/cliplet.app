import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  // Remove o cookie de autenticação
  await (await cookies()).set({
    name: "auth_token",
    value: "",
    path: "/",
    maxAge: 0,
    httpOnly: true,
  });

  return NextResponse.json({ success: true });
}
