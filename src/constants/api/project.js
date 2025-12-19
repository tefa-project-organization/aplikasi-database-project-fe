export const CREATE_PROJECT = '/projects/create';
export const SHOW_ALL_PROJECTS = '/projects/show-all?limit=10000';

// Dynamic endpoints
export const SHOW_ONE_PROJECT = (id) => `/projects/show-one/${id}`;
export const UPDATE_PROJECT = (id) => `/projects/update/${id}`;
export const DELETE_PROJECT = (id) => `/projects/delete/${id}`;
