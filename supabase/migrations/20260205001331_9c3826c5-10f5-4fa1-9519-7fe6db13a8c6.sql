-- Section engagement tracking table
CREATE TABLE section_engagement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT REFERENCES visitor_sessions(session_id),
  section_id TEXT NOT NULL,
  page_url TEXT NOT NULL,
  focus_duration_seconds INTEGER DEFAULT 0,
  entered_at TIMESTAMPTZ DEFAULT now(),
  exited_at TIMESTAMPTZ,
  entry_scroll_depth INTEGER,
  exit_scroll_depth INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast aggregation queries
CREATE INDEX idx_section_engagement_section ON section_engagement(section_id, created_at);
CREATE INDEX idx_section_engagement_session ON section_engagement(session_id);

-- Enable RLS
ALTER TABLE section_engagement ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can insert section engagement"
ON section_engagement FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view section engagement"
ON section_engagement FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));