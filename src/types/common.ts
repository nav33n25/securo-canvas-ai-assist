import { LucideIcon } from 'lucide-react';

// Common type definitions
export type IconType = LucideIcon;

// Menu item interfaces
export interface MenuItem {
  title: string;
  icon: string;
  path: string;
  roles: string[];
  iconComponent?: React.ComponentType<any>;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
  visible?: boolean;
} 