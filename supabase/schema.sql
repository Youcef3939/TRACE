-- TRACE Supabase Schema
-- Create the tables needed for the TRACE application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Investigations Table
CREATE TABLE investigations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID, -- Optional for anonymous usage
  input_type TEXT NOT NULL CHECK (input_type IN ('text', 'url', 'image', 'social_post')),
  input_raw TEXT NOT NULL,
  input_language TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Claims Table
CREATE TABLE claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investigation_id UUID NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  original_context TEXT NOT NULL,
  verify_yourself JSONB NOT NULL DEFAULT '[]'::JSONB,
  -- Assessment Label & Reasoning
  assessment_label TEXT NOT NULL CHECK (assessment_label IN ('well_supported', 'questionable', 'misleading', 'unverifiable', 'insufficient_evidence')),
  assessment_reasoning_chain TEXT NOT NULL,
  assessment_manipulation_signals JSONB NOT NULL DEFAULT '[]'::JSONB,
  -- Source Trace
  source_origin_url TEXT,
  source_origin_author TEXT,
  source_origin_publish_date TEXT,
  source_publication_track_record TEXT,
  source_confidence TEXT CHECK (source_confidence IN ('high', 'medium', 'low', 'unknown')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Evidence Table
CREATE TABLE evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  source_url TEXT NOT NULL,
  source_name TEXT NOT NULL,
  publish_date TEXT,
  stance TEXT NOT NULL CHECK (stance IN ('supports', 'contradicts', 'context', 'unrelated')),
  excerpt TEXT NOT NULL,
  surrounding_context TEXT,
  credibility_signal TEXT CHECK (credibility_signal IN ('primary_source', 'reputable_reporting', 'secondary', 'unverified')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ancestry Hops Table (for the Ancestry Map)
CREATE TABLE ancestry_hops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  hop_order INTEGER NOT NULL,
  source_name TEXT NOT NULL,
  approximate_date TEXT,
  claim_text_at_this_hop TEXT NOT NULL,
  change_from_previous_hop TEXT,
  confidence TEXT CHECK (confidence IN ('confirmed', 'inferred', 'unknown')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add simple RLS policies (allow all for prototype)
ALTER TABLE investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE ancestry_hops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access" ON investigations FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access" ON investigations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous read access" ON claims FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access" ON claims FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous read access" ON evidence FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access" ON evidence FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous read access" ON ancestry_hops FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access" ON ancestry_hops FOR INSERT WITH CHECK (true);
