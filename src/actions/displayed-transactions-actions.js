export const UPDATE_DT_INPUT = 'displayedTransactions:updateInput';
export const RESET_DT_INPUT = 'displayedTransactions:resetInput';
export const SET_DT_MESSAGE = 'displayedTransactions:setServerMessage';
export const SET_DT_TRANSACTIONS = 'displayedTransactions:setTransactions';
export const RESET_DT_ALL = 'displayedTransactions:resetAllTransactions';
export const SET_DT_INDEX = 'displayedTransactions:setTransactionsInteractionIndex';

export function updateInput(event) {
  return ({
    type: UPDATE_DT_INPUT,
    payload: {
      name: event.target.name,
      value: event.target.value
    }
  });
}

export function resetInput(event) {
  return ({
    type: RESET_DT_INPUT,
    payload: { }
  });
}

export function setServerMessage(event) {
  return ({
    type: SET_DT_MESSAGE,
    payload: [...event]
  });
}

export function setTransactions(event) {
  return ({
    type: SET_DT_TRANSACTIONS,
    payload: [...event]
  });
}

export function resetAllTransactions() {
  return ({
    type: RESET_DT_ALL,
    payload: { }
  });
}

export function setTransactionsInteractionIndex(code) {
  return ({
    type: SET_DT_INDEX,
    payload: code
  });
}