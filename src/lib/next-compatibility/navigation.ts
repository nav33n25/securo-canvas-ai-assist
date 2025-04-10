
import { useNavigate, useLocation, useParams } from 'react-router-dom';

// Compatibility layer for next/navigation
export function usePathname() {
  const location = useLocation();
  return location.pathname;
}

export function useSearchParams() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  // Create a Map-like object with get/getAll methods
  return {
    get: (key: string) => searchParams.get(key),
    getAll: (key: string) => searchParams.getAll(key),
    has: (key: string) => searchParams.has(key),
    entries: () => searchParams.entries(),
    toString: () => searchParams.toString(),
  };
}

export function useRouter() {
  const navigate = useNavigate();
  
  return {
    push: (path: string) => navigate(path),
    replace: (path: string) => navigate(path, { replace: true }),
    back: () => navigate(-1 as any), // Using type assertion
    forward: () => navigate(1 as any), // Using type assertion
    refresh: () => window.location.reload(),
  };
}
