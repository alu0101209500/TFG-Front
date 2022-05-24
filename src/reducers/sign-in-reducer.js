import { UPDATE_SI_FORM, RESET_SI_FORM, UPDATE_SI_MSG } from '../actions/sign-in-actions'

export default function signInReducer(state = {username : "",
password : "",
msg: ""}, {type, payload}) {
  let newState = {};
  switch (type) {
    case UPDATE_SI_FORM:
      newState = {...state};
      if(newState[payload.name] != undefined){
        newState[payload.name] = payload.value;
      }
      return(newState);

    case RESET_SI_FORM:
      return({
        username : "",
        password : "",
        msg: ""
      });
    
    case UPDATE_SI_MSG:
      newState = {...state};
      newState.msg = payload.msg;
      return(newState);
    
    default:
      return(state);
  }
} 