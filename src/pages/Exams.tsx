import React, { useEffect, useState } from 'react';
import ExamRequirement from '../components/ExamRequirement';
import DocumentWorkflow from '../components/DocumentWorkflow';
import { Exam, ExamDocument } from '../types/exam';

const Exams = () => {
  const [examList] = useState([
    { name: 'NEET UG', file: 'neet.json' },
    { name: 'JEE Main', file: 'jee.json' },
    { name: 'UPSC CSE', file: 'upsc.json' },
  ]);
  const [search, setSearch] = useState('');
  const [selectedExam, setSelectedExam] = useState(examList[0]);
  const [examData, setExamData] = useState<Exam | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<ExamDocument | null>(null);

  useEffect(() => {
    fetch(`src/exams/${selectedExam.file}`)
      .then((res) => res.json())
      .then(setExamData);
    setSelectedDoc(null);
  }, [selectedExam]);

  const filteredExams = examList.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container">
      <h2>Exam Document Requirements</h2>
      <div style={{ marginBottom: 24 }}>
        <b>Select Exam:</b>
        <input
          type="text"
          placeholder="Search exams..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginLeft: 12, padding: '0.4rem 0.8rem', borderRadius: 6, border: '1px solid #bbb', minWidth: 180 }}
        />
        <div className="card-carousel" style={{ marginTop: 8 }}>
          {filteredExams.length === 0 && <div style={{ color: '#888', padding: 16 }}>No exams found.</div>}
          {filteredExams.map((exam) => (
            <div
              key={exam.file}
              className={`carousel-card${selectedExam.file === exam.file ? ' selected' : ''}`}
              onClick={() => setSelectedExam(exam)}
            >
              <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{exam.name}</div>
            </div>
          ))}
        </div>
      </div>
      {examData ? (
        <>
          <ExamRequirement exam={examData} />
          <div style={{ margin: '2rem 0' }}>
            <b>Select a document to prepare:</b>
            <div className="card-carousel">
              {examData.documents.map((doc, idx) => (
                <div
                  key={doc.name}
                  className={`carousel-card${selectedDoc?.name === doc.name ? ' selected' : ''}`}
                  onClick={() => setSelectedDoc(doc)}
                >
                  <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 6 }}>{doc.name}</div>
                  <div style={{ fontSize: '0.95rem', color: '#444' }}>Format: {doc.formats.join(', ')}</div>
                  {doc.sizeMinKB && doc.sizeMaxKB && (
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Size: {doc.sizeMinKB}-{doc.sizeMaxKB} KB</div>
                  )}
                  {doc.sizeLimitMB && (
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Max: {doc.sizeLimitMB} MB</div>
                  )}
                  {doc.dimensions && (
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Dim: {doc.dimensions}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {selectedDoc && <DocumentWorkflow document={selectedDoc} />}
        </>
      ) : <p>Loading...</p>}
    </div>
  );
};

export default Exams;
