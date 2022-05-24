export const UPDATE_SI_FORM = 'signIn:updateSignInForm';
export const RESET_SI_FORM = 'signIn:resetSignInForm';
export const UPDATE_SI_MSG = 'signIn:updateSignInMessage';

export function updateSignInForm(event) {
  return ({
    type: UPDATE_SI_FORM,
    payload: {
      name: event.target.name,
      value: event.target.value
    }
  });
}

export function resetSignInForm() {
  return ({
    type: RESET_SI_FORM,
    payload: { }
  });
}

export function updateSignInMessage(message) {
  return ({
    type: UPDATE_SI_MSG,
    payload: {
      msg: message
    }
  });
}