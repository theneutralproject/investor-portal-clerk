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
