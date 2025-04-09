
/// <reference types="vite/client" />

declare module 'react-router-dom' {
  export function useNavigate(): (to: string) => void;
  export function useLocation(): { 
    pathname: string;
    search: string;
    hash: string;
    state: unknown;
  };
  export function Navigate(props: { to: string; replace?: boolean; state?: any }): JSX.Element;
  export interface Location {
    pathname: string;
    search: string;
    hash: string;
    state: unknown;
  }
}

