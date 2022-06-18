import React from 'react';
import AdvancedSearchForm from "./page-elements/AdvancedSearchForm";
import Main from "./page-elements/Main";
import { Navigate } from 'react-router'

function AdvancedSearch(props) {
  if(props.props.redirect == false){
    return (
      <div>
        <Main>
          <br />
          <AdvancedSearchForm />
        </Main>
      </div>
    );
  } else {
    return(<Navigate to="/"/>)
  }
}

export default AdvancedSearch;