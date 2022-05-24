import { SET_TOKEN } from "../actions/auth-actions";

export default function authReducer(state = {authToken: ""}, {type, payload}) {  
  if (type == SET_TOKEN) {
    return(payload);
  } else {
    return(state);
  }
} 