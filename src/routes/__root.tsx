import { Link, Navigate, Outlet, createRootRoute, useLocation } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { useAuth } from '../Components/Auth';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const location = useLocation();
  const { isauth } = useAuth();
  if (location.pathname === '/') {
    return <Navigate to='/login' replace />
  }
  if (location.pathname === '/home' && !isauth) {
    return <Navigate to='/login' replace />
  }

  return (
    <>
      {/* Masquer la navbar sur les pages de login et registration */}
      {(
        <div className="p-2 flex gap-2 text-lg">
          <Link
            to="/login"
            activeProps={{
              className: 'font-bold',
            }}
            activeOptions={{ exact: true }}
          >
          </Link>
          <Link
            to="/register"
            activeProps={{
              className: 'font-bold',
            }}
          >
          </Link>
        
        </div>
      )}
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
