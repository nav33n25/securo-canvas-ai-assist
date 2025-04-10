
import { useNavigate, useLocation, useParams } from 'react-router-dom';

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  return {
    push: (path: string) => navigate(path),
    replace: (path: string) => navigate(path, { replace: true }),
    pathname: location.pathname,
    query: { ...params, ...Object.fromEntries(new URLSearchParams(location.search)) },
    asPath: location.pathname + location.search,
    back: () => navigate(-1), // This is correct - navigate accepts a number
    prefetch: (href: string) => {
      // This is just a stub - React Router doesn't have a direct equivalent
      console.log('Prefetch stub for:', href);
    },
    events: {
      on: (event: string, handler: Function) => {
        // Stub for router events
        return () => {};
      },
      off: (event: string, handler: Function) => {
        // Stub for router events
      }
    }
  };
}
