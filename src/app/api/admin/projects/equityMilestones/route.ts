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
  try {
    await getAdminFromRequest(request);
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
    const fileName = fileDetails.name;
    const tempPath = `temp/${project.slug}/${fileName}`;
    // move to temp storage
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

    // get file Url
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

    // check if a file of the same name already exists in storage, and delete it
    try {
      await storageClient
        .from(projectDocsBucket)
        .remove([`${project.slug}/${fileName}`]);
    } catch (__error) {
      // if the file does not exist, we can ignore the error
    }

    // if we made it this far, the file is formatted correctly. Lets move it to permanent storage
    const newPath = `${project.slug}/${fileName}`;
    const { error: finalError } = await storageClient
      .from(projectDocsBucket)
      .move(`temp/${project.slug}/${fileName}`, `${newPath}`);
    if (finalError) {
      return errorResponse('Failed to move file to storage', 500, {
        request,
        extra: { error: finalError },
      });
    }

    // update the project with the equity milestones csv path
    const {
      data: { publicUrl: newPublicUrl },
    } = storageClient.from(projectDocsBucket).getPublicUrl(newPath);

    await prisma.project.update({
      where: { id: projectId },
      data: {
        equityReturnsFile: newPublicUrl,
      },
    });

    return jsonResponse({
      message: 'File upload successful',
      newPublicUrl,
    });
  } catch (error) {
    return errorResponse('Error uploading equityMilestones file', 500, {
      request,
      extra: { error },
    });
  }
}
