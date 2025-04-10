
import { useNavigate, useLocation, useParams as useReactRouterParams } from 'react-router-dom';

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  
  return {
    push: (path: string) => navigate(path),
    replace: (path: string) => navigate(path, { replace: true }),
    pathname: location.pathname,
    query: Object.fromEntries(new URLSearchParams(location.search)),
    asPath: location.pathname + location.search,
    back: () => navigate(-1), // Use number -1 instead of string "-1"
    forward: () => navigate(1), // Use number 1 instead of string "1"
  };
}

export function useParams<T>() {
  const params = useReactRouterParams();
  return params as unknown as T;
}
