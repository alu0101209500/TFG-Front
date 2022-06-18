export const UPDATE_SP_FORM = 'displayedServices:updateServiceForm';
export const RESET_SP_FORM = 'displayedServices:resetServiceForm';
export const ADD_SP_IMAGE = 'displayedServices:addImage';
export const RESET_SP_IMAGE = 'displayedServices:resetImage';
export const CHANGE_TAG = 'displayedServices:changeTag';

export function updateServiceForm(event) {
  return ({
    type: UPDATE_SP_FORM,
    payload: {
      name: event.target.name,
      value: event.target.value
    }
  });
}

export function resetServiceForm() {
  return ({
    type: RESET_SP_FORM,
    payload: { }
  });
}

export function addImage(event) {
    return ({
      type: ADD_SP_IMAGE,
      payload: {
        img: String(event)
      }
    });
  }
  
  export function resetImage() {
    return ({
      type: RESET_SP_IMAGE,
      payload: { }
    });
  }

  export function changeTag(event) {
    return ({
      type: CHANGE_TAG,
      payload: {
        name: event.target.value,
        value: event.target.checked
      }
    })
  }