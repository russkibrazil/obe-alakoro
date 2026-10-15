import { useSession } from "next-auth/react"
import { ComponentType, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { UserRole } from "@/types/UserRole";


export function withAuthorization<P extends object>(
  Component: ComponentType<P>,
  allowedRoles: UserRole[]
) {
  return function ProtectedPage(props: P) {
    const router = useRouter();
    const { data: session } = useSession()
    useEffect(() => {
      if (!session) {
        router.replace('/auth');
        return;
      }

      if (!allowedRoles.includes(session.user.role)) {
        router.replace('/');
      }
    }, [session, router]);

    if (!session || !allowedRoles.includes(session.user.role)) {
      return null;
    }

    return <Component {...props} />;
  };
}