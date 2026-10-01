import { RoleInterface } from "@/interface/roles"
import React from "react"

// Define all available modules and their possible actions
export const MODULE_PERMISSIONS = {
  dashboard: ['read'],
  coins: ['create', 'read', 'update', 'delete', 'approve', 'reject'],
  members: ['create', 'read', 'update', 'delete', 'block', 'verify', 'assign-role'],
  news: ['create', 'read', 'update', 'delete', 'publish', 'archive', 'feature'],
  request: ['create', 'read', 'update', 'delete', 'approve', 'reject', 'process'],
  consultationRequest: ['create', 'read', 'update', 'delete', 'approve', 'reject', 'schedule'],
  publishers: ['create', 'read', 'update', 'delete', 'verify', 'block', 'feature'],
  adserver: ['create', 'read', 'update', 'delete'],
  settings: ['create', 'read', 'update', 'delete']
} as const

export type Module = keyof typeof MODULE_PERMISSIONS
export type Action = typeof MODULE_PERMISSIONS[Module][number]

// Define module metadata for UI
export const MODULE_METADATA = {
  dashboard: {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'Home',
    order: 1
  },
  coins: {
    name: 'Coins',
    href: '/coins',
    icon: 'Coins',
    order: 2
  },
  members: {
    name: 'Members',
    href: '/members',
    icon: 'Users',
    order: 3
  },
  news: {
    name: 'News',
    href: '/news',
    icon: 'Newspaper',
    order: 4
  },
  request: {
    name: 'Request',
    href: '/request',
    icon: 'GitPullRequest',
    order: 5
  },
  consultationRequest: {
    name: 'Consultation Request',
    href: '/consultation-request',
    icon: 'GitPullRequest',
    order: 6
  },
  publishers: {
    name: 'Publishers',
    href: '/publishers',
    icon: 'Users',
    order: 7
  },
  adserver: {
    name: 'Ad Server',
    href: '/adserver',
    icon: 'Server',
    order: 8
  },
  settings: {
    name: 'Settings',
    href: '/settings',
    icon: 'Settings',
    order: 9
  }
} as const

/**
 * Permission Manager Class - Centralized permission management
 */
export class PermissionManager {
  private userPermissions: Set<string> = new Set()

  constructor(userRoles: RoleInterface[] = []) {
    this.initializePermissions(userRoles)
  }

  private initializePermissions(userRoles: RoleInterface[]) {
    this.userPermissions.clear()

    userRoles.forEach(role => {
      if (role.contents && Array.isArray(role.contents)) {
        role.contents.forEach(permission => {
          this.userPermissions.add(permission)
        })
      }
    })
  }

  /**
   * Check if user has specific permission
   * @param module Module name
   * @param action Action name
   * @returns boolean
   */
  hasPermission(module: Module, action: Action): boolean {
    const permission = `${module}:${action}`
    return this.userPermissions.has(permission)
  }

  /**
   * Check if user has any permission for a module
   * @param module Module name
   * @returns boolean
   */
  hasAnyPermission(module: Module): boolean {
    const modulePermissions = MODULE_PERMISSIONS[module]
    return modulePermissions.some(action => this.hasPermission(module, action))
  }

  /**
   * Get all permissions for a specific module
   * @param module Module name
   * @returns array of allowed actions
   */
  getModulePermissions(module: Module): Action[] {
    const modulePermissions = MODULE_PERMISSIONS[module]
    return modulePermissions.filter(action => this.hasPermission(module, action))
  }

  /**
   * Get all accessible modules for the user
   * @returns array of accessible modules
   */
  getAccessibleModules(): Module[] {
    return (Object.keys(MODULE_PERMISSIONS) as Module[]).filter(module =>
      this.hasAnyPermission(module)
    )
  }

  /**
   * Get all user permissions as array
   * @returns array of permission strings
   */
  getAllPermissions(): string[] {
    return Array.from(this.userPermissions)
  }

  /**
   * Check if current path is accessible
   * @param pathname Current pathname
   * @returns boolean
   */
  isPathAccessible(pathname: string): boolean {
    // Remove leading slash and extract module
    const pathParts = pathname.replace(/^\//, '').split('/')
    const module = pathParts[0] as Module

    if (!module || !MODULE_PERMISSIONS[module]) {
      return false // Invalid module
    }

    return this.hasAnyPermission(module)
  }

  /**
   * Get module href from metadata
   * @param module Module name
   * @returns href string
   */
  getModuleHref(module: Module): string {
    return MODULE_METADATA[module]?.href || '/dashboard'
  }

  /**
   * Update user roles and refresh permissions
   * @param userRoles New user roles
   */
  updateRoles(userRoles: RoleInterface[]) {
    this.initializePermissions(userRoles)
  }
}

/**
 * Create a permission manager instance for a user
 * @param userRoles User roles array
 * @returns PermissionManager instance
 */
export function createPermissionManager(userRoles: RoleInterface[] = []): PermissionManager {
  return new PermissionManager(userRoles)
}

/**
 * Hook for using permission manager in React components
 * @param userRoles User roles array
 * @returns PermissionManager instance
 */
export function usePermissions(userRoles: RoleInterface[] = []): PermissionManager {
  // In a real implementation, this would use useMemo to avoid recreating
  // the manager on every render
  return createPermissionManager(userRoles)
}

/**
 * Higher-order component for permission-based rendering
 */
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission: { module: Module; action: Action }
): React.ComponentType<P & { permissions: PermissionManager }> {
  return function PermissionWrapper(props: P & { permissions: PermissionManager }) {
    const { permissions, ...rest } = props

    if (!permissions.hasPermission(requiredPermission.module, requiredPermission.action)) {
      return null // or a fallback component
    }

    return React.createElement(Component, rest as P)
  }
}

/**
 * Utility function to check if user should be employee (only dashboard access)
 * @param permissions PermissionManager instance
 * @returns boolean
 */
export function isEmployeeRole(permissions: PermissionManager): boolean {
  // Employee has only dashboard:read permission
  return (
    permissions.hasPermission('dashboard', 'read') &&
    permissions.getAccessibleModules().length === 1
  )
}

/**
 * Get sidebar items based on user permissions
 * @param permissions PermissionManager instance
 * @returns array of sidebar items
 */
export function getSidebarItems(permissions: PermissionManager) {
  const accessibleModules = permissions.getAccessibleModules()

  return accessibleModules
    .map(module => ({
      name: MODULE_METADATA[module].name,
      href: MODULE_METADATA[module].href,
      icon: MODULE_METADATA[module].icon,
      module,
      isAccessible: true,
      hasAnyPermission: true
    }))
    .sort((a, b) => MODULE_METADATA[a.module as Module].order - MODULE_METADATA[b.module as Module].order)
}

/**
 * Get all sidebar items (including non-accessible ones for visual purposes)
 * @param permissions PermissionManager instance
 * @returns array of all sidebar items with accessibility status
 */
export function getAllSidebarItems(permissions: PermissionManager) {
  return Object.entries(MODULE_METADATA)
    .map(([module, metadata]) => ({
      name: metadata.name,
      href: metadata.href,
      icon: metadata.icon,
      module: module as Module,
      isAccessible: permissions.hasAnyPermission(module as Module),
      hasAnyPermission: permissions.hasAnyPermission(module as Module)
    }))
    .sort((a, b) => MODULE_METADATA[a.module].order - MODULE_METADATA[b.module].order)
}
