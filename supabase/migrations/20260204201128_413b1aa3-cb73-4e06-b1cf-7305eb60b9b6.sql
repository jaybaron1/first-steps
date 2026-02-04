-- Add new columns to visitor_sessions for complete tracking
ALTER TABLE visitor_sessions 
ADD COLUMN IF NOT EXISTS utm_term text,
ADD COLUMN IF NOT EXISTS utm_content text,
ADD COLUMN IF NOT EXISTS screen_resolution text,
ADD COLUMN IF NOT EXISTS viewport_size text,
ADD COLUMN IF NOT EXISTS timezone text,
ADD COLUMN IF NOT EXISTS language text;

-- Create lead scoring function
CREATE OR REPLACE FUNCTION calculate_lead_score(p_session_id text)
RETURNS integer AS $$
DECLARE
  score integer := 0;
  page_count integer;
  total_time integer;
  avg_scroll numeric;
  high_value_pages integer;
  cta_clicks integer;
  form_starts integer;
BEGIN
  -- Get session data
  SELECT COALESCE(page_views, 0), COALESCE(total_time_seconds, 0) 
  INTO page_count, total_time
  FROM visitor_sessions WHERE session_id = p_session_id;
  
  -- Calculate page view score (max 25)
  score := score + LEAST(page_count * 5, 25);
  
  -- Calculate time score (max 25)
  score := score + LEAST(FLOOR(total_time / 30)::integer, 25);
  
  -- Get average scroll depth
  SELECT COALESCE(AVG(scroll_depth), 0) INTO avg_scroll
  FROM page_views WHERE session_id = p_session_id;
  
  -- Scroll depth score
  IF avg_scroll > 75 THEN score := score + 15;
  ELSIF avg_scroll > 50 THEN score := score + 10;
  ELSIF avg_scroll > 25 THEN score := score + 5;
  END IF;
  
  -- High-value pages
  SELECT COUNT(*) INTO high_value_pages
  FROM page_views WHERE session_id = p_session_id
  AND (page_url LIKE '%/pricing%' OR page_url LIKE '%/about%' OR page_url LIKE '%/examples%');
  score := score + LEAST(high_value_pages * 5, 20);
  
  -- CTA clicks
  SELECT COUNT(*) INTO cta_clicks
  FROM visitor_events WHERE session_id = p_session_id AND event_type = 'cta_click';
  score := score + LEAST(cta_clicks * 5, 10);
  
  -- Form starts
  SELECT COUNT(*) INTO form_starts
  FROM visitor_events WHERE session_id = p_session_id AND event_type = 'form_start';
  IF form_starts > 0 THEN score := score + 5; END IF;
  
  RETURN LEAST(score, 100);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger function to auto-update lead score
CREATE OR REPLACE FUNCTION update_session_lead_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE visitor_sessions 
  SET lead_score = calculate_lead_score(NEW.session_id)
  WHERE session_id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers on page_views
DROP TRIGGER IF EXISTS trigger_update_lead_score_on_page_view ON page_views;
CREATE TRIGGER trigger_update_lead_score_on_page_view
AFTER INSERT OR UPDATE ON page_views
FOR EACH ROW
EXECUTE FUNCTION update_session_lead_score();

-- Create trigger on visitor_events
DROP TRIGGER IF EXISTS trigger_update_lead_score_on_event ON visitor_events;
CREATE TRIGGER trigger_update_lead_score_on_event
AFTER INSERT ON visitor_events
FOR EACH ROW
EXECUTE FUNCTION update_session_lead_score();