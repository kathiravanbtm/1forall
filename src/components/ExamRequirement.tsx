import React from 'react';
import { Exam } from '../types/exam';

interface ExamRequirementProps {
  exam: Exam;
}

const ExamRequirement: React.FC<ExamRequirementProps> = ({ exam }) => {
  return (
    <div>
      <h3>{exam.examName}</h3>
      <ul>
        {exam.documents.map((doc, idx) => (
          <li key={idx} style={{ marginBottom: '1rem' }}>
            <b>{doc.name}</b> <br />
            <span>Format: {doc.formats.join(', ')}</span><br />
            {doc.sizeMinKB && doc.sizeMaxKB && (
              <span>Size: {doc.sizeMinKB} KB to {doc.sizeMaxKB} KB</span>
            )}
            {doc.sizeLimitMB && (
              <span>Size Limit: {doc.sizeLimitMB} MB</span>
            )}
            {doc.dimensions && <><br /><span>Dimensions: {doc.dimensions}</span></>}
            {doc.resolution && <><br /><span>Resolution: {doc.resolution}</span></>}
            {doc.otherRequirements && <><br /><span>Other: {doc.otherRequirements}</span></>}
            {doc.acceptedProofs && <><br /><span>Accepted Proofs: {doc.acceptedProofs.join(', ')}</span></>}
            {doc.for && <><br /><span>For: {doc.for}</span></>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExamRequirement;
