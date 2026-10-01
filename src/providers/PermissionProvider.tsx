"use client"

import React, { createContext, useContext, useMemo, ReactNode } from "react"
import { useAppSelector } from "@/store/hooks/hooks"
import { PermissionManager, createPermissionManager } from "@/utils/permissions/permissionUtils"

interface PermissionContextType {
  permissions: PermissionManager
  isEmployee: boolean
  hasPermission: (module: string, action: string) => boolean
  hasAnyPermission: (module: string) => boolean
  isPathAccessible: (pathname: string) => boolean
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined)

interface PermissionProviderProps {
  children: ReactNode
}

export function PermissionProvider({ children }: PermissionProviderProps) {
  const authedUser = useAppSelector((state) => state.auth.user)

  const permissions = useMemo(() => {
    const userRoles = authedUser?.role || []
    return createPermissionManager(userRoles)
  }, [authedUser?.role])

  const isEmployee = useMemo(() => {
    return (
      permissions.hasPermission('dashboard', 'read') &&
      permissions.getAccessibleModules().length === 1
    )
  }, [permissions])

  const hasPermission = useMemo(() => {
    return (module: string, action: string) => {
      return permissions.hasPermission(module as any, action as any)
    }
  }, [permissions])

  const hasAnyPermission = useMemo(() => {
    return (module: string) => {
      return permissions.hasAnyPermission(module as any)
    }
  }, [permissions])

  const isPathAccessible = useMemo(() => {
    return (pathname: string) => {
      return permissions.isPathAccessible(pathname)
    }
  }, [permissions])

  const contextValue = useMemo(() => ({
    permissions,
    isEmployee,
    hasPermission,
    hasAnyPermission,
    isPathAccessible
  }), [permissions, isEmployee, hasPermission, hasAnyPermission, isPathAccessible])

  return (
    <PermissionContext.Provider value={contextValue}>
      {children}
    </PermissionContext.Provider>
  )
}

export function usePermissionContext(): PermissionContextType {
  const context = useContext(PermissionContext)
  if (context === undefined) {
    throw new Error("usePermissionContext must be used within a PermissionProvider")
  }
  return context
}

// Custom hooks for common permission checks
export function usePermissions() {
  const { permissions, isEmployee, hasPermission, hasAnyPermission, isPathAccessible } = usePermissionContext()
  return {
    permissions,
    isEmployee,
    hasPermission,
    hasAnyPermission,
    isPathAccessible
  }
}

export function useModulePermission(module: string) {
  const { hasPermission, hasAnyPermission, permissions } = usePermissionContext()
  
  return {
    hasAnyPermission: () => hasAnyPermission(module),
    hasReadPermission: () => hasPermission(module, 'read'),
    hasCreatePermission: () => hasPermission(module, 'create'),
    hasUpdatePermission: () => hasPermission(module, 'update'),
    hasDeletePermission: () => hasPermission(module, 'delete'),
    getPermissions: () => permissions.getModulePermissions(module as any)
  }
}
