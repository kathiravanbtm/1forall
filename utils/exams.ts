export interface Document {
  id: string;
  name: string;
  size: string;
  format: string;
  maxFileSize: number;
}

export interface Exam {
  id: string;
  title: string;
  icon: string;
  description: string;
  documents: Document[];
}

export function getExamById(examId: string): Exam | null {
  const examsData = require('@/assets/data/exams.json');
  return examsData.find((exam: Exam) => exam.id === examId) || null;
}

export function getAllExams(): Exam[] {
  return require('@/assets/data/exams.json');
}
