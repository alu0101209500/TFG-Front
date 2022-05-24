export const UPDATE_DS_DISPLAY = 'displayedServices:updateDisplay';
export const ADD_DS_CONTENT = 'displayedServices:addContent';
export const UPDATE_DS_SEARCH = 'displayedServices:updateSearch';
export const RESET_DS_SEARCH = 'displayedServices:resetSearch';
export const UPDATE_DS_SERVICE = 'displayedServices:updateDisplayedService';
export const SET_REDIRECT = 'displayedServices:setRedirect';

export function updateDisplay(event) {
  return ({
    type: UPDATE_DS_DISPLAY,
    payload: {
      ...event
    }
  });
}

export function addContent(event) {
  return ({
    type: ADD_DS_CONTENT,
    payload: {
      services: [...event]
    }
  });
}

export function updateSearch(event) {
  return ({
    type: UPDATE_DS_SEARCH,
    payload: {
      search: String(event)
    }
  });
}

export function resetSearch() {
  return ({
    type: RESET_DS_SEARCH,
    payload: {}
  });
}

export function updateDisplayedService(event) {
  return ({
    type: UPDATE_DS_SERVICE,
    payload: {_id: String(event)}
  });
}

export function setRedirect(bool) {
  return ({
    type: SET_REDIRECT,
    payload: bool
  })
}
