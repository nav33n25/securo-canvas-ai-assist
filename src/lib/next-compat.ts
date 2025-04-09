
// Compatibility layer for Next.js imports
// React is used in JSX below but we don't need to import it directly
// as it will be handled by the framework

// Next Router compatibility
export const useRouter = () => {
  return {
    query: {},
    push: (path: string) => {
      window.location.href = path;
      return Promise.resolve(true);
    },
    pathname: window.location.pathname,
    asPath: window.location.pathname,
    replace: (path: string) => {
      window.location.replace(path);
      return Promise.resolve(true);
    }
  };
};

// Next Link compatibility
export const Link = ({ href, children, ...props }: { href: string, children: React.ReactNode, [key: string]: any }) => {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};

// Next Navigation compatibility
export const useParams = <T extends Record<string, string>>(): T => {
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean);
  
  // Simple implementation that assumes /:param/ pattern
  if (segments.length >= 2) {
    return { id: segments[segments.length - 1] } as unknown as T;
  }
  
  return {} as unknown as T;
};

export const useNavigate = () => {
  return (path: string) => {
    window.location.href = path;
  };
};
