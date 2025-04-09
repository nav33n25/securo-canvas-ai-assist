-- USOH Database Schema Migration
-- This migration extends the SecureCanvas schema to support:
-- 1. Enhanced user roles and subscription tiers
-- 2. Ticketing system
-- 3. Team management
-- 4. Integration with security tools

-- IMPORTANT NOTE: We're using the original ENUM values ('individual', 'team_member', 'team_manager', 'administrator')
-- and NOT the expanded roles ('individual_basic', etc.) due to Supabase ENUM constraints
-- To add expanded roles, a separate migration would be needed to modify the ENUM type first

-- Update profiles table with new fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'individual';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS expertise_areas text[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS team_id uuid;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS job_title text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS allow_marketing boolean DEFAULT false;

-- Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  organization_id uuid,
  team_type text NOT NULL CHECK (team_type IN ('red_team', 'blue_team', 'security_ops', 'compliance', 'general')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create team_members table FIRST before policies that reference it
CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id uuid REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('member', 'lead', 'owner')),
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Now add RLS policies for teams (after team_members exists)
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members can view their teams" 
  ON public.teams FOR SELECT 
  USING (id IN (
    SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Team owners can update their teams" 
  ON public.teams FOR UPDATE 
  USING (id IN (
    SELECT team_id FROM public.team_members WHERE user_id = auth.uid() AND role = 'owner'
  ));

-- Add RLS policies for team_members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members can view other team members" 
  ON public.team_members FOR SELECT 
  USING (team_id IN (
    SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Team owners can manage team members" 
  ON public.team_members FOR ALL 
  USING (team_id IN (
    SELECT team_id FROM public.team_members WHERE user_id = auth.uid() AND role = 'owner'
  ));

-- Create security_tickets table
CREATE TABLE IF NOT EXISTS public.security_tickets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'review', 'closed')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  assignee_id uuid REFERENCES auth.users(id),
  reporter_id uuid REFERENCES auth.users(id) NOT NULL,
  team_id uuid REFERENCES public.teams(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  due_date timestamptz,
  ticket_type text NOT NULL CHECK (ticket_type IN ('vulnerability', 'incident', 'task', 'project')),
  labels text[] DEFAULT '{}',
  external_references jsonb DEFAULT '{}'::jsonb
);

-- Add RLS policies for security_tickets
ALTER TABLE public.security_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tickets" 
  ON public.security_tickets FOR SELECT 
  USING (
    reporter_id = auth.uid() OR 
    assignee_id = auth.uid() OR
    team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create tickets" 
  ON public.security_tickets FOR INSERT 
  WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Users can update their own tickets or assigned tickets" 
  ON public.security_tickets FOR UPDATE 
  USING (
    reporter_id = auth.uid() OR 
    assignee_id = auth.uid() OR
    team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid() AND role IN ('lead', 'owner'))
  );

-- Create ticket_comments table
CREATE TABLE IF NOT EXISTS public.ticket_comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id uuid REFERENCES public.security_tickets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  parent_comment_id uuid REFERENCES public.ticket_comments(id)
);

-- Add RLS policies for ticket_comments
ALTER TABLE public.ticket_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view comments on visible tickets" 
  ON public.ticket_comments FOR SELECT 
  USING (ticket_id IN (
    SELECT id FROM public.security_tickets 
    WHERE reporter_id = auth.uid() OR 
          assignee_id = auth.uid() OR
          team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
  ));

CREATE POLICY "Users can add comments to visible tickets" 
  ON public.ticket_comments FOR INSERT 
  WITH CHECK (ticket_id IN (
    SELECT id FROM public.security_tickets 
    WHERE reporter_id = auth.uid() OR 
          assignee_id = auth.uid() OR
          team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
  ));

-- Create ticket_document_relations table
CREATE TABLE IF NOT EXISTS public.ticket_document_relations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id uuid REFERENCES public.security_tickets(id) ON DELETE CASCADE NOT NULL,
  document_id uuid REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
  relation_type text NOT NULL CHECK (relation_type IN ('evidence', 'reference', 'attachment')),
  created_by uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(ticket_id, document_id, relation_type)
);

-- Add RLS policies for ticket_document_relations
ALTER TABLE public.ticket_document_relations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view document relations for visible tickets" 
  ON public.ticket_document_relations FOR SELECT 
  USING (ticket_id IN (
    SELECT id FROM public.security_tickets 
    WHERE reporter_id = auth.uid() OR 
          assignee_id = auth.uid() OR
          team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
  ));

CREATE POLICY "Users can create document relations for their tickets" 
  ON public.ticket_document_relations FOR INSERT 
  WITH CHECK (
    created_by = auth.uid() AND
    ticket_id IN (
      SELECT id FROM public.security_tickets 
      WHERE reporter_id = auth.uid() OR 
            assignee_id = auth.uid() OR
            team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
    )
  );

-- Create integration_connections table
CREATE TABLE IF NOT EXISTS public.integration_connections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  integration_type text NOT NULL CHECK (integration_type IN ('jira', 'github', 'slack', 'burp_suite', 'metasploit', 'nessus')),
  connection_details jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  team_id uuid REFERENCES public.teams(id),
  UNIQUE(user_id, integration_type)
);

-- Add RLS policies for integration_connections
ALTER TABLE public.integration_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own integrations" 
  ON public.integration_connections FOR SELECT 
  USING (
    user_id = auth.uid() OR
    team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage their own integrations" 
  ON public.integration_connections FOR ALL 
  USING (user_id = auth.uid());

-- Create security_audit_log table
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  details jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add RLS policies for security_audit_log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view audit logs" 
  ON public.security_audit_log FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'administrator'
    )
  );

