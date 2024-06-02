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
