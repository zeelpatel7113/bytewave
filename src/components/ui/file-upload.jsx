"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  X, 
  FileText, 
  Image as ImageIcon,
  File,
  Loader2
} from "lucide-react";
import { getFileTypeIcon, formatFileSize } from "@/lib/fileUpload";

export function FileUpload({ 
  value, 
  onChange, 
  disabled = false, 
  onRemove,
  uploading = false,
  accept = ".pdf,.docx,.jpg,.jpeg,.png,.webp",
  previewHeight = "h-[200px]" // Default height if not specified
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(value);
  const [fileType, setFileType] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFileSize, setSelectedFileSize] = useState(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const createPreview = async (file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    }
    return null;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (2MB = 2 * 1024 * 1024 bytes)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size should be less than 2MB');
        return;
      }

      setFileType(file.type);
      setSelectedFileName(file.name);
      setSelectedFileSize(file.size);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const previewUrl = await createPreview(file);
        setPreview(previewUrl);
      } else {
        setPreview(null);
      }
      
      // Trigger onChange
      onChange?.(file);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(null);
    setFileType(null);
    setSelectedFileName("");
    setSelectedFileSize(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onRemove?.();
  };

  const FileTypeIcon = () => {
    const iconName = getFileTypeIcon(fileType);
    switch (iconName) {
      case 'file-text':
        return <FileText className="h-8 w-8" />;
      case 'image':
        return <ImageIcon className="h-8 w-8" />;
      default:
        return <File className="h-8 w-8" />;
    }
  };

  // Handle existing value
  const handleExistingValue = () => {
    if (value && !preview && !fileType) {
      // Check if it's an image URL
      const isImage = /\.(jpg|jpeg|png|webp)$/i.test(value);
      if (isImage) {
        setFileType('image/jpeg'); // Default to jpeg for existing images
        setPreview(value);
      } else {
        // For other file types
        const extension = value.split('.').pop()?.toLowerCase();
        switch (extension) {
          case 'pdf':
            setFileType('application/pdf');
            break;
          case 'docx':
            setFileType('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            break;
          default:
            setFileType(null);
        }
      }
    }
  };

  // Call handleExistingValue when value changes
  useEffect(() => {
    handleExistingValue();
  }, [value]);

  return (
    <div className="w-full mt-4 mb-4">
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled || uploading}
      />

      {(preview || fileType) ? (
        <div className={`relative w-full ${previewHeight} rounded-lg overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50`}>
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4">
              <FileTypeIcon />
              <span className="mt-2 text-sm text-gray-600 text-center">
                {selectedFileName || "File uploaded"}
              </span>
              {selectedFileSize && (
                <span className="text-xs text-gray-500 mt-1">
                  {formatFileSize(selectedFileSize)}
                </span>
              )}
            </div>
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
            disabled={disabled || uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className={`w-full ${previewHeight} flex flex-col items-center justify-center gap-2 border-2 border-dashed`}
          onClick={handleClick}
          disabled={disabled || uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8" />
              <span>Click to upload file</span>
              <span className="text-xs text-muted-foreground">
                PDF, DOCX, JPG, PNG, WebP or JPEG (max. 2MB)
              </span>
            </>
          )}
        </Button>
      )}
    </div>
  );
}