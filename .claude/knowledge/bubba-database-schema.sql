-- Bubba Performance Tracking Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- Core Tables
-- ===========================================

-- Sessions: Track each conversation session
CREATE TABLE IF NOT EXISTS bubba_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT UNIQUE NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  project_context TEXT,
  initial_task TEXT,
  final_outcome TEXT,
  total_tokens_used INTEGER DEFAULT 0,
  total_cost DECIMAL(10, 6) DEFAULT 0,
  status TEXT DEFAULT 'active',
  metadata JSONB DEFAULT '{}'
);

-- Interactions: Each request/response pair
CREATE TABLE IF NOT EXISTS bubba_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES bubba_sessions(id),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  interaction_type TEXT NOT NULL, -- 'task', 'research', 'coding', 'planning', 'delegation'
  user_request TEXT NOT NULL,
  assistant_response TEXT,
  tokens_input INTEGER DEFAULT 0,
  tokens_output INTEGER DEFAULT 0,
  response_time_ms INTEGER,
  tools_used JSONB DEFAULT '[]',
  agents_spawned JSONB DEFAULT '[]',
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Performance Metrics: Aggregated performance data
CREATE TABLE IF NOT EXISTS bubba_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES bubba_sessions(id),
  metric_type TEXT NOT NULL, -- 'efficiency', 'accuracy', 'delegation', 'context_management'
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(10, 4),
  unit TEXT,
  benchmark_value DECIMAL(10, 4),
  deviation_percentage DECIMAL(10, 2),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- Agent Delegations: Track agent spawning and performance
CREATE TABLE IF NOT EXISTS bubba_delegations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES bubba_sessions(id),
  interaction_id UUID REFERENCES bubba_interactions(id),
  agent_type TEXT NOT NULL, -- 'typescript-pro', 'python-pro', 'architect-review', etc.
  agent_name TEXT, -- Custom name if any
  task_description TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  success BOOLEAN,
  output_summary TEXT,
  tokens_used INTEGER DEFAULT 0,
  quality_score DECIMAL(3, 2), -- 0.00 to 1.00
  feedback TEXT
);

-- Tool Usage: Track which tools are used and their effectiveness
CREATE TABLE IF NOT EXISTS bubba_tool_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES bubba_sessions(id),
  interaction_id UUID REFERENCES bubba_interactions(id),
  tool_name TEXT NOT NULL, -- 'Read', 'Write', 'Bash', 'Grep', etc.
  invocation_count INTEGER DEFAULT 1,
  successful_count INTEGER DEFAULT 1,
  failed_count INTEGER DEFAULT 0,
  avg_execution_time_ms INTEGER,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Feedback Loop: Store improvement suggestions
CREATE TABLE IF NOT EXISTS bubba_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES bubba_sessions(id),
  interaction_id UUID REFERENCES bubba_interactions(id),
  feedback_type TEXT NOT NULL, -- 'improvement', 'success_pattern', 'failure_pattern'
  category TEXT, -- 'response_quality', 'efficiency', 'delegation', 'tool_usage', 'context_mgmt'
  observation TEXT NOT NULL,
  recommendation TEXT,
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  implemented BOOLEAN DEFAULT false,
  impact_score DECIMAL(3, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Learning Patterns: Store successful patterns for reuse
CREATE TABLE IF NOT EXISTS bubba_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pattern_type TEXT NOT NULL, -- 'workflow', 'delegation', 'tool_chain', 'response_template'
  pattern_name TEXT NOT NULL,
  description TEXT,
  pattern_data JSONB NOT NULL,
  success_rate DECIMAL(5, 2),
  usage_count INTEGER DEFAULT 0,
  last_used TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tags TEXT[] DEFAULT '{}'
);

-- ===========================================
-- Indexes for Performance
-- ===========================================

CREATE INDEX idx_sessions_status ON bubba_sessions(status);
CREATE INDEX idx_sessions_started ON bubba_sessions(started_at);
CREATE INDEX idx_interactions_session ON bubba_interactions(session_id);
CREATE INDEX idx_interactions_type ON bubba_interactions(interaction_type);
CREATE INDEX idx_interactions_timestamp ON bubba_interactions(timestamp);
CREATE INDEX idx_metrics_session ON bubba_metrics(session_id);
CREATE INDEX idx_metrics_type ON bubba_metrics(metric_type);
CREATE INDEX idx_delegations_session ON bubba_delegations(session_id);
CREATE INDEX idx_delegations_agent ON bubba_delegations(agent_type);
CREATE INDEX idx_tool_usage_tool ON bubba_tool_usage(tool_name);
CREATE INDEX idx_feedback_type ON bubba_feedback(feedback_type);
CREATE INDEX idx_feedback_category ON bubba_feedback(category);
CREATE INDEX idx_patterns_type ON bubba_patterns(pattern_type);

-- ===========================================
-- Views for Analytics
-- ===========================================

-- Session Summary View
CREATE OR REPLACE VIEW bubba_session_summary AS
SELECT
  s.id,
  s.session_id,
  s.started_at,
  s.ended_at,
  s.project_context,
  s.total_tokens_used,
  s.total_cost,
  s.status,
  COUNT(DISTINCT i.id) as interaction_count,
  COUNT(DISTINCT d.id) as delegation_count,
  AVG(i.response_time_ms)::INTEGER as avg_response_time_ms,
  SUM(CASE WHEN i.success THEN 1 ELSE 0 END)::DECIMAL / NULLIF(COUNT(i.id), 0) as success_rate
