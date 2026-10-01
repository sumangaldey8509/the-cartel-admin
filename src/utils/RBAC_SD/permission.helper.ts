import { UserInterface } from "@/interface/user";

export const getUserPermissions = (user: UserInterface | null): Set<string> => {
    if (!user?.role?.length) return new Set();

    return new Set(
        user.role.flatMap((r: any) => r.contents || [])
    );
};

export const hasPermission = (
    permissions: Set<string>,
    permission: string
) => permissions.has(permission);