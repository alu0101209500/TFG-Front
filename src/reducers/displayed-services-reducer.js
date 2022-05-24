import { UPDATE_DS_DISPLAY, ADD_DS_CONTENT, UPDATE_DS_SEARCH, RESET_DS_SEARCH, UPDATE_DS_SERVICE, SET_REDIRECT } from '../actions/displayed-services-actions'

export default function displayedServicesReducer(state = {
    services: [],
    page: 0,
    ipp: 20,
    search: "",
    displayed: {},
    homeredirect: false}, {type, payload}) {
  let newState = {};
  switch (type) {
    case UPDATE_DS_DISPLAY:
      newState = {
        services: [],
        page: 0,
        ipp: 20,
        search: "",
        displayed: {},
        homeredirect: false
      };
      let aux = {...payload};
      if(Array.isArray(aux.services)){
        newState.services = [...aux.services];    
      }
      if(aux.page != undefined)
        newState.page = Number(aux.page);
      if(aux.ipp != undefined)
        newState.ipp = aux.ipp;
      if(aux.homeredirect != undefined)
        newState.homeredirect = aux.homeredirect;
      
      return(newState);
    
    case ADD_DS_CONTENT:
      newState = {...state}
      if(Array.isArray(payload.services)) {
        for(let i in payload.services){
          newState.services.push({...payload.services[i]})
        }
      }
      newState.page ++;
      return(newState);

    case UPDATE_DS_SEARCH:
      newState = {...state}
      newState.search = payload.search
      return(newState);

    case RESET_DS_SEARCH:
      newState = {...state}
      newState.search = "";
      return(newState);

    case UPDATE_DS_SERVICE:
      newState = {...state}
      if(payload._id == "") {
        newState.displayed = {}
      } else {
        for(let i in newState.services) {
          if(newState.services[i]._id == payload._id) {
            newState.displayed = {...newState.services[i]}
          }
        }
      }
      return(newState);

    case SET_REDIRECT:
      newState = {...state}
      newState.homeredirect = payload
      return(newState);
        


    default:
      return(state);
  }
}