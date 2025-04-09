/// <reference types="vite/client" />
// Add declarations for missing packages if needed
declare module 'react-router-dom' {
    export function useNavigate(): (path: string) => void;
    export function Navigate(props: { to: string; replace?: boolean }): JSX.Element;
    export function useLocation(): {
      pathname: string;
      search: string;
      hash: string;
      state: any;
      key: string;
    };
  }
  