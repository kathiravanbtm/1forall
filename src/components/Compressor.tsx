import React, { useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';

interface CompressorProps {
  minSizeKB: number;
  maxSizeKB: number;
}

const Compressor: React.FC<CompressorProps> = ({ minSizeKB, maxSizeKB }) => {
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
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file.');
      return;
    }
    try {
      const arrayBuffer = await file.arrayBuffer();
      let pdfDoc = await PDFDocument.load(arrayBuffer);
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('');
      pdfDoc.setCreator('');
      try {
        pdfDoc.setCreationDate(new Date());
        pdfDoc.setModificationDate(new Date());
      } catch (e) {}
      let compressedPdfBytes = await pdfDoc.save({ useObjectStreams: true });
      let blob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
      let quality = 0.92;
      let lastBlob: Blob | null = null;
      let lastBytes = compressedPdfBytes;
      // Try to compress further by reloading and resaving (lossy, but can help)
      for (let i = 0; i < 5; i++) {
        if (blob.size / 1024 <= maxSizeKB && blob.size / 1024 >= minSizeKB) break;
        if (blob.size / 1024 < maxSizeKB) {
          lastBlob = blob;
          lastBytes = compressedPdfBytes;
        }
        pdfDoc = await PDFDocument.load(compressedPdfBytes);
        compressedPdfBytes = await pdfDoc.save({ useObjectStreams: true });
        blob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
      }
      if (blob.size / 1024 > maxSizeKB && lastBlob) {
        blob = lastBlob;
        compressedPdfBytes = lastBytes;
      }
      if (blob.size / 1024 > maxSizeKB) {
        setError('Could not compress PDF to required size. Try a different file.');
        return;
      }
      setOutputUrl(URL.createObjectURL(blob));
      setOutputSize(blob.size);
      setInfo(`Compressed size: ${(blob.size / 1024).toFixed(1)} KB`);
    } catch (err) {
      setError('PDF compression failed.');
      console.error('PDF compression error:', err);
    }
  };

  return (
    <div style={{ margin: '2rem 0' }}>
      <h3>PDF Compressor</h3>
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      {outputUrl && (
        <div style={{ marginTop: '1rem' }}>
          <a href={outputUrl} download="compressed.pdf">Download Compressed PDF</a>
          <div>{info}</div>
        </div>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default Compressor;
