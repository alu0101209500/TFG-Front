export const SET_USER = 'currentUser:setUser'; 
export const LOG_OUT = 'currentUser:logOut'; 

export function setUser(user) {
  return ({
    type: SET_USER,
    payload: {
      username : user.username ? user.username : "",
      fullname : user.fullname ? user.fullname : "",
      email : user.email ? user.email : "",
      registration : user.registration ? user.registration : 0
    }
  });
}

export function logOut() {
  return ({
    type: LOG_OUT,
    payload: { }
  });
}