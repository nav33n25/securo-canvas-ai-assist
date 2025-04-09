-- Update the user_role ENUM type to support expanded roles
-- This must be run as a separate migration before the schema changes

-- First check if the ENUM exists with original values
DO $$
DECLARE
    type_exists BOOLEAN;
    invalid_values TEXT[];
BEGIN
    -- First, let's check if there are any values in user_roles that don't match the basic roles
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'user_roles' AND table_schema = 'public'
    ) THEN
        -- Get a list of any non-standard role values that might exist in the table
        SELECT array_agg(DISTINCT role) INTO invalid_values 
        FROM public.user_roles 
        WHERE role NOT IN ('individual', 'team_member', 'team_manager', 'administrator');
        
        IF invalid_values IS NOT NULL THEN
            RAISE NOTICE 'Found non-standard role values in user_roles table: %', invalid_values;
        END IF;
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'user_role'
    ) INTO type_exists;
    
    IF NOT type_exists THEN
        -- If it doesn't exist yet, create it with all values
        CREATE TYPE public.user_role AS ENUM (
            'individual', 'team_member', 'team_manager', 'administrator',
            'individual_basic', 'individual_professional',
            'team_analyst', 'team_hunter', 'team_researcher',
            'team_red', 'team_blue', 'team_lead',
            'security_manager', 'ciso_director',
            'platform_admin', 'knowledge_admin'
        );
        RAISE NOTICE 'Created new user_role ENUM with all values';
    ELSE
        -- If it exists but we need to handle existing data properly
        RAISE NOTICE 'user_role ENUM already exists.';
        
        -- Always convert to TEXT type to handle any values
        -- Check if user_roles table exists
        IF EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = 'user_roles' AND table_schema = 'public'
        ) THEN
            -- Drop the constraint first if it exists
            ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_role_check;
            
            -- Convert the column to TEXT type
            ALTER TABLE public.user_roles ALTER COLUMN role TYPE TEXT;
            RAISE NOTICE 'Converted user_roles.role column to TEXT type';
        END IF;

        -- Check if profiles table exists and has a role column
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'profiles' AND column_name = 'role' AND table_schema = 'public'
        ) THEN
            -- Convert the column to TEXT type
            ALTER TABLE public.profiles ALTER COLUMN role TYPE TEXT;
            RAISE NOTICE 'Converted profiles.role column to TEXT type';
        END IF;
    END IF;
END
$$; 