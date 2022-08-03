import { UPDATE_SP_FORM, RESET_SP_FORM, ADD_SP_IMAGE, RESET_SP_IMAGE, CHANGE_TAG } from "../actions/service-post-actions";

export default function servicePostReducer(state = {serviceName: "",
serviceDescription: "",
images: [],
price: "",
priceType: "Total",
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
},
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
        price: "",
        priceType: "Total",
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
        },
        finished: false
      });
    
    case ADD_SP_IMAGE:
      newState = {...state};
      if(payload.img != undefined) {
          newState.images = payload.img
      }
      return(newState);

    case RESET_SP_IMAGE:
      newState = {...state};
      newState.images = []
      return(newState);

    case CHANGE_TAG:
      newState = {...state}
      if(payload.name != undefined && payload.value != undefined) {
        newState.tags[payload.name] = payload.value
      }
      return newState
    
    default:
      return(state);
  }
} 