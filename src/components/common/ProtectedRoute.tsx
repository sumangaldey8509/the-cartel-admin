"use client"

import { useEffect, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { usePermissions } from "@/providers/PermissionProvider"

interface ProtectedRouteProps {
    children: ReactNode
    module: string
    action?: string
    fallback?: ReactNode
}

export function ProtectedRoute({ 
    children, 
    module, 
    action = "read", 
    fallback 
}: ProtectedRouteProps) {
    const { hasPermission, isPathAccessible, permissions } = usePermissions()
    const router = useRouter()

    const hasRequiredPermission = hasPermission(module, action)

    useEffect(() => {
        // If user doesn't have permission, redirect to first accessible module
        if (!hasRequiredPermission) {
            const accessibleModules = permissions.getAccessibleModules()
            if (accessibleModules.length > 0) {
                const firstModule = accessibleModules[0]
                const moduleHref = permissions.getModuleHref(firstModule)
                router.replace(moduleHref)
            } else {
                // If no modules accessible, redirect to signin
                router.replace("/auth/signin")
            }
        }
    }, [hasRequiredPermission, router, permissions])

    if (!hasRequiredPermission) {
        return fallback || (
            <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f]">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#bf953f]/10 to-[#d4af37]/10 flex items-center justify-center">
                        <svg className="w-10 h-10 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h3 className="text-[#C0C0C0] text-lg font-medium mb-2">Access Restricted</h3>
                    <p className="text-[#666] text-sm mb-4">
                        You don't have permission to access this module.
                    </p>
                    <p className="text-[#888] text-xs">
                        Redirecting to your accessible modules...
                    </p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}

interface ModuleGuardProps {
    children: ReactNode
    module: string
    action?: string
    fallback?: ReactNode
}

export function ModuleGuard({ children, module, action = "read", fallback }: ModuleGuardProps) {
    const { hasPermission } = usePermissions()
    const hasRequiredPermission = hasPermission(module, action)

    if (!hasRequiredPermission) {
        return fallback || null
    }

    return <>{children}</>
}

// Higher-order component for protecting entire pages
export function withPageProtection<P extends object>(
    Component: React.ComponentType<P>,
    module: string,
    action: string = "read"
) {
    return function ProtectedPage(props: P) {
        return (
            <ProtectedRoute module={module} action={action}>
                <Component {...props} />
            </ProtectedRoute>
        )
    }
}

interface RouteGuardProps {
    children: ReactNode
    fallback?: ReactNode
}

export function RouteGuard({ children, fallback }: RouteGuardProps) {
    const { isPathAccessible, permissions } = usePermissions()
    const pathname = usePathname()
    const router = useRouter()

    // Extract module from pathname
    const getModuleFromPath = (path: string): string => {
        // Remove leading slash and get the first segment
        const pathParts = path.replace(/^\//, '').split('/')
        return pathParts[0] || 'dashboard'
    }

    const hasAccess = isPathAccessible(pathname)

    useEffect(() => {
        if (!hasAccess) {
            // Get user's accessible modules and redirect to first one
            const accessibleModules = permissions.getAccessibleModules()
            if (accessibleModules.length > 0) {
                const firstModule = accessibleModules[0]
                const moduleHref = permissions.getModuleHref(firstModule)
                router.replace(moduleHref)
            } else {
                // If no modules accessible, redirect to signin
                router.replace("/auth/signin")
            }
        }
    }, [hasAccess, router, pathname, permissions])

    if (!hasAccess) {
        return fallback || (
            <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f]">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#bf953f]/10 to-[#d4af37]/10 flex items-center justify-center">
                        <svg className="w-10 h-10 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h3 className="text-[#C0C0C0] text-lg font-medium mb-2">Access Restricted</h3>
                    <p className="text-[#666] text-sm mb-4">
                        You don't have permission to access this module.
                    </p>
                    <p className="text-[#888] text-xs">
                        Redirecting to your accessible modules...
                    </p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
