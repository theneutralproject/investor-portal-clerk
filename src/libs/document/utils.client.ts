import * as tus from 'tus-js-client';
import { createFileSchema } from './schema';
import Logger from '../logger';

interface IUploadResumableFile {
  bucketName: string;
  fileName: string;
  url: string;
  token: string;
  file: File;
}

export async function uploadResumableFile({
  bucketName,
  fileName,
  url,
  token,
  file,
}: IUploadResumableFile) {
  const validationResult = createFileSchema().safeParse(file);

  if (!validationResult.success) {
    Logger.error('Validation errors:', null, {
      validationError: validationResult.error,
    });
    return new Error(`Validation failed: ${validationResult.error.format()}`);
  }

  return new Promise(async (resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: `${url}/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        authorization: `Bearer ${token}`,
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: false,
      metadata: {
        bucketName: bucketName,
        objectName: fileName,
        contentType: file.type,
      },
      chunkSize: 5 * 1024 * 1024,
      onError: function (error) {
        if (error.message.includes('resource already exists')) {
          reject(new Error('The file already exists'));
        }
        if (error.message.includes('Maximum size exceeded')) {
          reject(new Error('Maximum size exceeded (6MB)'));
        }
        reject(new Error('An unexpected error ocurred uploading the file'));
      },
      onSuccess: function () {
        resolve({
          uploaded: true,
        });
      },
    });

    return upload.findPreviousUploads().then(previousUploads => {
      // Found previous uploads so we select the first one.
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]!);
      }
      // Start the upload
      upload.start();
    });
  });
}

export const uploadDocumentWithXhr = async (
  uploadUrl: string,
  file: File
): Promise<void> => {
  let fileData: ArrayBuffer;
  if (isFileLike(file)) {
    fileData = await file.arrayBuffer();
  } else if (typeof file === 'string') {
    // Handle string data if needed
    fileData = new TextEncoder().encode(file).buffer;
  } else {
    throw new Error('Invalid file format');
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('PUT', uploadUrl, true);
    xhr.setRequestHeader('Content-Type', file.type);

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('XHR upload error'));
    };

    xhr.send(fileData);
  });
};

export interface FileWrapper {
  name: string;
  type: string;
  size?: number;
  arrayBuffer(): Promise<ArrayBuffer>;
}

// Helper function to determine if value is File-like
export const isFileLike = (value: unknown): value is FileWrapper => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'name' in value &&
    'type' in value &&
    typeof (value as FileWrapper).arrayBuffer === 'function'
  );
};
