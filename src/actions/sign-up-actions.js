export const UPDATE_SU_FORM = 'signUp:updateSignUpForm';
export const RESET_SU_FORM = 'signUp:resetSignUpForm';
export const UPDATE_SU_MSG = 'signUp:updateSignUpMessage';

export function updateSignUpForm(event) {
  return ({
    type: UPDATE_SU_FORM,
    payload: {
      name: event.target.name,
      value: event.target.value
    }
  });
}

export function resetSignUpForm() {
  return ({
    type: RESET_SU_FORM,
    payload: { }
  });
}

export function updateSignUpMessage(message) {
  return ({
    type: UPDATE_SU_MSG,
    payload: {
      validUser : message.validUser,
      validPassword : message.validPassword,
      validEmail : message.validEmail
    }
  });
}