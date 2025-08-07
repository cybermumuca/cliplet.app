import { db } from "@/db/connection";
import { audios, clips, documents, files, images, texts, videos } from "@/db/schema";
import { withAuth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
import { env } from "@/lib/env";

export const GET = withAuth(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }, userId: string) => {
  const { id } = await params;

  const [clip] = await db.select({
    id: clips.id,
    type: clips.type,
    createdAt: clips.createdAt,

    // Audio data
    audioUrl: audios.url,
    audioSize: audios.fileSize,
    audioMimeType: audios.mimeType,
    audioFileName: audios.originalName,
    audioDuration: audios.duration,

    // Document data
    documentUrl: documents.url,
    documentSize: documents.fileSize,
    documentMimeType: documents.mimeType,
    documentFileName: documents.originalName,

    // File data
    fileUrl: files.url,
    fileSize: files.fileSize,
    fileFileName: files.originalName,

    // Image data
    imageUrl: images.url,
    imageSize: images.fileSize,
    imageMimeType: images.mimeType,
    imageFileName: images.originalName,
    imageWidth: images.width,
    imageHeight: images.height,

    // Text data
    textContent: texts.content,

    // Video data
    videoUrl: videos.url,
    videoSize: videos.fileSize,
    videoMimeType: videos.mimeType,
    videoFileName: videos.originalName,
    videoDuration: videos.duration,
    videoHeight: videos.height,
    videoWidth: videos.width,
  })
    .from(clips)
    .leftJoin(texts, eq(clips.id, texts.id))
    .leftJoin(images, eq(clips.id, images.id))
    .leftJoin(videos, eq(clips.id, videos.id))
    .leftJoin(audios, eq(clips.id, audios.id))
    .leftJoin(documents, eq(clips.id, documents.id))
    .leftJoin(files, eq(clips.id, files.id))
    .where(and(
      eq(clips.id, id),
      eq(clips.userId, userId)
    ));

  if (!clip) {
    return NextResponse.json({ message: "Clip not found" }, { status: 404 });
  }

  if (clip.type === 'text') {
    return NextResponse.json({
      id: clip.id,
      type: clip.type,
      content: clip.textContent,
      createdAt: clip.createdAt,
    });
  }

  const clipTransformed = {
    id: clip.id,
    type: clip.type,
    content: clip.imageUrl || clip.videoUrl || clip.audioUrl || clip.documentUrl || clip.fileUrl,
    createdAt: clip.createdAt,
    metadata: {
      size: clip.imageSize || clip.videoSize || clip.audioSize || clip.documentSize || clip.fileSize,
      mimeType: clip.imageMimeType || clip.videoMimeType || clip.audioMimeType || clip.documentMimeType,
      fileName: clip.imageFileName || clip.videoFileName || clip.audioFileName || clip.documentFileName || clip.fileFileName,
      ...(clip.audioDuration || clip.videoDuration ? { duration: clip.audioDuration || clip.videoDuration } : {}),
      ...(clip.imageWidth || clip.videoWidth ? { width: clip.imageWidth || clip.videoWidth } : {}),
      ...(clip.imageHeight || clip.videoHeight ? { height: clip.imageHeight || clip.videoHeight } : {}),
    }
  };

  return NextResponse.json(clipTransformed);
})

export const DELETE = withAuth(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }, userId: string) => {
  const { id } = await params;

  try {
    const [clip] = await db.select({
      id: clips.id,
      type: clips.type,

      audioKey: audios.fileKey,
      documentKey: documents.fileKey,
      fileKey: files.fileKey,
      imageKey: images.fileKey,
      videoKey: videos.fileKey,
    })
      .from(clips)
      .leftJoin(audios, eq(clips.id, audios.id))
      .leftJoin(documents, eq(clips.id, documents.id))
      .leftJoin(files, eq(clips.id, files.id))
      .leftJoin(images, eq(clips.id, images.id))
      .leftJoin(videos, eq(clips.id, videos.id))
      .where(and(
        eq(clips.id, id),
        eq(clips.userId, userId)
      ));

    if (!clip) {
      return NextResponse.json({ message: "Clip not found" }, { status: 404 });
    }

    // Delete file from S3 if it's not a text clip
    if (clip.type !== 'text') {
      const fileKey = clip.audioKey || clip.documentKey || clip.fileKey || clip.imageKey || clip.videoKey;

      if (fileKey) {
        try {
          await s3.send(new DeleteObjectCommand({
            Bucket: env.S3_BUCKET_NAME,
            Key: fileKey,
          }));
        } catch (s3Error) {
          console.error("Error deleting file from S3:", s3Error);
        }
      }
    }

    await db.delete(clips).where(and(
      eq(clips.id, id),
      eq(clips.userId, userId)
    ));

    return NextResponse.json({ message: "Clip deleted successfully" });
  } catch (error) {
    console.error("Error deleting clip:", error);
    return NextResponse.json({ message: "Failed to delete clip" }, { status: 500 });
  }
})