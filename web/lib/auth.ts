import { cookies } from "next/headers";
import { env } from "./env";
import { JWTPayload, jwtVerify } from "jose";
import { Either, Left, Right } from "./either";
import { NextRequest, NextResponse } from "next/server";

interface AuthError {
  code: string;
  message: string;
}

async function getCurrentUserId(): Promise<Either<AuthError, string>> {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token");

    if (!authToken?.value) {
      return Left.create({
        code: "TOKEN_NOT_FOUND",
        message: "Token de autenticação não encontrado"
      });
    }

    const secret = new TextEncoder().encode(env.JWT_SECRET);

    let payload: JWTPayload;

    try {
      const result = await jwtVerify(authToken.value, secret);
      payload = result.payload;
    } catch (jwtError) {
      return Left.create({
        code: "INVALID_TOKEN",
        message: "Token inválido ou expirado"
      });
    }

    const userId = payload.sub;

    if (!userId || typeof userId !== "string") {
      return Left.create({
        code: "USER_ID_NOT_FOUND",
        message: "ID do usuário não encontrado no token"
      });
    }

    return Right.create(userId);
  } catch (error) {
    return Left.create({
      code: "UNKNOWN_ERROR",
      message: "Erro desconhecido"
    });
  }
}

export function withAuth(
  handler: (request: NextRequest, userId: string) => Promise<NextResponse>
): (request: NextRequest) => Promise<NextResponse>;

export function withAuth<T = any>(
  handler: (request: NextRequest, context: { params: Promise<T> }, userId: string) => Promise<NextResponse>
): (request: NextRequest, context: { params: Promise<T> }) => Promise<NextResponse>;

export function withAuth<T = any>(
  handler: ((request: NextRequest, userId: string) => Promise<NextResponse>) |
    ((request: NextRequest, context: { params: Promise<T> }, userId: string) => Promise<NextResponse>)
) {
  return async (request: NextRequest, context: { params?: Promise<T> }) => {
    const getCurrentUserIdResult = await getCurrentUserId();

    if (getCurrentUserIdResult.isLeft()) {
      return NextResponse.json({
        code: getCurrentUserIdResult.error.code,
        error: getCurrentUserIdResult.error.message
      }, { status: 401 });
    }

    const userId = getCurrentUserIdResult.value;

    if (context.params) {
      return (handler as any)(request, context, userId);
    }

    return (handler as any)(request, userId);
  };
}