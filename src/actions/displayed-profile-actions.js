export const SET_PROFILE = 'displayedProfile:setProfile';
export const RESET_PROFILE = 'displayedProfile:resetProfile';

export function setProfile(event) {
  return ({
    type: SET_PROFILE,
    payload: {
      ...event
    }
  });
}

export function resetProfile(event) {
  return ({
    type: RESET_PROFILE,
    payload: {}
  });
}