import { StorageClient } from '@supabase/storage-js';
import Logger from './logger';

const STORAGE_URL = process.env.SUPABASE_STORAGE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const storageClient = new StorageClient(STORAGE_URL!, {
  Authorization: `Bearer ${SERVICE_KEY}`,
});

export const getSupabaseDownloadUrl = async (
  filePath: string,
  bucketName: string
): Promise<string> => {
  try {
    const fullPath = filePath;

    // Get signed URL valid for 1 hour
    const response = await storageClient
      .from(bucketName)
      .createSignedUrl(fullPath, 3600);

    if (response.error) {
      console.error('Error from Supabase:', response.error);
      throw new Error(`Supabase error: ${response.error.message}`);
    }

    if (!response.data?.signedUrl) {
      throw new Error('No signed URL received from Supabase');
    }

    return response.data.signedUrl;
  } catch (error) {
    Logger.error(error, null, {
      message: 'Error fetching signed URL',
      filePath,
      bucketName,
    });
    return '';
  }
};

/**
 * Retrieves the content of a file from Supabase Storage.
 *
 * @param {string} bucketName - The name of the Supabase storage bucket.
 * @param {string} filePath - The path of the file within the bucket.
 * @returns {Promise<string | null>} Resolves to the file content as a string, or `null` if an error occurs.
 *
 * @throws {Error} If the file download fails, an error is logged and handled.
 */
export const getFileContent = async (
  bucketName: string,
  filePath: string
): Promise<string | null> => {
  try {
    const { data, error } = await storageClient
      .from(bucketName)
      .download(filePath);

    if (error) {
      throw new Error(`Error downloading file: ${error.message}`);
    }

    return await data.text();
  } catch (err) {
    Logger.error(err, null, {
      message: 'Error fetching file content',
      filePath,
      bucketName,
    });
    return null;
  }
};
