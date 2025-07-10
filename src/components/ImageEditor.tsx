import React, { useRef, useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

interface SignatureConverterProps {
  label: string;
  formats: string[];
  minSizeKB: number;
  maxSizeKB: number;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
}

const SignatureConverter: React.FC<SignatureConverterProps> = ({
  label,
  formats,
  minSizeKB,
  maxSizeKB,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputType, setOutputType] = useState<string>(formats[0]);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [showCrop, setShowCrop] = useState<boolean>(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setOutputUrl(null);
    setInfo(null);
    setShowCrop(false);
    setImageToCrop(null);
    setCroppedImageUrl(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    const img = new window.Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > maxWidth || height > maxHeight) {
        setShowCrop(true);
        setImageToCrop(URL.createObjectURL(file));
        return;
      }
      processImage(img, width, height);
    };
    img.onerror = () => setError('Failed to load image.');
    img.src = URL.createObjectURL(file);
  };

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropDone = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;
    const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels, outputType);
    if (!croppedImage) {
      setError('Cropping failed.');
      return;
    }
    setCroppedImageUrl(croppedImage);
    setShowCrop(false);
    setImageToCrop(null);
    setError(null);
    // After cropping, process and compress
    const img = new window.Image();
    img.onload = () => {
      processImage(img, img.width, img.height);
    };
    img.src = croppedImage;
  };

  // Utility to crop image using canvas
  async function getCroppedImg(imageSrc: string, crop: any, type: string): Promise<string | null> {
    return new Promise((resolve) => {
      const image = new window.Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);
        ctx.drawImage(
          image,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          crop.width,
          crop.height
        );
        resolve(canvas.toDataURL(type));
      };
      image.src = imageSrc;
    });
  }

  // This function can be called after cropping as well
  const processImage = (img: HTMLImageElement, width: number, height: number) => {
    width = Math.max(minWidth, Math.min(width, maxWidth));
    height = Math.max(minHeight, Math.min(height, maxHeight));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError('Canvas not supported.');
      return;
    }
    ctx.drawImage(img, 0, 0, width, height);
    let quality = 0.92;
    let blob: Blob | null = null;
    let url = '';
    let lastBlob: Blob | null = null;
    let lastUrl = '';
    // Fix: Use correct MIME type for JPG/JPEG
    let mimeType = outputType;
    if (outputType === 'image/jpg') mimeType = 'image/jpeg';
    for (let i = 0; i < 15; i++) {
      url = canvas.toDataURL(mimeType, quality);
      const b = dataURLtoBlob(url);
      if (b.size / 1024 <= maxSizeKB && b.size / 1024 >= minSizeKB) {
        blob = b;
        break;
      }
      if (b.size / 1024 < maxSizeKB) {
        lastBlob = b;
        lastUrl = url;
      }
      quality -= 0.06;
      if (quality < 0.1) break;
    }
    if (!blob && lastBlob) {
      blob = lastBlob;
      url = lastUrl;
    }
    if (!blob) {
      setError('Could not compress image to required size. Try a different image.');
      return;
    }
    setOutputUrl(url); // Use the base64 data for download and preview
    setInfo(`Output size: ${(blob.size / 1024).toFixed(1)} KB, Dimensions: ${width}x${height}, Format: ${mimeType}`);
  };

  function dataURLtoBlob(dataurl: string) {
    const arr = dataurl.split(','),
      mimeMatch = arr[0].match(/:(.*?);/),
      mime = mimeMatch ? mimeMatch[1] : '',
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) u8arr[i] = bstr.charCodeAt(i);
    return new Blob([u8arr], { type: mime });
  }

  return (
    <div style={{ margin: '2rem 0' }}>
      <h3>{label}</h3>
      <input
        type="file"
        accept={formats.map(f => `image/${f.toLowerCase()}`).join(',')}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <select
        value={outputType}
        onChange={e => setOutputType(e.target.value)}
        style={{ marginLeft: '1rem' }}
      >
        {formats.map(f => (
          <option key={f} value={`image/${f.toLowerCase()}`}>{f}</option>
        ))}
      </select>
      {showCrop && imageToCrop && (
        <div style={{ color: 'orange', marginTop: 8 }}>
          <b>Crop your image to the required dimensions:</b>
          <div style={{ position: 'relative', width: 350, height: 200, background: '#222' }}>
            <Cropper
              image={imageToCrop}
              crop={crop}
              zoom={zoom}
              aspect={maxWidth / maxHeight}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              cropShape="rect"
              showGrid={true}
              restrictPosition={false}
              // The crop box is resizable and movable by default in react-easy-crop
            />
          </div>
          <button onClick={handleCropDone} style={{ marginTop: 8 }}>Done Cropping</button>
        </div>
      )}
      {outputUrl && (
        <div style={{ marginTop: '1rem' }}>
          <a href={outputUrl} download={`signature.${outputType.split('/')[1]}`}>Download Signature</a>
          <div><img src={outputUrl} alt="Signature" style={{ maxWidth: 300, marginTop: 8 }} /></div>
        </div>
      )}
      {info && <div style={{ color: 'green' }}>{info}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default SignatureConverter;
