-- Add metadata column to leads table for storing chatbot conversation data
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;