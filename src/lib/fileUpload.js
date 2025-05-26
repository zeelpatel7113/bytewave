import { useState } from 'react';
import { getCurrentDateTime, getCurrentUser } from '@/lib/utils';

/**
 * Validates the file type and size
 */
function isValidFile(file) {
  const validTypes = {
    'image/jpeg': '.jpg,.jpeg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'application/pdf': '.pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx'
  };

  const maxSize = 2 * 1024 * 1024; // 2MB in bytes

  if (!Object.keys(validTypes).includes(file.type)) {
    throw new Error('Please upload a valid file (PDF, DOCX, JPG, PNG, WebP, or JPEG)');
  }

  if (file.size > maxSize) {
    throw new Error('File size should be less than 2MB');
  }

  return true;
}

/**
 * Formats file size in readable format
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Gets file type icon based on mime type
 */
function getFileTypeIcon(fileType) {
  if (fileType === 'application/pdf' || 
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return 'file-text';
  }
  
  if (fileType?.startsWith('image/')) {
    return 'image';
  }
  
  return 'file';
}

/**
 * Creates a file preview URL
 */
function createFilePreview(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    } else {
      resolve(null);
    }
  });
}

/**
 * Custom hook for handling file uploads
 */
function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (file) => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      // Validate file before upload
      if (!file || !isValidFile(file)) {
        throw new Error('Invalid file');
      }

      // Add upload metadata
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', process.env.NEXT_PUBLIC_CDN_BUCKET);
      formData.append('uploadedBy', getCurrentUser());
      formData.append('uploadedAt', getCurrentDateTime());

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload file
      const response = await fetch('https://cdn-uploads.vrugle.com/upload', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_CDN_API_KEY,
          'x-api-secret': process.env.NEXT_PUBLIC_CDN_API_SECRET,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload file');
      }

      const data = await response.json();

      // Complete progress
      clearInterval(progressInterval);
      setProgress(100);

      return data.url;
    } catch (err) {
      setError(err.message);
      setProgress(0);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const resetState = () => {
    setUploading(false);
    setError(null);
    setProgress(0);
  };

  return {
    handleUpload,
    uploading,
    error,
    progress,
    resetState
  };
}

/**
 * Configuration object for file upload
 */
const fileUploadConfig = {
  maxSize: 2 * 1024 * 1024, // 2MB
  acceptedFiles: {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/jpg': ['.jpg'],
    'image/png': ['.png'],
    'image/webp': ['.webp']
  },
  acceptedFileTypes: '.pdf,.docx,.jpg,.jpeg,.png,.webp'
};

/**
 * Error messages for file upload
 */
const uploadErrorMessages = {
  invalidType: 'Please upload a valid file (PDF, DOCX, JPG, PNG, WebP, or JPEG)',
  tooLarge: 'File size should be less than 2MB',
  uploadFailed: 'Failed to upload file. Please try again.',
  networkError: 'Network error. Please check your connection and try again.',
};

// Single export statement for all functions and constants
export {
  isValidFile,
  formatFileSize,
  getFileTypeIcon,
  createFilePreview,
  useFileUpload,
  fileUploadConfig,
  uploadErrorMessages
}