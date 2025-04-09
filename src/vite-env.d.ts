
/// <reference types="vite/client" />

// React Router DOM type declarations
interface NavigateOptions {
  replace?: boolean;
  state?: any;
}

declare module 'react-router-dom' {
  export function useNavigate(): (to: string, options?: NavigateOptions) => void;
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
  export function Link(props: { to: string; replace?: boolean; state?: any; className?: string; children?: React.ReactNode }): JSX.Element;
  export function BrowserRouter(props: { children: React.ReactNode }): JSX.Element;
  export function Routes(props: { children: React.ReactNode }): JSX.Element;
  export function Route(props: { path: string; element: React.ReactNode }): JSX.Element;
  export function useParams<T extends Record<string, string | undefined>>(): T;
}
