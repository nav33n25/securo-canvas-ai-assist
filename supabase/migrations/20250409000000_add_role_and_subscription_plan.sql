
-- Add role and subscription_plan columns to profiles table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'role'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN role TEXT DEFAULT 'individual';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'subscription_plan'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN subscription_plan TEXT DEFAULT 'free';
    END IF;
END
$$;

-- Update the role enum type if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'user_role'
    ) THEN
        CREATE TYPE user_role AS ENUM ('individual', 'team_member', 'team_manager', 'administrator');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'subscription_plan'
    ) THEN
        CREATE TYPE subscription_plan AS ENUM ('free', 'pro', 'team', 'enterprise');
    END IF;
END
$$;

-- Add comment explaining these columns
COMMENT ON COLUMN public.profiles.role IS 'User''s role in the system: individual, team_member, team_manager, or administrator';
COMMENT ON COLUMN public.profiles.subscription_plan IS 'User''s subscription plan: free, pro, team, or enterprise';
