export const UPDATE_DM_MESSAGE = 'displayedMessages:updateNewMessage';
export const RESET_DM_MESSAGE = 'displayedMessages:resetNewMessage';
export const SET_DM_RECEIVED = 'displayedMessages:setReceivedMessages';
export const SET_DM_SENT = 'displayedMessages:setSentMessages';
export const SET_DM_EDITOR = 'displayedMessages:setDisplayEditor';
export const RESET_DM_ALL = 'displayedMessages:resetAllMessages';
export const SET_DM_INDEX = 'displayedMessages:setInteractionIndex';
export const SET_DM_DISPLAYED = 'displayedMessages:setDisplayedMessage';

export function updateNewMessage(event) {
  return ({
    type: UPDATE_DM_MESSAGE,
    payload: {
      name: event.target.name,
      value: event.target.value
    }
  });
}

export function resetNewMessage(event) {
  return ({
    type: RESET_DM_MESSAGE,
    payload: { }
  });
}

export function setReceivedMessages(event) {
  return ({
    type: SET_DM_RECEIVED,
    payload: [...event]
  });
}

export function setSentMessages(event) {
  return ({
    type: SET_DM_SENT,
    payload: [...event]
  });
}

export function setDisplayEditor(bool) {
  return ({
    type: SET_DM_EDITOR,
    payload: bool
  });
}

export function resetAllMessages() {
  return ({
    type: SET_DM_EDITOR,
    payload: {}
  });
}

export function setInteractionIndex(code) {
  return ({
    type: SET_DM_INDEX,
    payload: code
  });
}

export function setDisplayedMessage(code) {
  return ({
    type: SET_DM_DISPLAYED,
    payload: code
  });
}