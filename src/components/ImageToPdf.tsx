import React, { useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';

interface ImageToPdfProps {
  minSizeKB?: number;
  maxSizeKB?: number;
}

const ImageToPdf: React.FC<ImageToPdfProps> = ({ minSizeKB = 10, maxSizeKB = 1024 }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setOutputUrl(null);
    setOutputSize(null);
    setInfo(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const pdfDoc = await PDFDocument.create();
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) {
          setError('Please select only image files.');
          return;
        }
        const imgBytes = await file.arrayBuffer();
        let img;
        if (file.type === 'image/png') {
          img = await pdfDoc.embedPng(imgBytes);
        } else {
          img = await pdfDoc.embedJpg(imgBytes);
        }
        const page = pdfDoc.addPage([img.width, img.height]);
        page.drawImage(img, {
          x: 0,
          y: 0,
          width: img.width,
          height: img.height,
        });
      }
      let pdfBytes = await pdfDoc.save();
      let blob = new Blob([pdfBytes], { type: 'application/pdf' });
      let lastBlob: Blob | null = null;
      // Try compressing if too large
      for (let i = 0; i < 5; i++) {
        if (blob.size / 1024 <= maxSizeKB && blob.size / 1024 >= minSizeKB) break;
        if (blob.size / 1024 < maxSizeKB) lastBlob = blob;
        // Re-embed and re-save for further compression (lossy)
        const reloadDoc = await PDFDocument.load(await blob.arrayBuffer());
        pdfBytes = await reloadDoc.save();
        blob = new Blob([pdfBytes], { type: 'application/pdf' });
      }
      if (blob.size / 1024 > maxSizeKB && lastBlob) {
        blob = lastBlob;
      }
      if (blob.size / 1024 > maxSizeKB) {
        setError('Could not compress PDF to required size. Try smaller images.');
        return;
      }
      setOutputUrl(URL.createObjectURL(blob));
      setOutputSize(blob.size);
      setInfo(`PDF size: ${(blob.size / 1024).toFixed(1)} KB`);
    } catch (err) {
      setError('Image to PDF conversion failed.');
      console.error('Image to PDF error:', err);
    }
  };

  return (
    <div style={{ margin: '2rem 0' }}>
      <h3>Image to PDF Converter</h3>
      <input
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
      />
      {outputUrl && (
        <div style={{ marginTop: '1rem' }}>
          <a href={outputUrl} download="converted.pdf">Download PDF</a>
          <div>{info}</div>
        </div>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default ImageToPdf;
