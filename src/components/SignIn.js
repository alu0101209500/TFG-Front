import React from 'react';
import LoginForm from "./page-elements/LoginForm";
import Main from "./page-elements/Main";
import { Navigate } from 'react-router'

function SignIn(props) {
  if(props.props.username === "" && props.props.redirect == false){
    return (
      <div>
        <Main>
          <br />
          <LoginForm />
        </Main>
      </div>
    );
  } else {
    return(<Navigate to="/"/>)
  }
}

export default SignIn;