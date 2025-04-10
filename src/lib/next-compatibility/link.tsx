
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
  replace?: boolean;
  [key: string]: any;
}

export default function Link({ href, children, ...props }: LinkProps) {
  return <RouterLink to={href} {...props}>{children}</RouterLink>;
}
