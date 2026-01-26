export const CREATE_PROJECT_TEAM = "/project_teams/create"
export const SHOW_ALL_PROJECT_TEAMS = "/project_teams/show-all"

// Dynamic endpoints
export const SHOW_ONE_PROJECT_TEAM = (id) =>
  `/project_teams/show-one/${id}`

export const UPDATE_PROJECT_TEAM = (id) =>
  `/project_teams/update/${id}`

export const DELETE_PROJECT_TEAM = (id) =>
  `/project_teams/delete/${id}`
