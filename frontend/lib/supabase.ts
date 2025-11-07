// lib/supabase.ts - Supabase client configuration
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database Types
export interface Tool {
  id: string
  title: string
  description: string
  website_url?: string
  pricing_type?: 'free' | 'freemium' | 'paid'
  category_id?: string
  status?: string
  logo_url?: string
  created_at?: string
  category?: Category
}

export interface Category {
  id: string
  name: string
  description?: string
  icon?: string
  created_at?: string
}

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  role?: string
  avatar_url?: string
  bio?: string
  created_at?: string
}

export interface Rating {
  id: string
  tool_id: string
  user_id: string
  rating: number
  review?: string
  created_at?: string
}

// Helper functions
export const getTools = async () => {
  const { data, error } = await supabase
    .from('tools')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('status', 'approved')
  
  if (error) throw error
  return data
}

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
  
  if (error) throw error
  return data
}

export const getToolsByCategory = async (categoryId: string) => {
  const { data, error } = await supabase
    .from('tools')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('category_id', categoryId)
    .eq('status', 'approved')
  
  if (error) throw error
  return data
}

export const createTool = async (tool: Partial<Tool>) => {
  const { data, error } = await supabase
    .from('tools')
    .insert([tool])
    .select()
  
  if (error) throw error
  return data
}

export const updateTool = async (id: string, updates: Partial<Tool>) => {
  const { data, error } = await supabase
    .from('tools')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data
}

export const deleteTool = async (id: string) => {
  const { error } = await supabase
    .from('tools')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}