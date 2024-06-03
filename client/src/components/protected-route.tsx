/**
 * @file protected-route.tsx
 * @brief The protected route component of the application.
 * @version 1.0
 * @date 06-02-2024
 * @author Arinjay Singh
 */


import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../context/auth-context';
import Loading from './loading';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isAuthenticated && pathname !== '/login' && !loading) {
            router.push('/login');
        }
    }, [isAuthenticated, pathname, router, loading]);

    if (loading) {
        return <Loading/>;
    }

  return children;
};

export default ProtectedRoute;
