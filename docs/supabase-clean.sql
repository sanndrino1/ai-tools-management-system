-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE tool_status AS ENUM ('pending', 'under_review', 'approved', 'rejected', 'archived');
CREATE TYPE user_role AS ENUM ('owner', 'pm', 'backend', 'frontend', 'qa', 'designer');
CREATE TYPE pricing_type AS ENUM ('free', 'freemium', 'paid');

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tools table
CREATE TABLE tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    detailed_description TEXT,
    website_url VARCHAR(500),
    pricing_type pricing_type DEFAULT 'free',
    price_details TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    tags TEXT[],
    features TEXT[],
    status tool_status DEFAULT 'pending',
    logo_url VARCHAR(500),
    screenshots TEXT[],
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    submitted_at TIMESTAMP DEFAULT NOW(),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(100),
    role user_role DEFAULT 'backend',
    avatar_url VARCHAR(500),
    bio TEXT,
    company VARCHAR(100),
    website VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Ratings table
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tool_id, user_id)
);

-- Comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_tools_category_id ON tools(category_id);
CREATE INDEX idx_tools_user_id ON tools(user_id);
CREATE INDEX idx_tools_status ON tools(status);
CREATE INDEX idx_tools_created_at ON tools(created_at);
CREATE INDEX idx_ratings_tool_id ON ratings(tool_id);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
CREATE INDEX idx_comments_tool_id ON comments(tool_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can create categories" ON categories FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Only authenticated users can update categories" ON categories FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for tools
CREATE POLICY "Tools are viewable by everyone" ON tools FOR SELECT USING (true);
CREATE POLICY "Users can create their own tools" ON tools FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tools" ON tools FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tools" ON tools FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_profiles
CREATE POLICY "Profiles are viewable by everyone" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can create their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for ratings
CREATE POLICY "Ratings are viewable by everyone" ON ratings FOR SELECT USING (true);
CREATE POLICY "Users can create their own ratings" ON ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own ratings" ON ratings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own ratings" ON ratings FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for comments
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can create their own comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for audit_logs
CREATE POLICY "Audit logs are viewable by authenticated users" ON audit_logs FOR SELECT USING (auth.uid() IS NOT NULL);

-- Insert sample categories
INSERT INTO categories (name, description, icon) VALUES
('AI & Machine Learning', 'Tools for artificial intelligence and machine learning development', '🤖'),
('Web Development', 'Frontend and backend web development tools', '🌐'),
('Mobile Development', 'iOS and Android app development tools', '📱'),
('DevOps & Infrastructure', 'CI/CD, deployment, and infrastructure management tools', '⚙️'),
('Data Science', 'Data analysis, visualization, and business intelligence tools', '📊'),
('Design & UI/UX', 'Design tools for user interface and user experience', '🎨'),
('Productivity', 'Project management and productivity enhancement tools', '📈'),
('Security', 'Cybersecurity and application security tools', '🔒');

-- Insert sample tools
INSERT INTO tools (title, description, detailed_description, website_url, pricing_type, category_id, tags, features, status) VALUES
('GitHub Copilot', 'AI-powered code completion and assistance', 'GitHub Copilot uses OpenAI technology to provide intelligent code suggestions and completions directly in your IDE.', 'https://github.com/features/copilot', 'paid', (SELECT id FROM categories WHERE name = 'AI & Machine Learning'), ARRAY['AI', 'Code completion', 'Programming'], ARRAY['Code suggestions', 'Multi-language support', 'IDE integration'], 'approved'),

('Supabase', 'Open source Firebase alternative', 'Supabase provides a complete backend-as-a-service with PostgreSQL database, authentication, real-time subscriptions, and storage.', 'https://supabase.com', 'freemium', (SELECT id FROM categories WHERE name = 'Web Development'), ARRAY['Backend', 'Database', 'Authentication'], ARRAY['PostgreSQL', 'Real-time', 'Auto-generated APIs'], 'approved'),

('Figma', 'Collaborative design platform', 'Figma is a web-based design tool that enables teams to create, prototype, and collaborate on digital designs in real-time.', 'https://figma.com', 'freemium', (SELECT id FROM categories WHERE name = 'Design & UI/UX'), ARRAY['Design', 'Prototyping', 'Collaboration'], ARRAY['Real-time collaboration', 'Prototyping', 'Design systems'], 'approved'),

('Docker', 'Containerization platform', 'Docker enables developers to package applications into containers, ensuring consistency across different environments.', 'https://docker.com', 'freemium', (SELECT id FROM categories WHERE name = 'DevOps & Infrastructure'), ARRAY['Containers', 'DevOps', 'Deployment'], ARRAY['Container management', 'Image registry', 'Orchestration'], 'approved');

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON tools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON ratings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (table_name, record_id, action, old_values, user_id)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD), auth.uid());
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values, user_id)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW), auth.uid());
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (table_name, record_id, action, new_values, user_id)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', row_to_json(NEW), auth.uid());
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create audit triggers
CREATE TRIGGER audit_tools AFTER INSERT OR UPDATE OR DELETE ON tools FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_categories AFTER INSERT OR UPDATE OR DELETE ON categories FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_ratings AFTER INSERT OR UPDATE OR DELETE ON ratings FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_comments AFTER INSERT OR UPDATE OR DELETE ON comments FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();