import { db } from "@/db/connection";
import { audios } from "@/db/schema/audio";
import { clips, clipTypesEnum } from "@/db/schema/clip";
import { documents } from "@/db/schema/document";
import { files } from "@/db/schema/file";
import { images } from "@/db/schema/image";
import { texts } from "@/db/schema/text";
import { videos } from "@/db/schema/video";
import { withAuth } from "@/lib/auth";
import { env } from "@/lib/env";
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

      const url = `${env.S3_PUBLIC_URL}/${clip.fileKey}`;

      const audioClip = {
        id: newClip.id,
        fileName: clip.fileName,
        fileKey: clip.fileKey,
        fileSize: clip.fileSize,
        mimeType: clip.mimeType,
        originalName: clip.originalFileName,
        url,
        duration: clip.duration,
      };

      await tx.insert(audios).values(audioClip);

      return {
        id: newClip.id,
        type: newClip.type,
        content: url,
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

      const url = `${env.S3_PUBLIC_URL}/${clip.fileKey}`;

      const documentClip = {
        id: newClip.id,
        fileName: clip.fileName,
        fileKey: clip.fileKey,
        fileSize: clip.fileSize,
        mimeType: clip.mimeType,
        originalName: clip.originalFileName,
        url,
      };

      await tx.insert(documents).values(documentClip);

      return {
        id: newClip.id,
        type: newClip.type,
        content: url,
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

      const url = `${env.S3_PUBLIC_URL}/${clip.fileKey}`;

      const fileClip = {
        id: newClip.id,
        fileName: clip.fileName,
        fileKey: clip.fileKey,
        fileSize: clip.fileSize,
        mimeType: clip.fileType,
        originalName: clip.originalFileName,
        url,
      };


      await tx.insert(files).values(fileClip);

      return {
        id: newClip.id,
        type: newClip.type,
        content: url,
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

      const url = `${env.S3_PUBLIC_URL}/${clip.fileKey}`;

      const imageClip = {
        id: newClip.id,
        fileName: clip.fileName,
        fileKey: clip.fileKey,
        fileSize: clip.fileSize,
        mimeType: clip.mimeType,
        originalName: clip.originalFileName,
        url,
        width: clip.width,
        height: clip.height,
      };

      await tx.insert(images).values(imageClip);

      return {
        id: newClip.id,
        type: newClip.type,
        content: url,
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

      return { id: newClip.id, type: newClip.type, content: clip.content, createdAt: newClip.createdAt };
    });

    return NextResponse.json(newClip, { status: 201 });
  }

  if (clip.type === "video") {
    const newClip = await db.transaction(async (tx) => {
      const [newClip] = await tx.insert(clips).values({
        type: clip.type,
        userId
      }).returning();

      const url = `${env.S3_PUBLIC_URL}/${clip.fileKey}`;

      const videoClip = {
        id: newClip.id,
        fileName: clip.fileName,
        fileKey: clip.fileKey,
        fileSize: clip.fileSize,
        mimeType: clip.mimeType,
        originalName: clip.originalFileName,
        url,
        duration: clip.duration,
      };

      await tx.insert(videos).values(videoClip);

      return {
        id: newClip.id,
        type: newClip.type,
        content: url,
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
      imageUrl: images.url,
      imageFileName: images.originalName,

      // Video data
      videoUrl: videos.url,
      videoFileName: videos.originalName,

      // Audio data
      audioUrl: audios.url,
      audioFileName: audios.originalName,

      // Document data
      documentUrl: documents.url,
      documentFileName: documents.originalName,

      // File data
      fileUrl: files.url,
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

  const transformedClips = clipsList.map(clip => {
    const baseClip = {
      id: clip.id,
      type: clip.type,
      createdAt: clip.createdAt,
    };

    switch (clip.type) {
      case 'text':
        return { ...baseClip, content: clip.textContent, fileName: null };
      case 'image':
        return {
          ...baseClip,
          content: clip.imageUrl,
          fileName: clip.imageFileName,
        };
      case 'video':
        return {
          ...baseClip,
          content: clip.videoUrl,
          fileName: clip.videoFileName,
        };
      case 'audio':
        return {
          ...baseClip,
          content: clip.audioUrl,
          fileName: clip.audioFileName,
        };
      case 'document':
        return {
          ...baseClip,
          content: clip.documentUrl,
          fileName: clip.documentFileName
        };
      case 'file':
        return {
          ...baseClip,
          content: clip.fileUrl,
          fileName: clip.fileFileName
        };
      default:
        return baseClip;
    }
  });

  return NextResponse.json(transformedClips, { status: 200 });
});