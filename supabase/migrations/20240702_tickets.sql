-- Create ticket_status enum
CREATE TYPE ticket_status AS ENUM ('new', 'in_progress', 'in_review', 'closed');

-- Create ticket_priority enum
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status ticket_status NOT NULL DEFAULT 'new',
  priority ticket_priority NOT NULL DEFAULT 'medium',
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create ticket_comments table
CREATE TABLE IF NOT EXISTS ticket_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create ticket_activity table to track changes
CREATE TABLE IF NOT EXISTS ticket_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_activity ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tickets
CREATE POLICY "Users can view all tickets" 
  ON tickets FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create tickets" 
  ON tickets FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Ticket creators and assignees can update tickets" 
  ON tickets FOR UPDATE 
  USING (auth.uid() = created_by OR auth.uid() = assigned_to);

-- Create RLS policies for ticket_comments
CREATE POLICY "Users can view all ticket comments" 
  ON ticket_comments FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create comments" 
  ON ticket_comments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Comment creators can update their comments" 
  ON ticket_comments FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for ticket_activity
CREATE POLICY "Users can view all ticket activity" 
  ON ticket_activity FOR SELECT 
  USING (true);

CREATE POLICY "System and authenticated users can create activity logs" 
  ON ticket_activity FOR INSERT 
  WITH CHECK (true);

-- Create functions to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at
CREATE TRIGGER update_tickets_updated_at
BEFORE UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_ticket_comments_updated_at
BEFORE UPDATE ON ticket_comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at(); 