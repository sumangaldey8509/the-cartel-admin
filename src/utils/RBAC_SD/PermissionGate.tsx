"use client";

import { ReactNode } from "react";
import { useAppSelector } from "@/store/hooks/hooks";
import { getUserPermissions } from "@/utils/RBAC_SD/permission.helper";

interface PermissionGateProps {
    permission?: string;        // single permission
    permissions?: string[];     // OR-based permissions
    children: ReactNode;
    fallback?: ReactNode;       // optional fallback UI
}

const PermissionGate = ({
    permission,
    permissions,
    children,
    fallback = null,
}: PermissionGateProps) => {
    const user = useAppSelector((state) => state.auth.user);
    const userPermissions = getUserPermissions(user);

    // If no permission required → always render
    if (!permission && (!permissions || permissions.length === 0)) {
        return <>{children}</>;
    }

    // Single permission check
    if (permission && userPermissions.has(permission)) {
        return <>{children}</>;
    }

    // Multiple permissions (OR logic)
    if (
        permissions &&
        permissions.some((p) => userPermissions.has(p))
    ) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};

export default PermissionGate;
