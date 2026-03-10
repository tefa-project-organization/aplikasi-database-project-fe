export const ROLE = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  PM: "PM",
}

export const routePermissions = {
  dashboard: [ROLE.ADMIN, ROLE.MANAGER, ROLE.PM],
  projects: [ROLE.ADMIN, ROLE.MANAGER, ROLE.PM],
  team: [ROLE.ADMIN, ROLE.MANAGER, ROLE.PM],
  usermanagement: [ROLE.ADMIN],
  history: [ROLE.ADMIN, ROLE.MANAGER],
  uploadDocuments: [ROLE.ADMIN, ROLE.PM],
}