import { RESET_DT_ALL, RESET_DT_INPUT, SET_DT_INDEX, SET_DT_MESSAGE, SET_DT_TRANSACTIONS, UPDATE_DT_INPUT } from "../actions/displayed-transactions-actions";

export default function displayedTransactionsReducer(state = {
  inputFields: {
    aplicantNotes: "",
    proprietaryNotes: "",
    finalPayment: 0,
    firstPayment: 0,
  punctuation: 5,
  },
  responseMsg: "",
  interactionIndex: 0,
  transactions: []}, {type, payload}) {
  let newState = {};
  switch (type) {
    case UPDATE_DT_INPUT:
      newState = {...state};
      if(newState.inputFields[payload.name] != undefined){
        newState.inputFields[payload.name] = payload.value;
      }
      return(newState);

    case RESET_DT_INPUT:
      newState = {...state};
      newState.inputFields = {aplicantNotes: "",
      proprietaryNotes: "",
      finalPayment: 0,
      firstPayment: 0,
      punctuation: 5};
      return(newState);

    case SET_DT_MESSAGE:
      newState = {...state};
      newState.responseMsg = payload;
      return(newState);

    case SET_DT_TRANSACTIONS:
      newState = {...state};
      newState.transactions = [...payload];
      return(newState);

    case RESET_DT_ALL:
      return({
        inputFields: {
          aplicantNotes: "",
          proprietaryNotes: "",
          finalPayment: 0,
          firstPayment: 0,
        punctuation: 5,
        },
        responseMsg: "",
        interactionIndex: 0,
        transactions: []
      });

    case SET_DT_INDEX:
      newState = {...state};
      console.log(payload)
      newState.interactionIndex = Number(payload);
      return(newState)

    default:
      return(state);
  }
}