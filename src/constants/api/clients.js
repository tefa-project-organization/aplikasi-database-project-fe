export const CREATE_CLIENT = "/clients/create"
export const SHOW_ALL_CLIENTS = "/clients/show-all"

// Dynamic endpoints
export const SHOW_ONE_CLIENT = (id) =>
  `/clients/show-one/${id}`

export const UPDATE_CLIENT = (id) =>
  `/clients/update/${id}`

export const DELETE_CLIENT = (id) =>
  `/clients/delete/${id}`