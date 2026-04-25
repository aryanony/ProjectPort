-- ProjectPort Database Schema - FIXED VERSION
-- Run this in MySQL to create all tables

-- Drop existing database if needed (CAREFUL: This deletes all data!)
-- DROP DATABASE IF EXISTS projectport;

CREATE DATABASE IF NOT EXISTS projectport CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE projectport;

-- ============= 1. USERS TABLE (Admin & Client users) =============
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(255),
  role ENUM('admin', 'client') DEFAULT 'client',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============= 2. LEADS TABLE (Pre-client project inquiries) =============
DROP TABLE IF EXISTS leads;
CREATE TABLE leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_name VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  company VARCHAR(255),
  type_key VARCHAR(50),
  type_label VARCHAR(100),
  tech_stack VARCHAR(255),
  description TEXT,
  budget DECIMAL(12,2),
  estimate_json JSON,
  modules JSON,
  addons JSON,
  resources JSON,
  hosting VARCHAR(50),
  cms VARCHAR(50),
  estimated_weeks INT,
  status ENUM('new', 'contacted', 'converted', 'rejected') DEFAULT 'new',
  converted_user_id INT NULL,
  converted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (converted_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============= 3. PROJECTS TABLE (Main project data) =============
DROP TABLE IF EXISTS projects;
CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_name VARCHAR(255) NOT NULL,
  client_id INT NOT NULL,
  type_key VARCHAR(50),
  type_label VARCHAR(100),
  tech_stack VARCHAR(255),
  description TEXT,
  budget DECIMAL(12,2),
  estimate_final DECIMAL(12,2),
  estimate_json JSON,
  modules JSON,
  addons JSON,
  resources JSON,
  hosting VARCHAR(50),
  cms VARCHAR(50),
  estimated_weeks INT,
  status ENUM('pending', 'approved', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_client (client_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============= 4. PROJECT_ASSIGNMENTS TABLE (Assign team members) =============
DROP TABLE IF EXISTS project_assignments;
CREATE TABLE project_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  admin_id INT NOT NULL,
  role VARCHAR(100),
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_project (project_id),
  INDEX idx_admin (admin_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============= 5. PROJECT_UPDATES TABLE (Status updates) =============
DROP TABLE IF EXISTS project_updates;
CREATE TABLE project_updates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  updated_by INT NOT NULL,
  update_type ENUM('status', 'milestone', 'note', 'file') DEFAULT 'note',
  title VARCHAR(255),
  message TEXT,
  old_status VARCHAR(50),
  new_status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============= 6. MILESTONES TABLE (Project milestones) =============
DROP TABLE IF EXISTS milestones;
CREATE TABLE milestones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
  percentage INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  INDEX idx_project (project_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============= 7. PAYMENTS TABLE (Payment tracking) =============
DROP TABLE IF EXISTS payments;
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  payment_type ENUM('advance', 'milestone', 'final') DEFAULT 'milestone',
  status ENUM('pending', 'paid', 'overdue') DEFAULT 'pending',
  due_date DATE,
  paid_at TIMESTAMP NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  INDEX idx_project (project_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============= 8. QUOTATIONS TABLE (Generated quotes) =============
DROP TABLE IF EXISTS quotations;
CREATE TABLE quotations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT,
  client_id INT NOT NULL,
  quote_number VARCHAR(50) UNIQUE,
  total_amount DECIMAL(12,2) NOT NULL,
  breakdown JSON,
  valid_until DATE,
  status ENUM('draft', 'sent', 'accepted', 'rejected') DEFAULT 'draft',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_client (client_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============= 9. NOTIFICATIONS TABLE (System notifications) =============
DROP TABLE IF EXISTS notifications;
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  link VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============= INSERT DEFAULT USERS =============

-- Insert default ADMIN user
-- Email: admin@projectport.com
-- Password: admin123
-- Hash generated with: bcrypt.hashSync('admin123', 10)
INSERT INTO users (email, password, full_name, phone, role) VALUES
('admin@projectport.com', '$2b$10$H2OGi5T7IwHniXuEnkEqS.Ng0o6Q8tm4kgQX1nQxEVCkAWc8p9nUS', 'Aryan Gupta', '6205650368', 'admin')
ON DUPLICATE KEY UPDATE 
  password = '$2b$10$H2OGi5T7IwHniXuEnkEqS.Ng0o6Q8tm4kgQX1nQxEVCkAWc8p9nUS',
  full_name = 'Aryan Gupta',
  phone = '6205650368';

-- Insert demo CLIENT user
-- Email: client@gmail.com
-- Password: client123
-- Hash generated with: bcrypt.hashSync('client123', 10)
INSERT INTO users (email, password, full_name, phone, company, role) VALUES
('client@gmail.com', '$2b$10$X8kpILndM90HS2niE1wqXubSePPfcZ46SQ4quAAlrv829OQygCIru', 'Client Demo', '9876543211', 'Tech Corp', 'client')
ON DUPLICATE KEY UPDATE 
  password = '$2b$10$X8kpILndM90HS2niE1wqXubSePPfcZ46SQ4quAAlrv829OQygCIru',
  full_name = 'Client Demo',
  phone = '9876543211',
  company = 'Tech Corp';

-- ============= VERIFICATION QUERIES =============

-- Verify admin user
SELECT 'Admin User:' as info, id, email, full_name, role FROM users WHERE email = 'admin@projectport.com';

-- Verify demo client
SELECT 'Demo Client:' as info, id, email, full_name, role FROM users WHERE email = 'client@gmail.com';

-- Show all tables
SELECT 'All Tables Created:' as info;
SHOW TABLES;

-- Show table structure
SELECT 'Projects Table Structure:' as info;
DESCRIBE projects;

-- ============= USEFUL QUERIES FOR DEBUGGING =============

-- Check all users
-- SELECT * FROM users;

-- Check all leads
-- SELECT * FROM leads ORDER BY created_at DESC;

-- Check all projects
-- SELECT * FROM projects ORDER BY created_at DESC;

-- Check lead conversion status
-- SELECT l.id, l.project_name, l.email, l.status, l.converted_user_id, u.full_name as converted_client
-- FROM leads l
-- LEFT JOIN users u ON l.converted_user_id = u.id
-- ORDER BY l.created_at DESC;

-- ============= PASSWORD RESET (if needed) =============

-- To reset admin password to 'admin123':
-- UPDATE users SET password = '$2b$10$H2OGi5T7IwHniXuEnkEqS.Ng0o6Q8tm4kgQX1nQxEVCkAWc8p9nUS' WHERE email = 'admin@projectport.com';

-- To reset client password to 'client123':
-- UPDATE users SET password = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL2lQ4S2' WHERE email = 'client@gmail.com';

-- ============= DATABASE SUMMARY =============
SELECT 
  'Database Setup Complete!' as status,
  DATABASE() as current_database,
  (SELECT COUNT(*) FROM users WHERE role = 'admin') as admin_count,
  (SELECT COUNT(*) FROM users WHERE role = 'client') as client_count,
  (SELECT COUNT(*) FROM leads) as leads_count,
  (SELECT COUNT(*) FROM projects) as projects_count;
  
  SET FOREIGN_KEY_CHECKS = 1; 