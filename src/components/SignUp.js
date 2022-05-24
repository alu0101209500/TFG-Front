import React from 'react';
import Main from "./page-elements/Main";
import SignUpForm from "./page-elements/SignUpForm";
import { Navigate } from 'react-router'

function SignUp(props) {
  if(props.props.username === "" && props.props.redirect == false){
    return (
      <div>
        <Main>
          <SignUpForm />
        </Main>
      </div>
    );
  } else {
    return(<Navigate to="/"/>)
  }
}

export default SignUp;