-- Add latitude and longitude columns for precise visitor geolocation
ALTER TABLE public.visitor_sessions 
ADD COLUMN latitude NUMERIC(10,7),
ADD COLUMN longitude NUMERIC(10,7);

-- Add index for efficient geo queries
CREATE INDEX idx_visitor_sessions_geo ON public.visitor_sessions (latitude, longitude) WHERE latitude IS NOT NULL;