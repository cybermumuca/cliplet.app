import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import { db } from "@/db/connection";
import { clips, files, images, videos, audios, documents } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
import { env } from "@/lib/env";

export const GET = withAuth(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }, userId: string) => {
  const { id } = await params;

  const [clip] = await db.select({
    id: clips.id,
    type: clips.type,
    fileKey: files.fileKey,
    fileName: files.originalName,
    imageKey: images.fileKey,
    imageName: images.originalName,
    videoKey: videos.fileKey,
    videoName: videos.originalName,
    audioKey: audios.fileKey,
    audioName: audios.originalName,
    documentKey: documents.fileKey,
    documentName: documents.originalName,
  })
    .from(clips)
    .leftJoin(files, eq(clips.id, files.id))
    .leftJoin(images, eq(clips.id, images.id))
    .leftJoin(videos, eq(clips.id, videos.id))
    .leftJoin(audios, eq(clips.id, audios.id))
    .leftJoin(documents, eq(clips.id, documents.id))
    .where(and(eq(clips.id, id), eq(clips.userId, userId)));

  if (!clip) {
    return NextResponse.json({ error: "Clip não encontrado" }, { status: 404 });
  }

  const fileKey = clip.fileKey || clip.imageKey || clip.videoKey || clip.audioKey || clip.documentKey;
  const fileName = clip.fileName || clip.imageName || clip.videoName || clip.audioName || clip.documentName || "arquivo";

  if (!fileKey) {
    return NextResponse.json({ error: "Arquivo não encontrado" }, { status: 404 });
  }

  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: fileKey,
  });

  const s3Response = await s3.send(command);

  return new NextResponse(s3Response.Body?.transformToWebStream(), {
    status: 200,
    headers: {
      "Content-Type": s3Response.ContentType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
    },
  });
});