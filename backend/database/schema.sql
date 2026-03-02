-- 1forall Database Schema for Supabase/PostgreSQL
-- This file contains the schema to migrate from JSON to PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Exams Table
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  icon VARCHAR(10),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents Table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id VARCHAR(50) NOT NULL,
  exam_id VARCHAR(50) NOT NULL REFERENCES exams(exam_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  size VARCHAR(20),
  format VARCHAR(100),
  max_size BIGINT,
  required BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversion Requests Table
CREATE TABLE conversion_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversion_id VARCHAR(50) UNIQUE NOT NULL,
  user_id VARCHAR(100) NOT NULL,
  exam_id VARCHAR(50) NOT NULL REFERENCES exams(exam_id) ON DELETE SET NULL,
  document_id VARCHAR(50),
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL,
  input_path VARCHAR(500),
  output_path VARCHAR(500),
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
  error_msg TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes for better query performance
  CONSTRAINT status_check CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
);

-- Tools Table
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id VARCHAR(50) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL,
  category_icon VARCHAR(10),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logo VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table (for future authentication)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Conversion History Table
CREATE TABLE user_conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(100) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  conversion_id VARCHAR(50) NOT NULL REFERENCES conversion_requests(conversion_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for better query performance
CREATE INDEX idx_conversion_requests_user_id ON conversion_requests(user_id);
CREATE INDEX idx_conversion_requests_exam_id ON conversion_requests(exam_id);
CREATE INDEX idx_conversion_requests_status ON conversion_requests(status);
CREATE INDEX idx_conversion_requests_created_at ON conversion_requests(created_at DESC);
CREATE INDEX idx_documents_exam_id ON documents(exam_id);
CREATE INDEX idx_tools_category ON tools(category);
CREATE INDEX idx_user_conversions_user_id ON user_conversions(user_id);
CREATE INDEX idx_user_conversions_conversion_id ON user_conversions(conversion_id);

-- Create Views for common queries
CREATE VIEW user_conversion_history AS
SELECT 
  cr.conversion_id,
  cr.user_id,
  cr.exam_id,
  cr.document_id,
  cr.file_name,
  cr.file_size,
  cr.status,
  cr.created_at,
  cr.updated_at,
  e.title as exam_title
FROM conversion_requests cr
LEFT JOIN exams e ON cr.exam_id = e.exam_id;

-- Row Level Security (if needed)
ALTER TABLE conversion_requests ENABLE ROW LEVEL SECURITY;

-- Policies for RLS (example - users can only see their own conversions)
-- CREATE POLICY conversion_user_policy ON conversion_requests
-- FOR SELECT USING (user_id = current_user_id());

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON exams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversion_requests_updated_at BEFORE UPDATE ON conversion_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON tools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
INSERT INTO exams (exam_id, title, icon, description) VALUES
('jee-main', 'JEE Main', '📚', 'Joint Entrance Examination for engineering colleges'),
('neet', 'NEET', '🔬', 'National Eligibility cum Entrance Test for medical'),
('gate', 'GATE', '🎓', 'Graduate Aptitude Test in Engineering'),
('upsc', 'UPSC', '🏛️', 'Union Public Service Commission Examination'),
('cat', 'CAT', '📊', 'Common Admission Test for MBA'),
('clat', 'CLAT', '⚖️', 'Common Law Admission Test'),
('ias', 'IAS', '🎖️', 'Indian Administrative Service'),
('jee-advanced', 'JEE Advanced', '🚀', 'Advanced Engineering Entrance Exam');

-- Grant permissions (example for public schema)
GRANT SELECT ON exams, documents, tools TO anon;
GRANT SELECT, INSERT ON conversion_requests TO authenticated;
