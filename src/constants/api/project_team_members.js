export const CREATE_TEAM_MEMBER = "/team_members/create";
export const SHOW_ALL_TEAM_MEMBER = "/team_members/show-all";

// Dynamic endpoints
export const SHOW_ONE_TEAM_MEMBER = (id) => `/team_members/show-one/${id}`;
export const UPDATE_TEAM_MEMBER = (id) => `/team_members/update/${id}`;
export const DELETE_TEAM_MEMBER = (id) => `/team_members/delete/${id}`;