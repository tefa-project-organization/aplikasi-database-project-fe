export const CREATE_CLIENT_PIC = "/client_pics/create"
export const SHOW_ALL_CLIENT_PICS = "/client_pics/show-all"

// Dynamic endpoints
export const SHOW_ONE_CLIENT_PIC = (id) =>
  `/client_pics/show-one/${id}`

export const UPDATE_CLIENT_PIC = (id) =>
  `/client_pics/update/${id}`

export const DELETE_CLIENT_PIC = (id) =>
  `/client_pics/delete/${id}`
