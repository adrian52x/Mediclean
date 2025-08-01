'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { X, GripVertical, Upload } from 'lucide-react';
import Image from 'next/image';

interface ImageFile extends File {
  preview: string;
}

interface ImageUploadWithPreviewProps {
  onImagesChange: (files: File[]) => void;
  maxImages?: number;
  resetTrigger?: File[]; // Add prop to trigger reset
}

export const ImageUploadWithPreview: React.FC<ImageUploadWithPreviewProps> = ({
  onImagesChange,
  maxImages = 3,
  resetTrigger
}) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Reset images when resetTrigger changes (parent resets the files)
  useEffect(() => {
    if (resetTrigger && resetTrigger.length === 0 && images.length > 0) {
      // Clean up object URLs before resetting
      images.forEach(image => {
        URL.revokeObjectURL(image.preview);
      });
      setImages([]);
    }
  }, [resetTrigger, images]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (images.length + files.length > maxImages) {
      alert(`You can upload a maximum of ${maxImages} images.`);
      return;
    }

    const validFiles: ImageFile[] = [];
    
    files.forEach(file => {
      const imageFile = file as ImageFile;
      imageFile.preview = URL.createObjectURL(file);
      validFiles.push(imageFile);
    });

    const updatedImages = [...images, ...validFiles];
    setImages(updatedImages);
    onImagesChange(updatedImages);
  }, [images, maxImages, onImagesChange]);

  const removeImage = useCallback((indexToRemove: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages);
    onImagesChange(updatedImages);
    
    // Clean up object URL
    URL.revokeObjectURL(images[indexToRemove].preview);
  }, [images, onImagesChange]);

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    
    // Remove dragged item
    newImages.splice(draggedIndex, 1);
    // Insert at new position
    newImages.splice(index, 0, draggedImage);
    
    setImages(newImages);
    onImagesChange(newImages);
    setDraggedIndex(index);
  }, [draggedIndex, images, onImagesChange]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  return (
    <div className="space-y-2">
      <Label htmlFor="images">
        Images | max {maxImages}
        {images.length > 0 && (
          <span className="text-sm text-muted-foreground ml-2">
            (Drag to reorder • First image will be primary)
          </span>
        )}
      </Label>
      
      {/* File Input */}
      <div className="relative">
        <input
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={images.length >= maxImages}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('images')?.click()}
          disabled={images.length >= maxImages}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {images.length === 0 ? 'Select Images' : `Add More (${images.length}/${maxImages})`}
        </Button>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 mt-4">
          {images.map((image, index) => (
            <div
              key={image.preview}
              className={`relative h-30 w-30 border-2 rounded-lg overflow-hidden cursor-move ${
                index === 0 ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
              }`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              {index === 0 && (
                <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded z-10">
                  PRIMARY
                </div>
              )}
              
              <div className="absolute top-1 right-1 z-10 flex gap-1">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="absolute bottom-1 left-1 z-10">
                <GripVertical className="h-4 w-4 text-white opacity-75" />
              </div>
              
              <div className="aspect-square relative">
                <Image
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
