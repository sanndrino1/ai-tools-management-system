-- AI Tools Management System Database Schema
-- Supabase PostgreSQL

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE tool_status AS ENUM ('pending', 'under_review', 'approved', 'rejected', 'archived');
CREATE TYPE user_role AS ENUM ('owner', 'pm', 'backend', 'frontend', 'qa', 'designer');
CREATE TYPE pricing_type AS ENUM ('free', 'freemium', 'paid');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- Categories table
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7), -- Hex color
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tools table
CREATE TABLE tools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    url VARCHAR(500) NOT NULL,
    pricing pricing_type NOT NULL DEFAULT 'free',
    status tool_status NOT NULL DEFAULT 'pending',
    
    -- User relations
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    
    -- Additional fields
    tags TEXT[] DEFAULT '{}',
    target_roles user_role[] DEFAULT '{}',
    difficulty difficulty_level,
    rejection_reason TEXT,
    
    -- Metrics
    views_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    ratings_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table (extends auth.users)
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role user_role NOT NULL DEFAULT 'designer',
    name VARCHAR(255),
    avatar_url VARCHAR(500),
    bio TEXT,
    company VARCHAR(255),
    location VARCHAR(255),
    website VARCHAR(500),
    
    -- Permissions
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ratings table
CREATE TABLE ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(tool_id, user_id) -- One rating per user per tool
);

-- Comments table
CREATE TABLE comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE,
    
    -- Voting
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comment votes table
CREATE TABLE comment_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    vote_type VARCHAR(10) CHECK (vote_type IN ('upvote', 'downvote')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(comment_id, user_id)
);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tools_category ON tools(category_id);
CREATE INDEX idx_tools_user ON tools(user_id);
CREATE INDEX idx_tools_status ON tools(status);
CREATE INDEX idx_tools_created_at ON tools(created_at);
CREATE INDEX idx_ratings_tool ON ratings(tool_id);
CREATE INDEX idx_comments_tool ON comments(tool_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

-- Full text search index
CREATE INDEX idx_tools_search ON tools USING gin(to_tsvector('english', name || ' ' || description));

-- Functions and triggers

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables
CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON tools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON ratings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update tool rating averages
CREATE OR REPLACE FUNCTION update_tool_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Update tool's average rating and count
    UPDATE tools 
    SET 
        average_rating = (
            SELECT COALESCE(AVG(rating), 0) 
            FROM ratings 
            WHERE tool_id = COALESCE(NEW.tool_id, OLD.tool_id)
        ),
        ratings_count = (
            SELECT COUNT(*) 
            FROM ratings 
            WHERE tool_id = COALESCE(NEW.tool_id, OLD.tool_id)
        )
    WHERE id = COALESCE(NEW.tool_id, OLD.tool_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tool_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON ratings
    FOR EACH ROW EXECUTE FUNCTION update_tool_rating();

-- Update comment vote counts
CREATE OR REPLACE FUNCTION update_comment_votes()
RETURNS TRIGGER AS $$
BEGIN
    -- Update comment vote counts
    UPDATE comments 
    SET 
        upvotes = (
            SELECT COUNT(*) 
            FROM comment_votes 
            WHERE comment_id = COALESCE(NEW.comment_id, OLD.comment_id) 
            AND vote_type = 'upvote'
        ),
        downvotes = (
            SELECT COUNT(*) 
            FROM comment_votes 
            WHERE comment_id = COALESCE(NEW.comment_id, OLD.comment_id) 
            AND vote_type = 'downvote'
        )
    WHERE id = COALESCE(NEW.comment_id, OLD.comment_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

CREATE TRIGGER update_comment_votes_trigger
    AFTER INSERT OR UPDATE OR DELETE ON comment_votes
    FOR EACH ROW EXECUTE FUNCTION update_comment_votes();

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Tools policies
CREATE POLICY "Public tools are viewable by everyone" ON tools
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can view their own tools" ON tools
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create tools" ON tools
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own tools" ON tools
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Only admins can delete tools" ON tools
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- User profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR ALL USING (auth.uid() = id);

-- Ratings policies
CREATE POLICY "Ratings are viewable by everyone" ON ratings
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create ratings" ON ratings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" ON ratings
    FOR UPDATE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Approved comments are viewable by everyone" ON comments
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can view their own comments" ON comments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create comments" ON comments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON comments
    FOR UPDATE USING (auth.uid() = user_id);

-- Seed data
INSERT INTO categories (name, slug, description, icon, color) VALUES
('AI & Machine Learning', 'ai-ml', 'Artificial Intelligence and Machine Learning tools', '🤖', '#FF6B6B'),
('Development Tools', 'development', 'Programming and development utilities', '⚙️', '#4ECDC4'),
('Design & Creative', 'design', 'Design, UI/UX and creative tools', '🎨', '#45B7D1'),
('Productivity', 'productivity', 'Productivity and workflow optimization', '📈', '#96CEB4'),
('Communication', 'communication', 'Team communication and collaboration', '💬', '#FFEAA7'),
('Analytics', 'analytics', 'Data analysis and business intelligence', '📊', '#DDA0DD'),
('Automation', 'automation', 'Workflow automation and integration', '🔄', '#98D8C8'),
('Marketing', 'marketing', 'Marketing and customer engagement', '📢', '#F7DC6F'),
('Education', 'education', 'Learning and educational resources', '📚', '#BB8FCE'),
('Business', 'business', 'Business management and operations', '💼', '#85C1E9'),
('Other', 'other', 'Miscellaneous tools and utilities', '🔧', '#D5DBDB');

-- Create initial admin user profile function
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, name, role)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'name', 'designer');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to create profile when user signs up
CREATE TRIGGER create_user_profile_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_user_profile();