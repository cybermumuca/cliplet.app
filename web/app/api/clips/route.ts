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