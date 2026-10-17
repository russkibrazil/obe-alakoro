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
    const { data: session, status } = useSession();

    const role = session?.user?.role;

    const authorized =
        status === 'authenticated' &&
        role !== undefined &&
        allowedRoles.includes(role);

    useEffect(() => {
        if (status === 'loading') {
            return;
        }

        if (status === 'unauthenticated') {
            void router.replace('/auth');
            return;
        }

        if (status === 'authenticated' && !authorized) {
            void router.replace('/');
        }
    }, [status, authorized, router]);

    if (status === 'loading' || !authorized) {
        return null;
    }

    return <Component {...props} />;
  };
}