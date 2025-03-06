// utils/permissions-config.ts

// This file controls permission behavior during development

// Set to true to bypass permissions in development mode
export const BYPASS_PERMISSIONS_IN_DEV = true

// Default permissions for development - edit as needed
export const DEV_DEFAULT_PERMISSIONS = {
  id: 1,
  role: 'Super Admin', // This allows full access in development
  paragon_group_view: true,
  paragon_group_create: true,
  paragon_group_edit: true,
  paragon_group_delete: true,
  parasole_view: true,
  parasole_create: true,
  parasole_edit: true,
  parasole_delete: true,
  user_view: true,
  user_create: true,
  user_edit: true,
  user_delete: true,
  settings_view: true,
  settings_create: true,
  settings_edit: true,
  dashboard: true,
  analytics_view: true
}

// Helper function to check if we should use default permissions
export function shouldUseDefaultPermissions(): boolean {
  return process.env.NODE_ENV === 'development' && BYPASS_PERMISSIONS_IN_DEV
}