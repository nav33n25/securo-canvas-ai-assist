
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface LinkProps {
  href: string;
  as?: string;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  prefetch?: boolean;
  locale?: string | false;
  legacyBehavior?: boolean;
  children: React.ReactNode;
  [key: string]: any;
}

// Next.js Link component compatibility layer
const Link: React.FC<LinkProps> = ({
  href,
  replace,
  children,
  ...props
}) => {
  // Filter out Next.js specific props
  const filteredProps = Object.fromEntries(
    Object.entries(props).filter(([key]) => 
      !['as', 'scroll', 'shallow', 'passHref', 'prefetch', 'locale', 'legacyBehavior'].includes(key)
    )
  );

  return (
    <RouterLink to={href} replace={replace} {...filteredProps}>
      {children}
    </RouterLink>
  );
};

export default Link;
