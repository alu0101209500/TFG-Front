import { RESET_DM_ALL, RESET_DM_MESSAGE, SET_DM_DISPLAYED, SET_DM_EDITOR, SET_DM_INDEX, SET_DM_RECEIVED, SET_DM_SENT, UPDATE_DM_MESSAGE } from "../actions/displayed-messages-actions";

export default function displayedMessagesReducer(state = {
  newMessage: {
    to: "",
    subject: "",
    message: ""
  },
  received: [],
  sent: [],
  displayed: {},
  interactionIndex: ":",
  displayEditor: false}, {type, payload}) {
  let newState = {};
  switch (type) {
    case UPDATE_DM_MESSAGE:
      newState = {...state};
      if(newState.newMessage[payload.name] != undefined){
        newState.newMessage[payload.name] = payload.value;
      }
      return(newState);

    case RESET_DM_MESSAGE:
      newState = {...state};
      newState.newMessage = {};
      return(newState);

    case SET_DM_RECEIVED:
      newState = {...state};
      newState.received = [...payload];
      return(newState);

    case SET_DM_SENT:
      newState = {...state};
      newState.sent = [...payload];
      return(newState);

    case SET_DM_EDITOR:
      newState = {...state};
      newState.displayEditor = payload;
      return(newState);

    case RESET_DM_ALL:
      return({
        newMessage: {
          to: "",
          subject: "",
          message: ""
        },
        received: [],
        sent: [],
        displayed: {},
        interactionIndex:  ":",
        displayEditor: false
      });

    case SET_DM_INDEX:
      newState = {...state};
      newState.interactionIndex = payload;
      return(newState)

    case SET_DM_DISPLAYED:
      newState = {...state};
      let codeSource = payload.split(":")[0];
      let codeIndex = Number(payload.split(":")[1]);
      if(codeIndex >= 0) {
        if(codeSource == "sent" && codeIndex < state.sent.length) {
          newState.displayed = {...state.sent[codeIndex]}
        } else if (codeSource == "received" && codeIndex < state.received.length) {
          newState.displayed = {...state.received[codeIndex]}
        }
      }
      return(newState)

    default:
      return(state);
  }
}