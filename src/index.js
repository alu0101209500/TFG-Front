import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import currentUserReducer from './reducers/current-user-reducer';
import { CookiesProvider } from 'react-cookie'
import signUpReducer from './reducers/sign-up-reducer';
import signInReducer from './reducers/sign-in-reducer';
import authReducer from './reducers/auth-reducer';
import displayedServicesReducer from './reducers/displayed-services-reducer'
import servicePostReducer from './reducers/service-post-reducer';
import displayedProfileReducer from './reducers/displayed-profile-reducer';
import displayedMessagesReducer from './reducers/displayed-messages-reducer';

const allReducers = combineReducers({
  currentUser: currentUserReducer,
  signIn: signInReducer,
  signUp: signUpReducer,
  auth: authReducer,
  displayedServices: displayedServicesReducer,
  servicePost: servicePostReducer,
  displayedProfile: displayedProfileReducer,
  displayedMessages: displayedMessagesReducer
}); 

const store = createStore(allReducers, {
  displayedMessages : {
    newMessage: {
      to: "",
      subject: "",
      message: ""
    },
    displayed: {},
    interactionIndex: ":",
    received: [],
    sent: [],
    displayEditor: false
  },
  displayedProfile : {
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
  },
  currentUser: {
    username : "",
    fullname : "",
    email : "",
    registration : 0,
    icon: ""
  },
  signIn: {
    username : "",
    password : "",
    msg: ""
  },
  signUp: {
    username : "",
    password : "",
    name: "",
    secondname: "",
    email : "", 
    passwordRepeat : "",
    register: false,
    validUser : "",
    validPassword : "",
    validEmail : ""
  },
  auth: {
    authToken: ""
  }, 
  displayedServices: {
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
  },
  servicePost: {
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
  }
},

window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

); 

ReactDOM.render(
  //<React.StrictMode>
  <CookiesProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </CookiesProvider>,
  

  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
