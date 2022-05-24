import React from 'react';
import ServiceForm from "./page-elements/ServiceForm";
import Main from "./page-elements/Main";
import { Navigate } from 'react-router'

function ServiceCreation(props) {
  if(props.props.username !== "" && props.props.redirect == false){
    return (
      <div>
        <Main>
          <br />
          <ServiceForm />
        </Main>
      </div>
    );
  } else {
    return(<Navigate to="/"/>)
  }
}

export default ServiceCreation;