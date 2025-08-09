import { db } from "@/db/connection";
import { audios } from "@/db/schema/audio";
import { clips } from "@/db/schema/clip";
import { documents } from "@/db/schema/document";
import { files } from "@/db/schema/file";
import { images } from "@/db/schema/image";
import { texts } from "@/db/schema/text";
import { videos } from "@/db/schema/video";
import { withAuth } from "@/lib/auth";
import { env } from "@/lib/env";
import { s3 } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { and, eq, asc, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = withAuth(async (request: NextRequest, userId: string) => {
  const clip = await request.json();

  if (clip.type === "audio") {
    const newClip = await db.transaction(async (tx) => {
      const [newClip] = await tx.insert(clips).values({
        type: clip.type,
        userId
      }).returning();

      const audioClip = {
        id: newClip.id,
        fileKey: clip.fileKey,
        fileSize: clip.fileSize,
        mimeType: clip.mimeType,
        originalName: clip.originalFileName,
        duration: clip.duration,
      };

      await tx.insert(audios).values(audioClip);

      return {
        id: newClip.id,
        type: newClip.type,
        createdAt: newClip.createdAt
      };
    });

    return NextResponse.json(newClip, { status: 201 });
  }

  if (clip.type === "document") {
    const newClip = await db.transaction(async (tx) => {
      const [newClip] = await tx.insert(clips).values({
        type: clip.type,
        userId
      }).returning();

      const documentClip = {
        id: newClip.id,
        fileKey: clip.fileKey,
        fileSize: clip.fileSize,
        mimeType: clip.mimeType,
        originalName: clip.originalFileName,
      };

      await tx.insert(documents).values(documentClip);

      return {
        id: newClip.id,
        type: newClip.type,
        createdAt: newClip.createdAt
      };
    });

    return NextResponse.json(newClip, { status: 201 });
  }

  if (clip.type === "file") {
    const newClip = await db.transaction(async (tx) => {
      const [newClip] = await tx.insert(clips).values({
        type: "file",
        userId
      }).returning();

      const fileClip = {
        id: newClip.id,
        fileKey: clip.fileKey,
        fileSize: clip.fileSize,
        mimeType: clip.fileType,
        originalName: clip.originalFileName,
      };


      await tx.insert(files).values(fileClip);

      return {
        id: newClip.id,
        type: newClip.type,
        createdAt: newClip.createdAt
      };
    });

    return NextResponse.json(newClip, { status: 201 });
  }

  if (clip.type === "image") {
    const newClip = await db.transaction(async (tx) => {
      const [newClip] = await tx.insert(clips).values({
        type: clip.type,
        userId
      }).returning();

      const imageClip = {
        id: newClip.id,
        fileKey: clip.fileKey,
        fileSize: clip.fileSize,
        mimeType: clip.mimeType,
        originalName: clip.originalFileName,
        width: clip.width,
        height: clip.height,
      };

      await tx.insert(images).values(imageClip);

      return {
        id: newClip.id,
        type: newClip.type,
        createdAt: newClip.createdAt
      };
    });

    return NextResponse.json(newClip, { status: 201 });
  }

  if (clip.type === "text") {
    const newClip = await db.transaction(async (tx) => {
      const [newClip] = await tx.insert(clips).values({
        type: clip.type,
        userId
      }).returning();

      const textClip = {
        id: newClip.id,
        content: clip.content,
      };

      await tx.insert(texts).values(textClip);

      return { id: newClip.id, type: newClip.type, createdAt: newClip.createdAt };
    });

    return NextResponse.json(newClip, { status: 201 });
  }

  if (clip.type === "video") {
    const newClip = await db.transaction(async (tx) => {
      const [newClip] = await tx.insert(clips).values({
        type: clip.type,
        userId
      }).returning();

      const videoClip = {
        id: newClip.id,
        fileKey: clip.fileKey,
        fileSize: clip.fileSize,
        mimeType: clip.mimeType,
        originalName: clip.originalFileName,
        duration: clip.duration,
      };

      await tx.insert(videos).values(videoClip);

      return {
        id: newClip.id,
        type: newClip.type,
        createdAt: newClip.createdAt
      };
    });

    return NextResponse.json(newClip, { status: 201 });
  }

  return NextResponse.json(
    { error: "Tipo de clip não suportado" },
    { status: 400 }
  );
});

export const GET = withAuth(async (request: NextRequest, userId: string) => {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") || "all";
  const sort = searchParams.get("sort") || "asc";

  const whereConditions = [eq(clips.userId, userId)];

  if (filter && filter !== "all") {
    whereConditions.push(eq(clips.type, filter as "text" | "image" | "video" | "audio" | "document" | "file"));
  }

  const clipsList = await db
    .select({
      id: clips.id,
      type: clips.type,
      createdAt: clips.createdAt,

      // Text content
      textContent: texts.content,

      // Image data
      imageKey: images.fileKey,
      imageFileName: images.originalName,

      // Video data
      videoKey: videos.fileKey,
      videoFileName: videos.originalName,

      // Audio data
      audioKey: audios.fileKey,
      audioFileName: audios.originalName,

      // Document data
      documentKey: documents.fileKey,
      documentFileName: documents.originalName,

      // File data
      fileKey: files.fileKey,
      fileFileName: files.originalName
    })
    .from(clips)
    .leftJoin(texts, eq(clips.id, texts.id))
    .leftJoin(images, eq(clips.id, images.id))
    .leftJoin(videos, eq(clips.id, videos.id))
    .leftJoin(audios, eq(clips.id, audios.id))
    .leftJoin(documents, eq(clips.id, documents.id))
    .leftJoin(files, eq(clips.id, files.id))
    .where(and(...whereConditions))
    .orderBy(
      sort === "newest" ? desc(clips.createdAt) : asc(clips.createdAt)
    );

  const transformedClips = await Promise.all(clipsList.map(async clip => {
    const baseClip = {
      id: clip.id,
      type: clip.type,
      createdAt: clip.createdAt,
    };

    switch (clip.type) {
      case 'text':
        return { ...baseClip, content: clip.textContent, fileName: null };
      case 'image': {
        const getCommand = new GetObjectCommand({
          Bucket: env.S3_BUCKET_NAME,
          Key: clip.imageKey!,
          ResponseContentDisposition: `inline; filename="${clip.imageFileName}"`,
        });

        const imageUrl = await getSignedUrl(s3, getCommand, { expiresIn: 1800 }); // 30 min

        return {
          ...baseClip,
          content: imageUrl,
          fileName: clip.imageFileName,
        };
      }
      case 'video': {
        const getCommand = new GetObjectCommand({
          Bucket: env.S3_BUCKET_NAME,
          Key: clip.videoKey!,
          ResponseContentDisposition: `inline; filename="${clip.videoFileName}"`,
        });

        const videoUrl = await getSignedUrl(s3, getCommand, { expiresIn: 1800 }); // 30 min

        return {
          ...baseClip,
          content: videoUrl,
          fileName: clip.videoFileName,
        };
      }
      case 'audio': {
        const getCommand = new GetObjectCommand({
          Bucket: env.S3_BUCKET_NAME,
          Key: clip.audioKey!,
          ResponseContentDisposition: `inline; filename="${clip.audioFileName}"`,
        });

        const audioUrl = await getSignedUrl(s3, getCommand, { expiresIn: 1800 }); // 30 min

        return {
          ...baseClip,
          content: audioUrl,
          fileName: clip.audioFileName,
        };
      }
      case 'document': {
        const getCommand = new GetObjectCommand({
          Bucket: env.S3_BUCKET_NAME,
          Key: clip.documentKey!,
          ResponseContentDisposition: `inline; filename="${clip.documentFileName}"`,
        });

        const documentUrl = await getSignedUrl(s3, getCommand, { expiresIn: 1800 }); // 30 min

        return {
          ...baseClip,
          content: documentUrl,
          fileName: clip.documentFileName
        };
      }
      case 'file': {
        const getCommand = new GetObjectCommand({
          Bucket: env.S3_BUCKET_NAME,
          Key: clip.fileKey!,
          ResponseContentDisposition: `inline; filename="${clip.fileFileName}"`,
        });

        const fileUrl = await getSignedUrl(s3, getCommand, { expiresIn: 1800 }); // 30 min

        return {
          ...baseClip,
          content: fileUrl,
          fileName: clip.fileFileName
        };
      }
      default:
        return baseClip;
    }
  }));

  return NextResponse.json(transformedClips, { status: 200 });
});