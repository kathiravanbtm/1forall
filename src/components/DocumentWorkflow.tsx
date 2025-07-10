// Dynamically renders the workflow for a selected document based on its requirements
import React, { useState } from 'react';
import { ExamDocument } from '../types/exam';
import ImageEditor from './ImageEditor';
import ImageConverter from './ImageConverter';
import Compressor from './Compressor';
import ImageToPdf from './ImageToPdf';
import PdfToImage from './PdfToImage';

interface DocumentWorkflowProps {
  document: ExamDocument;
}

const DocumentWorkflow: React.FC<DocumentWorkflowProps> = ({ document }) => {
  // Step state for multi-step flows (future-proofing)
  const [step, setStep] = useState(0);

  // Determine what tools are needed based on document requirements
  const isImage = document.formats.some(f => ['JPEG', 'JPG', 'PNG'].includes(f.toUpperCase()));
  const isPDF = document.formats.some(f => f.toUpperCase() === 'PDF');

  // Render tools in sequence based on requirements
  const showImageToPdf = isImage && isPDF;
  const showImageEditor = isImage && !isPDF;
  const showPdfCompressor = isPDF;

  return (
    <div style={{ margin: '2rem 0', border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
      <h3>Prepare: {document.name}</h3>
      <div style={{ marginBottom: 8 }}>
        <b>Required Format(s):</b> {document.formats.join(', ')}<br />
        {document.sizeMinKB && document.sizeMaxKB && (
          <span><b>Size:</b> {document.sizeMinKB} KB to {document.sizeMaxKB} KB<br /></span>
        )}
        {document.sizeLimitMB && (
          <span><b>Size Limit:</b> {document.sizeLimitMB} MB<br /></span>
        )}
        {document.dimensions && <span><b>Dimensions:</b> {document.dimensions}<br /></span>}
        {document.resolution && <span><b>Resolution:</b> {document.resolution}<br /></span>}
        {document.otherRequirements && <span><b>Other:</b> {document.otherRequirements}<br /></span>}
      </div>
      {/* Image to PDF workflow (with compression) */}
      {showImageToPdf && (
        <ImageToPdf minSizeKB={document.sizeMinKB} maxSizeKB={document.sizeMaxKB} />
      )}
      {/* Image workflow only */}
      {showImageEditor && (
        <ImageEditor
          label={`Edit/Crop/Compress (${document.name})`}
          formats={document.formats}
          minSizeKB={document.sizeMinKB || 1}
          maxSizeKB={document.sizeMaxKB || 1024}
          minWidth={140}
          minHeight={60}
          maxWidth={1000}
          maxHeight={1000}
        />
      )}
      {/* PDF compressor always shown if PDF is allowed */}
      {showPdfCompressor && (
        <Compressor minSizeKB={document.sizeMinKB || 10} maxSizeKB={document.sizeMaxKB || 1024} />
      )}
      {/* Optionally allow PDF-to-image if image is also allowed */}
      {isPDF && isImage && <PdfToImage />}
    </div>
  );
};

export default DocumentWorkflow;
