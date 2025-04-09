-- Backup migration to fix existing user_roles data if needed
-- This migration can be run if the constraint still fails with the other approaches

DO $$
DECLARE
    role_column_type TEXT;
    invalid_rows RECORD;
BEGIN
    -- Check if user_roles table exists
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'user_roles' AND table_schema = 'public'
    ) THEN
        -- Get current column type
        SELECT data_type INTO role_column_type
        FROM information_schema.columns
        WHERE table_name = 'user_roles' AND column_name = 'role' AND table_schema = 'public';
        
        RAISE NOTICE 'Current data type of user_roles.role: %', role_column_type;
        
        -- First try: temporarily remove constraint to inspect data
        ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_role_check;
        
        -- Display all distinct role values that exist
        FOR invalid_rows IN 
            SELECT DISTINCT role FROM public.user_roles
        LOOP
            RAISE NOTICE 'Found role value: %', invalid_rows.role;
        END LOOP;
        
        -- Change any invalid values to valid ones
        -- First update any NULL values
        UPDATE public.user_roles SET role = 'individual' WHERE role IS NULL;
        
        -- Then update any specific problematic values (modify as needed)
        UPDATE public.user_roles SET role = 'individual' 
        WHERE role NOT IN (
            'individual', 'team_member', 'team_manager', 'administrator',
            'individual_basic', 'individual_professional',
            'team_analyst', 'team_hunter', 'team_researcher',
            'team_red', 'team_blue', 'team_lead',
            'security_manager', 'ciso_director',
            'platform_admin', 'knowledge_admin'
        );
        
        -- Make sure the column is TEXT type
        IF role_column_type <> 'text' THEN
            ALTER TABLE public.user_roles ALTER COLUMN role TYPE TEXT;
        END IF;
        
        -- Re-add the constraint but with all possible values
        ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_role_check
        CHECK (
            role IN (
                'individual', 'team_member', 'team_manager', 'administrator',
                'individual_basic', 'individual_professional',
                'team_analyst', 'team_hunter', 'team_researcher',
                'team_red', 'team_blue', 'team_lead',
                'security_manager', 'ciso_director',
                'platform_admin', 'knowledge_admin'
            )
        );
        
        RAISE NOTICE 'Successfully fixed user_roles table constraints';
    ELSE
        RAISE NOTICE 'user_roles table does not exist, no action needed';
    END IF;
END
$$; 