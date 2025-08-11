import React, { useState, useRef, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, RotateCw, RotateCcw, ZoomIn, ZoomOut, Crop, Download, Check, X as CloseIcon } from 'lucide-react';

const ImageCropper = ({ 
  imageFile, 
  onCropComplete, 
  onCancel, 
  aspectRatio = 16/9, 
  minWidth = 200,
  quality = 0.95,
  maxWidth = 1920,
  maxHeight = 1080
}) => {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [imageSrc, setImageSrc] = useState('');
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  // Load image when component mounts
  React.useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget;
    
    // Calculate the best crop size that fits within the image and respects aspect ratio
    let cropWidth, cropHeight;
    
    if (width / height > aspectRatio) {
      // Image is wider than target aspect ratio
      cropHeight = Math.min(height * 0.8, maxHeight);
      cropWidth = cropHeight * aspectRatio;
    } else {
      // Image is taller than target aspect ratio
      cropWidth = Math.min(width * 0.8, maxWidth);
      cropHeight = cropWidth / aspectRatio;
    }
    
    const cropX = (width - cropWidth) / 2;
    const cropY = (height - cropHeight) / 2;

    setCrop({
      unit: 'px',
      width: cropWidth,
      height: cropHeight,
      x: cropX,
      y: cropY,
    });
  }, [aspectRatio, maxWidth, maxHeight]);

  const getCroppedImg = useCallback(() => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) {
      return null;
    }

    const image = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return null;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Calculate the actual crop dimensions
    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    // Set canvas size to the desired output size
    const outputWidth = Math.min(cropWidth, maxWidth);
    const outputHeight = Math.min(cropHeight, maxHeight);

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply rotation and scaling
    ctx.save();
    
    // Move to center of canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Apply scaling
    ctx.scale(scale, scale);
    
    // Draw the cropped image
    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      -outputWidth / (2 * scale),
      -outputHeight / (2 * scale),
      outputWidth / scale,
      outputHeight / scale
    );
    
    ctx.restore();

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Create a new file with the cropped image
            const croppedFile = new File([blob], imageFile.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(croppedFile);
          } else {
            resolve(null);
          }
        },
        'image/jpeg',
        quality
      );
    });
  }, [completedCrop, rotation, scale, aspectRatio, maxWidth, quality, imageFile]);

  const handleCropComplete = useCallback(async () => {
    const croppedFile = await getCroppedImg();
    if (croppedFile) {
      onCropComplete(croppedFile);
    }
  }, [getCroppedImg, onCropComplete]);

  const handleRotation = (direction) => {
    setRotation(prev => prev + (direction === 'clockwise' ? 90 : -90));
  };

  const handleZoom = (direction) => {
    setScale(prev => {
      const newScale = direction === 'in' ? prev * 1.1 : prev / 1.1;
      return Math.max(0.5, Math.min(3, newScale));
    });
  };

  const resetCrop = () => {
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      
      // Calculate the best crop size that fits within the image and respects aspect ratio
      let cropWidth, cropHeight;
      
      if (width / height > aspectRatio) {
        // Image is wider than target aspect ratio
        cropHeight = Math.min(height * 0.8, maxHeight);
        cropWidth = cropHeight * aspectRatio;
      } else {
        // Image is taller than target aspect ratio
        cropWidth = Math.min(width * 0.8, maxWidth);
        cropHeight = cropWidth / aspectRatio;
      }
      
      const cropX = (width - cropWidth) / 2;
      const cropY = (height - cropHeight) / 2;

      setCrop({
        unit: 'px',
        width: cropWidth,
        height: cropHeight,
        x: cropX,
        y: cropY,
      });
    }
  };

  if (!imageSrc) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading image...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Crop Image</h3>
            <p className="text-sm text-gray-600 mt-1">
              Drag to adjust crop area • Use controls below to rotate and zoom
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 p-4 bg-gray-50 border-b border-gray-200">
          <button
            onClick={() => handleRotation('counterclockwise')}
            className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            title="Rotate Left"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="text-sm">Rotate Left</span>
          </button>
          
          <button
            onClick={() => handleRotation('clockwise')}
            className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            title="Rotate Right"
          >
            <RotateCw className="h-4 w-4" />
            <span className="text-sm">Rotate Right</span>
          </button>
          
          <button
            onClick={() => handleZoom('out')}
            className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
            <span className="text-sm">Zoom Out</span>
          </button>
          
          <button
            onClick={() => handleZoom('in')}
            className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
            <span className="text-sm">Zoom In</span>
          </button>
          
          <button
            onClick={resetCrop}
            className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            title="Reset Crop"
          >
            <Crop className="h-4 w-4" />
            <span className="text-sm">Reset</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Scale: {Math.round(scale * 100)}%</span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-20"
            />
          </div>
        </div>

        {/* Image Cropper */}
        <div className="flex-1 overflow-auto p-4">
          <div className="flex justify-center">
            <div className="relative">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspectRatio}
                minWidth={minWidth}
                keepSelection
                className="max-w-full max-h-[60vh]"
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imageSrc}
                  style={{
                    transform: `scale(${scale}) rotate(${rotation}deg)`,
                    maxWidth: '100%',
                    maxHeight: '60vh',
                    objectFit: 'contain'
                  }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
              
              {/* Aspect Ratio Guide */}
              <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                Aspect Ratio: {aspectRatio === 1 ? '1:1 (Square)' : aspectRatio === 4/3 ? '4:3 (Landscape)' : aspectRatio === 16/9 ? '16:9 (Widescreen)' : `${aspectRatio}`}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            <p>• Drag to move the crop area</p>
            <p>• Resize by dragging the corners</p>
            <p>• Use controls above to rotate and zoom</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCropComplete}
              className="px-4 py-2 bg-yellow-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-yellow-700 transition-colors flex items-center space-x-2"
            >
              <Check className="h-4 w-4" />
              <span>Apply Crop</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Hidden canvas for processing */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageCropper; 