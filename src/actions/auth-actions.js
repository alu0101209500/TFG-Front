export const SET_TOKEN = 'auth:setToken';

export function setToken(token) {
  return ({
    type: SET_TOKEN,
    payload: {
      authToken: token
    }
  });
}