FROM bubba_sessions s
LEFT JOIN bubba_interactions i ON s.id = i.session_id
LEFT JOIN bubba_delegations d ON s.id = d.session_id
GROUP BY s.id;

-- Tool Effectiveness View
CREATE OR REPLACE VIEW bubba_tool_effectiveness AS
SELECT
  tool_name,
  SUM(invocation_count) as total_uses,
  SUM(successful_count) as successful_uses,
  SUM(failed_count) as failed_uses,
  ROUND(SUM(successful_count)::DECIMAL / NULLIF(SUM(invocation_count), 0) * 100, 2) as success_rate,
  ROUND(AVG(avg_execution_time_ms)::DECIMAL, 0) as avg_execution_time
FROM bubba_tool_usage
GROUP BY tool_name
ORDER BY total_uses DESC;

-- Agent Performance View
CREATE OR REPLACE VIEW bubba_agent_performance AS
SELECT
  agent_type,
  COUNT(*) as total_delegations,
  SUM(CASE WHEN success THEN 1 ELSE 0 END) as successful,
  ROUND(AVG(quality_score), 3) as avg_quality_score,
  ROUND(AVG(tokens_used)::DECIMAL, 0) as avg_tokens_used,
  ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - started_at)))::DECIMAL, 2) as avg_duration_seconds
FROM bubba_delegations
WHERE completed_at IS NOT NULL
GROUP BY agent_type
ORDER BY total_delegations DESC;

-- Daily Performance View
CREATE OR REPLACE VIEW bubba_daily_metrics AS
SELECT
  DATE(timestamp) as date,
  COUNT(*) as interactions,
  SUM(tokens_input + tokens_output) as total_tokens,
  ROUND(AVG(response_time_ms)::DECIMAL, 0) as avg_response_time,
  ROUND(SUM(CASE WHEN success THEN 1 ELSE 0 END)::DECIMAL / COUNT(*) * 100, 2) as success_rate
FROM bubba_interactions
GROUP BY DATE(timestamp)
ORDER BY date DESC;

-- ===========================================
-- Functions for Analytics
-- ===========================================

-- Function to calculate efficiency score
CREATE OR REPLACE FUNCTION calculate_efficiency_score(p_session_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  v_score DECIMAL;
  v_token_efficiency DECIMAL;
  v_time_efficiency DECIMAL;
  v_success_rate DECIMAL;
BEGIN
  SELECT
    -- Lower tokens per successful interaction is better (max 0.4)
    LEAST(0.4, 0.4 * (1000.0 / NULLIF(AVG(tokens_input + tokens_output), 0))),
    -- Faster response time is better (max 0.3)
    LEAST(0.3, 0.3 * (5000.0 / NULLIF(AVG(response_time_ms), 0))),
    -- Higher success rate is better (max 0.3)
    0.3 * (SUM(CASE WHEN success THEN 1 ELSE 0 END)::DECIMAL / NULLIF(COUNT(*), 0))
  INTO v_token_efficiency, v_time_efficiency, v_success_rate
  FROM bubba_interactions
  WHERE session_id = p_session_id;

  v_score := COALESCE(v_token_efficiency, 0) + COALESCE(v_time_efficiency, 0) + COALESCE(v_success_rate, 0);
  RETURN ROUND(v_score, 4);
END;
$$ LANGUAGE plpgsql;

-- Function to get improvement recommendations
CREATE OR REPLACE FUNCTION get_improvement_recommendations(p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  category TEXT,
  recommendation TEXT,
  priority TEXT,
  frequency INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    f.category,
    f.recommendation,
    f.priority,
    COUNT(*)::INTEGER as frequency
  FROM bubba_feedback f
  WHERE f.implemented = false
  AND f.recommendation IS NOT NULL
  GROUP BY f.category, f.recommendation, f.priority
  ORDER BY
    CASE f.priority
      WHEN 'critical' THEN 1
      WHEN 'high' THEN 2
      WHEN 'medium' THEN 3
      ELSE 4
    END,
    COUNT(*) DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- Row Level Security (RLS)
-- ===========================================

ALTER TABLE bubba_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bubba_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bubba_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE bubba_delegations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bubba_tool_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE bubba_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE bubba_patterns ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access
CREATE POLICY "Service role access" ON bubba_sessions FOR ALL TO service_role USING (true);
CREATE POLICY "Service role access" ON bubba_interactions FOR ALL TO service_role USING (true);
CREATE POLICY "Service role access" ON bubba_metrics FOR ALL TO service_role USING (true);
CREATE POLICY "Service role access" ON bubba_delegations FOR ALL TO service_role USING (true);
CREATE POLICY "Service role access" ON bubba_tool_usage FOR ALL TO service_role USING (true);
CREATE POLICY "Service role access" ON bubba_feedback FOR ALL TO service_role USING (true);
CREATE POLICY "Service role access" ON bubba_patterns FOR ALL TO service_role USING (true);

-- ===========================================
-- Sample Seed Data
-- ===========================================

-- This will be populated automatically by the Bubba tracking system
