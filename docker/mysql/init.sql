-- AI Tools Management System Database Initialization

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS ai_tools CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant permissions to laravel user
GRANT ALL PRIVILEGES ON ai_tools.* TO 'laravel'@'%';

-- Create a dedicated read-only user for analytics/reporting
CREATE USER IF NOT EXISTS 'ai_tools_reader'@'%' IDENTIFIED BY 'reader_password';
GRANT SELECT ON ai_tools.* TO 'ai_tools_reader'@'%';

-- Flush privileges
FLUSH PRIVILEGES;

-- Switch to ai_tools database
USE ai_tools;

-- Create initial performance optimization tables
CREATE TABLE IF NOT EXISTS performance_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    response_time INT UNSIGNED NOT NULL,
    memory_usage INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_endpoint (endpoint),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create system health monitoring table
CREATE TABLE IF NOT EXISTS system_health (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    status ENUM('healthy', 'degraded', 'unhealthy') NOT NULL,
    metrics JSON,
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_service (service_name),
    INDEX idx_status (status),
    INDEX idx_checked_at (checked_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert initial health check data
INSERT INTO system_health (service_name, status, metrics) VALUES 
('mysql', 'healthy', '{"cpu": 0, "memory": 0, "connections": 0}'),
('redis', 'healthy', '{"memory_usage": 0, "connected_clients": 0}'),
('laravel', 'healthy', '{"queue_size": 0, "cache_hits": 0}'),
('nextjs', 'healthy', '{"build_time": 0, "page_load": 0}');

-- Create audit log table for security tracking
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id BIGINT UNSIGNED NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_resource (resource_type, resource_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;