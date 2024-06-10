/**
 * @file protected-route.tsx
 * @brief The protected route component of the application.
 * @version 1.0
 * @date 06-02-2024
 * @author Arinjay Singh
 */

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../context/auth-context";
import { Loading } from "./loading";

// protected route component
export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  // get the authentication state and loading state from the auth context
  const { isAuthenticated, auth, loading } = useAuth();

  // get the router and pathname from the next navigation
  const router = useRouter();
  const pathname = usePathname();

  // redirect to the login page if the user is not authenticated,
  // the current path is not the login page, and the loading state is false
  useEffect(() => {
    if (!isAuthenticated() && pathname !== "/login" && !loading) {
      router.push("/login");
      console.log("protected route going to login");
    }
  }, [auth, pathname, router, loading]);

  // render the loading component if the loading state is true
  if (loading) {
    return <Loading />;
  }

  // render the children if the user is authenticated
  return children;
};
