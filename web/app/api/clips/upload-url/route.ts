import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { withAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { s3 } from "@/lib/s3";
import { env } from "@/lib/env";

export const POST = withAuth(async (request: NextRequest, userId: string) => {
  const { originalFileSize, originalMimeType } = await request.json();

  if (originalFileSize > 10 * 1024 * 1024) { // 10MB
    return NextResponse.json({ error: "Arquivo muito grande" }, { status: 400 });
  }

  const uniqueFileName = `${randomUUID()}`;
  const fileKey = `${userId}/${uniqueFileName}`;

  try {
    const command = new PutObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: fileKey,
      ContentType: originalMimeType,
      ContentLength: originalFileSize,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 600 }); // 10 minutos

    return NextResponse.json({
      uploadUrl,
      fileKey,
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao gerar URL" }, { status: 500 });
  }
});