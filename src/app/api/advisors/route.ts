'use server';
import { NextRequest } from 'next/server';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { getAdvisorContext } from '@/libs/advisorFirm/utils.server';
import { storageClient } from '@/libs/supabase';
import prisma from '@/libs/prisma.server';
import Logger from '@/libs/logger';
import { zAdvisorFirmUpdateSchema } from '@/libs/advisorFirm/schema';

const ADVISOR_LOGOS_BUCKET = 'advisor-logos';

export async function GET(request: NextRequest) {
  const context = await getAdvisorContext(request);
  if ('status' in context) return context;

  const { advisorFirm } = context;
  return jsonResponse(advisorFirm);
}

export async function PUT(request: NextRequest) {
  const formData = await request.formData();
  const rawFile = formData.get('file');
  const rawName = formData.get('name');

  const parseResult = zAdvisorFirmUpdateSchema.safeParse({
    name: rawName,
    file: rawFile,
  });
  if (!parseResult.success) {
    const message = parseResult.error.errors[0]?.message || 'Invalid input';
    return errorResponse(message, 400);
  }

  const { file, name } = parseResult.data;

  const contextResult = await getAdvisorContext(request);
  if ('status' in contextResult) return contextResult;
  const { advisorFirm, dbUser } = contextResult;

  let logoUrl: string | null = null;

  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadPath = `${advisorFirm.id}/${file.name}`;
    const fullPath = `${ADVISOR_LOGOS_BUCKET}/${advisorFirm.id}/${file.name}`;

    Logger.log(
      {
        message: `Uploading file '${file.name}' to ${fullPath}`,
        extra: {
          advisorFirm,
          dbUser,
        },
      },
      request
    );

    const { error } = await storageClient
      .from(ADVISOR_LOGOS_BUCKET)
      .upload(uploadPath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error(error);
      return errorResponse('Failed to upload logo to Supabase', 500);
    }

    const { data: publicUrlData } = storageClient
      .from(ADVISOR_LOGOS_BUCKET)
      .getPublicUrl(uploadPath);
    logoUrl = publicUrlData.publicUrl;
  }

  const updateParams = {
    ...(name ? { name } : {}),
    ...(logoUrl ? { logoUrl } : {}),
  };

  Logger.log(
    {
      message: `Updating advisor Firm #${advisorFirm.id}`,
      extra: {
        params: updateParams,
      },
    },
    request
  );

  const updated = await prisma.advisorFirm.update({
    where: { id: advisorFirm.id },
    data: updateParams,
  });

  return jsonResponse(updated);
}
