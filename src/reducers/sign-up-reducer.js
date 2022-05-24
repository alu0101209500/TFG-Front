import { UPDATE_SU_FORM, RESET_SU_FORM, UPDATE_SU_MSG } from "../actions/sign-up-actions";

export default function signUpReducer(state = {username : "",
password : "",
email : "",
name: "",
secondname: "", 
passwordRepeat : "",
register: false,
validUser : "",
validPassword : "",
validEmail : "" }, {type, payload}) {
  let newState = {};
  switch (type) {
    case UPDATE_SU_FORM:
      newState = {...state};
      if(newState[payload.name] != undefined){
        newState[payload.name] = payload.value;
      }
      return(newState);

    case RESET_SU_FORM:
      return({
        username : "",
        password : "",
        email : "", 
        passwordRepeat : "",
        register: false,
        validUser : "",
        validPassword : "",
        validEmail : ""
      });
    
    case UPDATE_SU_MSG:
      newState = {...state};
      newState.validUser = payload.validUser === undefined ? newState.validUser : payload.validUser;
      newState.validPassword = payload.validPassword === undefined ? newState.validPassword : payload.validPassword;
      newState.validEmail = payload.validEmail === undefined ? newState.validEmail : payload.validEmail;
      return(newState);
    
    default:
      return(state); 
  }
} 