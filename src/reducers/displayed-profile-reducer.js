import { RESET_PROFILE, SET_PROFILE } from "../actions/displayed-profile-actions";

export default function displayedProfileReducer(state = {
    username : "", 
    fullname : "",
    email : "",
    registration : 0,
    reviewNumber : 0,
    reviewScore: 0,
    icon: "",
    description: "",
    newIcon: "",
    newDescription: ""}, {type, payload}) {
  let newState = {};
  switch (type) {
    case SET_PROFILE:
      newState = {
        username : "", 
        fullname : "",
        email : "",
        registration : 0,
        reviewNumber : 0,
        reviewScore: 0,
        icon: "",
        description: "",
        userServices: [],
        newIcon: "",
        newDescription: ""
      };
      
      for(let i in newState) {
        newState[i] = payload[i]
      }
      return(newState)

    case RESET_PROFILE:
      return({
        username : "", 
        fullname : "",
        email : "",
        registration : 0,
        reviewNumber : 0,
        reviewScore: 0,
        icon: "",
        description: "",
        userServices: [],
        newIcon: "",
        newDescription: ""
      });

    default:
      return(state);
  }
}