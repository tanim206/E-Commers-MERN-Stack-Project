import { config } from '@/config/env';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';

/**
 * Cloudinary Configuration
 */
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

/**
 * File Types
 */
const FileType = {
  IMAGE: 'image',
  PDF: 'pdf',
  VIDEO: 'video',
  RAW: 'raw',
};

/**
 * Detect file type from filename or buffer
 */
const detectFileType = (fileName, buffer) => {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  // PDF detection
  if (ext === 'pdf' || buffer?.toString('utf8', 0, 4) === '%PDF') {
    return FileType.PDF;
  }

  // Image detection
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
  if (imageExtensions.includes(ext)) {
    return FileType.IMAGE;
  }

  // Video detection
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
  if (videoExtensions.includes(ext)) {
    return FileType.VIDEO;
  }

  return FileType.RAW;
};

/**
 * Get Cloudinary resource type
 */
const getResourceType = (fileType) => {
  switch (fileType) {
    case FileType.IMAGE:
      return 'image';
    case FileType.VIDEO:
      return 'video';
    case FileType.PDF:
    case FileType.RAW:
    default:
      return 'raw';
  }
};

/**
 * Generate Cloudinary upload options
 */
const generateUploadOptions = (fileType, fileName, customOptions = {}) => {
  const uniqueId = uuidv4();
  const nameWithoutExt = fileName.split('.')[0];
  const publicId = `${nameWithoutExt}_${uniqueId}`;
  const folder = customOptions.folder || `${fileType}_uploads`;

  const baseOptions = {
    resource_type: getResourceType(fileType),
    folder,
    public_id: publicId,
    overwrite: true,
    unique_filename: false,
    use_filename: true,
  };

  // Image-specific options
  if (fileType === FileType.IMAGE) {
    baseOptions.quality = customOptions.quality || 'auto:good';
    baseOptions.fetch_format = 'auto';
    baseOptions.flags = 'progressive';

    if (customOptions.transformation) {
      baseOptions.transformation = customOptions.transformation;
    }
  }

  // Add tags if provided
  if (Array.isArray(customOptions.tags) && customOptions.tags.length > 0) {
    baseOptions.tags = customOptions.tags;
  }

  return baseOptions;
};

/**
 * Upload a single file to Cloudinary
 */
const uploadFileToCloudinary = async (fileBuffer, fileName, customOptions) => {
  try {
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error('File buffer is empty or invalid');
    }

    if (!fileName || typeof fileName !== 'string') {
      throw new Error('Invalid file name provided');
    }

    const fileType = detectFileType(fileName, fileBuffer);
    const uploadOptions = generateUploadOptions(fileType, fileName, customOptions);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
            return;
          }
          if (!result) {
            reject(new Error('Upload result is undefined'));
            return;
          }
          resolve(result);
        }
      );

      uploadStream.end(fileBuffer);
    });

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      bytes: result.bytes,
      format: result.format,
      resource_type: result.resource_type,
      created_at: result.created_at,
    };
  } catch (error) {
    console.error('Upload error:', {
      fileName,
      message: error.message,
      stack: error.stack,
    });
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

/**
 * Upload multiple files with concurrency limit
 */
const uploadMultipleFiles = async (files, customOptions) => {
  try {
    if (!Array.isArray(files) || files.length === 0) {
      throw new Error('No files provided for upload');
    }

    const BATCH_SIZE = 5;
    const results = [];

    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map((file) =>
          uploadFileToCloudinary(file.buffer, file.name, customOptions)
        )
      );
      results.push(...batchResults);
    }

    return results;
  } catch (error) {
    console.error('Batch upload error:', error.message);
    throw new Error(`Failed to upload multiple files: ${error.message}`);
  }
};

/**
 * Delete a file from Cloudinary
 */
const deleteFileFromCloudinary = async (publicId, resourceType = 'raw') => {
  try {
    if (!publicId || typeof publicId !== 'string') {
      throw new Error('Invalid publicId provided for deletion');
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });

    if (result.result === 'not found') {
      return { success: false, message: 'File not found in Cloudinary' };
    }

    if (result.result !== 'ok') {
      throw new Error(`Delete failed: ${result.result}`);
    }

    return { success: true, message: 'File deleted successfully' };
  } catch (error) {
    console.error('Delete error:', { publicId, message: error.message });
    return { success: false, message: `Delete failed: ${error.message}` };
  }
};

/**
 * Delete multiple files
 */
const deleteMultipleFiles = async (publicIds, resourceType = 'raw') => {
  try {
    return await Promise.all(
      publicIds.map(async (publicId) => {
        const result = await deleteFileFromCloudinary(publicId, resourceType);
        return { publicId, ...result };
      })
    );
  } catch (error) {
    console.error('Batch delete error:', error.message);
    throw new Error(`Failed to delete multiple files: ${error.message}`);
  }
};

/**
 * Extract public ID from Cloudinary URL
 */
const getPublicIdFromUrl = (url) => {
  try {
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided');
    }

    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex((part) => part === 'upload');

    if (uploadIndex === -1) {
      throw new Error('Invalid Cloudinary URL format');
    }

    const publicIdWithExt = urlParts.slice(uploadIndex + 2).join('/');
    const publicId = publicIdWithExt.substring(
      0,
      publicIdWithExt.lastIndexOf('.')
    );

    return publicId || null;
  } catch (error) {
    console.error('URL parsing error:', error.message);
    return null;
  }
};

/**
 * Get file info from Cloudinary
 */
const getFileInfo = async (publicId, resourceType = 'raw') => {
  try {
    return await cloudinary.api.resource(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error('Get file info error:', error.message);
    throw new Error(`Failed to get file info: ${error.message}`);
  }
};

/**
 * Export helpers
 */
export const cloudinaryConfig = {
  getFileInfo,
  uploadFileToCloudinary,
  getPublicIdFromUrl,
  deleteMultipleFiles,
  deleteFileFromCloudinary,
  uploadMultipleFiles,
};
