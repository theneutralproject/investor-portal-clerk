import { StorageClient } from "@supabase/storage-js";

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
      console.error("Error from Supabase:", response.error);
      throw new Error(`Supabase error: ${response.error.message}`);
    }

    if (!response.data?.signedUrl) {
      throw new Error("No signed URL received from Supabase");
    }

    return response.data.signedUrl;
  } catch (error) {
    console.error(error);
    return "";
  }
};
