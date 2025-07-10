// Type definitions for exam requirements
export interface ExamDocument {
  name: string;
  required: boolean;
  formats: string[];
  sizeLimitMB?: number;
  resolution?: string;
  sizeMinKB?: number;
  sizeMaxKB?: number;
  dimensions?: string;
  otherRequirements?: string;
  acceptedProofs?: string[];
  for?: string;
}

export interface Exam {
  examName: string;
  documents: ExamDocument[];
}
