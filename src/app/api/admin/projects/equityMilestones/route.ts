import { getAdminFromRequest, getFileDetails } from '@/libs/admin/utils.server';
import Logger from '@/libs/logger';
import prisma from '@/libs/prisma.server';
import { validateEquityMilestonesFile } from '@/libs/returns/utils.server';
import { storageClient } from '@/libs/supabase';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import { NextRequest } from 'next/server';

const projectDocsBucket = 'project-documents';

// admin uploads a csv file for a project via form data
export async function POST(request: NextRequest) {
  let admin;
  console.log(admin);
  try {
    admin = await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  let projectId: number | null = null;
  try {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);
    projectId = parseInt(queryParams.get('projectId') ?? '-1');
  } catch (error) {
    return errorResponse('unable to read query params', 500, {
      request,
      extra: { error },
    });
  }

  let csvFile: FormDataEntryValue | null = null;
  try {
    const formData = await request.formData();
    const file = formData.getAll('file');
    csvFile = file[0] ?? null;
  } catch (error) {
    console.error('unable to read form data');
    return errorResponse('unable to read form data', 500, {
      request,
      extra: { error },
    });
  }

  if (!csvFile) {
    return jsonResponse('file is required', 400);
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      investmentStats: true,
    },
  });
  if (!project?.investmentStats) {
    return errorResponse(`project with id ${projectId} not found`, 404, {
      request,
    });
  }

  try {
    const fileDetails = getFileDetails(csvFile);
    const originalFileName = fileDetails.name;
    const fileNameWithoutExt = originalFileName.replace(/\.[^/.]+$/, '');
    const fileExt = originalFileName.match(/\.[^/.]+$/)?.[0] || '';

    // Find the latest version number for this file
    const latestVersion = await prisma.equityMilestoneFile.findFirst({
      where: {
        projectId: projectId,
      },
      orderBy: {
        versionNum: 'desc',
      },
    });

    const nextVersionNum = latestVersion ? latestVersion.versionNum + 1 : 1;
    const versionedFileName = `${fileNameWithoutExt}_v${nextVersionNum}${fileExt}`;
    const tempPath = `temp/${project.slug}/${versionedFileName}`;

    // Upload to temp storage first
    const { error } = await storageClient
      .from(projectDocsBucket)
      .upload(`${tempPath}`, csvFile);
    if (error) {
      Logger.warn('Failed to upload file to tempstorage:', request, { error });
      if (error.message !== 'The resource already exists') {
        return errorResponse('Failed to upload file to tempstorage', 500, {
          request,
          extra: { error },
        });
      }
    }

    // Get file Url for validation
    const {
      data: { publicUrl },
    } = storageClient.from(projectDocsBucket).getPublicUrl(tempPath);

    const { investmentStats, ...projectData } = project;
    const fileIsValid = await validateEquityMilestonesFile(publicUrl, {
      investmentStats,
      ...projectData,
    });
    if (!fileIsValid) {
      Logger.warn('File is not formatted correctly:', request, {
        method: 'validateEquityMilestonesFile',
      });
      return jsonResponse('File is not formatted correctly', 400);
    }

    // Final path with versioned filename
    const newPath = `${project.slug}/${versionedFileName}`;

    // Move file to permanent storage with versioned filename
    const { error: finalError } = await storageClient
      .from(projectDocsBucket)
      .move(`temp/${project.slug}/${versionedFileName}`, `${newPath}`);
    if (finalError) {
      return errorResponse('Failed to move file to storage', 500, {
        request,
        extra: { error: finalError },
      });
    }

    // Get public URL for the versioned file
    const {
      data: { publicUrl: newPublicUrl },
    } = storageClient.from(projectDocsBucket).getPublicUrl(newPath);

    // Create a new file version record in the database
    const fileVersion = await prisma.equityMilestoneFile.create({
      data: {
        projectId: projectId,
        fileName: originalFileName, // Store original filename for reference
        filePath: newPath,
        publicUrl: newPublicUrl,
        versionNum: nextVersionNum,
        uploadedBy: admin.email,
      },
    });

    await prisma.project.update({
      where: { id: projectId },
      data: {
        equityReturnsFile: newPublicUrl,
      },
    });

    return jsonResponse({
      message: 'File upload successful',
      fileVersion: fileVersion,
      newPublicUrl,
    });
  } catch (error) {
    return errorResponse('Error uploading equityMilestones file', 500, {
      request,
      extra: { error },
    });
  }
}
