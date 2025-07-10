import React, { useRef, useState } from 'react';

const ImageConverter: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputType, setOutputType] = useState<'image/jpeg' | 'image/png' | 'image/jpg'>('image/png');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setOutputUrl(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('Canvas not supported.');
        return;
      }
      ctx.drawImage(img, 0, 0);
      const url = canvas.toDataURL(outputType);
      setOutputUrl(url);
    };
    img.onerror = () => setError('Failed to load image.');
    img.src = URL.createObjectURL(file);
  };

  return (
    <div style={{ margin: '2rem 0' }}>
      <h3>Image Format Converter</h3>
      <input
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <select
        value={outputType}
        onChange={e => setOutputType(e.target.value as any)}
        style={{ marginLeft: '1rem' }}
      >
        <option value="image/png">PNG</option>
        <option value="image/jpeg">JPEG</option>
        <option value="image/jpg">JPG</option>
      </select>
      {outputUrl && (
        <div style={{ marginTop: '1rem' }}>
          <a href={outputUrl} download={`converted.${outputType.split('/')[1]}`}>Download Converted Image</a>
          <div><img src={outputUrl} alt="Converted" style={{ maxWidth: 300, marginTop: 8 }} /></div>
        </div>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default ImageConverter;
