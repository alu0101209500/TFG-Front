import { UPDATE_SP_FORM, RESET_SP_FORM, ADD_SP_IMAGE, RESET_SP_IMAGE } from "../actions/service-post-actions";

export default function servicePostReducer(state = {serviceName: "",
serviceDescription: "",
images: [],
finished: false}, {type, payload}) {
  let newState = {};
  switch (type) {
    case UPDATE_SP_FORM:
      newState = {...state};
      if(newState[payload.name] != undefined){
        newState[payload.name] = payload.value;
      }
      return(newState);

    case RESET_SP_FORM:
      return({
        serviceName: "",
        serviceDescription: "",
        images: [],
        finished: false
      });
    
    case ADD_SP_IMAGE:
      newState = {...state};
      if(payload.img != undefined) {
          newState.images.push(payload.img)
      }
      return(newState);

    case RESET_SP_IMAGE:
      newState = {...state};
      newState.images = []
      return(newState);
    
    default:
      return(state);
  }
} 