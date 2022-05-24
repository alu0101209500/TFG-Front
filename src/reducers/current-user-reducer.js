import { LOG_OUT, SET_USER } from "../actions/user-actions";

export default function signUpReducer(state = {username : "",
fullname : "",
email : "",
registration : 0}, {type, payload}) {
  switch (type) {
    case SET_USER:
      return(payload);
    
    case LOG_OUT: 
      return({
        username : "",
        fullname : "",
        email : "",
        registration : 0
      });
  
    default:
      return(state);
  }
} 