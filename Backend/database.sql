CREATE DATABASE IF NOT EXISTS scholarship_checker;
USE scholarship_checker;

CREATE TABLE IF NOT EXISTS scholarships (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  provider_type VARCHAR(100) NOT NULL DEFAULT 'Government',
  category VARCHAR(50) NOT NULL,
  course_type VARCHAR(100) NOT NULL DEFAULT 'Any',
  max_income DECIMAL(12, 2) NOT NULL,
  min_percentage DECIMAL(5, 2) NOT NULL,
  description TEXT,
  website VARCHAR(2048)
);

INSERT INTO scholarships
  (name, provider_type, category, course_type, max_income, min_percentage, description, website)
SELECT * FROM (
  SELECT 'Demo Open Merit Scholarship', 'Government', 'Open', 'Any', 500000, 60,
         'Sample record for local development.', ''
  UNION ALL
  SELECT 'Demo OBC Education Scholarship', 'Government', 'OBC', 'Any', 400000, 55,
         'Sample record for local development.', ''
  UNION ALL
  SELECT 'Demo SC Engineering Scholarship', 'Government', 'SC', 'Engineering', 600000, 50,
         'Sample record for local development.', ''
  UNION ALL
  SELECT 'Demo ST Higher Education Scholarship', 'Government', 'ST', 'Any', 500000, 50,
         'Sample record for local development.', ''
) AS sample_data
WHERE NOT EXISTS (SELECT 1 FROM scholarships);