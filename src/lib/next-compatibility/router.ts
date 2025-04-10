
import { useNavigate, useLocation, useParams } from 'react-router-dom';

// Create a compatibility layer for Next.js router
export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  return {
    query: { ...params, ...Object.fromEntries(new URLSearchParams(location.search)) },
    pathname: location.pathname,
    push: (url: string) => navigate(url),
    replace: (url: string) => navigate(url, { replace: true }),
    back: () => navigate(-1),
    asPath: location.pathname + location.search,
  };
}

// This is the default export to match Next.js router
const router = {
  push: (url: string) => {
    window.location.href = url;
  },
  replace: (url: string) => {
    window.location.replace(url);
  },
  back: () => {
    window.history.back();
  },
  pathname: window.location.pathname,
  query: Object.fromEntries(new URLSearchParams(window.location.search)),
  asPath: window.location.pathname + window.location.search,
};

export default router;
