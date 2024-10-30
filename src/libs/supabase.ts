import { StorageClient } from '@supabase/storage-js'

const STORAGE_URL = process.env.SUPABASE_STORAGE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const storageClient = new StorageClient(STORAGE_URL!, {
  Authorization: `Bearer ${SERVICE_KEY}`,
});

// export const supabase = createClient(`${process.env.SUPABASE_PROJECT_URL}`, `${process.env.SUPABASE_ANON_KEY}`)