-- Update existing documents table with new fields
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS sensitivity text DEFAULT 'internal' CHECK (sensitivity IN ('public', 'internal', 'confidential', 'restricted'));
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS compliance_frameworks text[] DEFAULT '{}';
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS team_id uuid REFERENCES public.teams(id);
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS evidence_ids text[] DEFAULT '{}';
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS mitre_attack_techniques text[] DEFAULT '{}';

-- Add function to log audit events
CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    resource_type,
    resource_id,
    details,
    ip_address
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    NEW.id,
    jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW)),
    current_setting('request.headers', true)::json->>'x-forwarded-for'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers
CREATE TRIGGER security_tickets_audit
AFTER INSERT OR UPDATE OR DELETE ON public.security_tickets
FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER documents_audit
AFTER INSERT OR UPDATE OR DELETE ON public.documents
FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER teams_audit
AFTER INSERT OR UPDATE OR DELETE ON public.teams
FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

-- Update user_roles table with expanded roles
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_role_check;

-- Make the constraint more flexible to accommodate existing data
-- By comparing with TEXT values, this will work if the column was converted to TEXT
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_role_check 
  CHECK (
    CAST(role AS TEXT) IN (
      'individual', 'team_member', 'team_manager', 'administrator',
      'individual_basic', 'individual_professional',
      'team_analyst', 'team_hunter', 'team_researcher',
      'team_red', 'team_blue', 'team_lead',
      'security_manager', 'ciso_director',
      'platform_admin', 'knowledge_admin'
    )
  );

-- Create subscription_features table for feature flagging
CREATE TABLE IF NOT EXISTS public.subscription_features (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_tier text NOT NULL CHECK (subscription_tier IN ('individual', 'professional', 'smb', 'enterprise')),
  feature_key text NOT NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  max_usage integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(subscription_tier, feature_key)
);

-- Insert default subscription features
INSERT INTO public.subscription_features (subscription_tier, feature_key, is_enabled, max_usage)
VALUES
  -- Individual tier
  ('individual', 'document_editor', true, null),
  ('individual', 'basic_templates', true, null),
  ('individual', 'personal_ticketing', true, 10),
  ('individual', 'ai_basic', true, 10),
  
  -- Professional tier
  ('professional', 'document_editor', true, null),
  ('professional', 'advanced_templates', true, null),
  ('professional', 'personal_ticketing', true, 50),
  ('professional', 'ai_enhanced', true, 50),
  ('professional', 'client_portal', true, 3),
  ('professional', 'tool_integration', true, 2),
  
  -- SMB tier
  ('smb', 'document_editor', true, null),
  ('smb', 'advanced_templates', true, null),
  ('smb', 'team_ticketing', true, 200),
  ('smb', 'ai_enhanced', true, 200),
  ('smb', 'client_portal', true, 10),
  ('smb', 'tool_integration', true, 5),
  ('smb', 'team_management', true, 15),
  ('smb', 'basic_analytics', true, null),
  
  -- Enterprise tier
  ('enterprise', 'document_editor', true, null),
  ('enterprise', 'advanced_templates', true, null),
  ('enterprise', 'team_ticketing', true, null),
  ('enterprise', 'ai_enhanced', true, null),
  ('enterprise', 'client_portal', true, null),
  ('enterprise', 'tool_integration', true, null),
  ('enterprise', 'team_management', true, null),
  ('enterprise', 'advanced_analytics', true, null),
  ('enterprise', 'sso_integration', true, null),
  ('enterprise', 'api_access', true, null),
  ('enterprise', 'audit_logging', true, null)
ON CONFLICT (subscription_tier, feature_key) DO NOTHING;

-- Add RLS policies for subscription_features
ALTER TABLE public.subscription_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read subscription features" 
  ON public.subscription_features FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can manage subscription features" 
  ON public.subscription_features FOR ALL 
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'administrator'
    )
  ); 