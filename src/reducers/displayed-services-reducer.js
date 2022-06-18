import { UPDATE_DS_DISPLAY, ADD_DS_CONTENT, UPDATE_DS_SEARCH, RESET_DS_SEARCH, UPDATE_DS_SERVICE, SET_REDIRECT, UPDATE_DS_FILTERS_TAGS, UPDATE_DS_FILTERS, RESET_DS_FILTERS, SET_DS_SERVICE, SET_PFP } from '../actions/displayed-services-actions'

export default function displayedServicesReducer(state = {
    services: [],
    page: 0,
    ipp: 20,
    search: "",
    filters: {
      datefrom: "",
      dateto: "",
      pricefrom: "",
      priceto: "",
      priceType: "",
      tags: {
        "Diseño web": false,
        "Software": false,
        "Traducción": false,
        "Trámites legales": false,
        "Redacción": false,
        "Correcciones": false,
        "Composición musical": false,
        "Ilustración": false,
        "Modelado 3D": false,
        "Edición de vídeos": false,
        "Edición de imágenes": false,
        "Márketing": false,
        "Asesoría": false,
        "Idiomas": false,
        "Otro": false
      }
    },
    displayedIcon: "",
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
        filters: {
          datefrom: "",
          dateto: "",
          pricefrom: "",
          priceto: "",
          priceType: "",
          tags: {
            "Diseño web": false,
            "Software": false,
            "Traducción": false,
            "Trámites legales": false,
            "Redacción": false,
            "Correcciones": false,
            "Composición musical": false,
            "Ilustración": false,
            "Modelado 3D": false,
            "Edición de vídeos": false,
            "Edición de imágenes": false,
            "Márketing": false,
            "Asesoría": false,
            "Idiomas": false,
            "Otro": false
          }
        },
        displayedIcon: "",
        displayed: {},
        homeredirect: false
      };
      let aux = {...payload};
      if(Array.isArray(aux.services)){
        newState.services = [...aux.services];    
      }
      if(aux.search != undefined)
        newState.search = String(aux.search);
      if(aux.page != undefined)
        newState.page = Number(aux.page);
      if(aux.ipp != undefined)
        newState.ipp = aux.ipp;
      if(aux.homeredirect != undefined)
        newState.homeredirect = aux.homeredirect;
      if(aux.filters != undefined)
        newState.filters = {...aux.filters};
      
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
    
    case UPDATE_DS_FILTERS:
      newState = {...state};
      if(newState.filters[payload.name] != undefined){
        newState.filters[payload.name] = payload.value;
      }
      return(newState);

    case RESET_DS_FILTERS:
      newState = {...state};
      newState.filters = {
        datefrom: "",
        dateto: "",
        pricefrom: "",
        priceto: "",
        priceType: "",
        tags: {
          "Diseño web": false,
          "Software": false,
          "Traducción": false,
          "Trámites legales": false,
          "Redacción": false,
          "Correcciones": false,
          "Composición musical": false,
          "Ilustración": false,
          "Modelado 3D": false,
          "Edición de vídeos": false,
          "Edición de imágenes": false,
          "Márketing": false,
          "Asesoría": false,
          "Idiomas": false,
          "Otro": false
        }
      }
      return(newState);
      
    case UPDATE_DS_FILTERS_TAGS:
      newState = {...state}
      if(payload.name != undefined && payload.value != undefined) {
        newState.filters.tags[payload.name] = payload.value
      }
      return newState

    case SET_PFP:
      newState = {...state};
      newState.displayedIcon = payload.img;
      return newState;

    case SET_DS_SERVICE:
      newState = {...state}
      newState.displayed = {...payload}
      return newState

    default:
      return(state);
  }
}