import SignIn from './SignIn';
import SignUp from './SignUp';
import Header from './page-elements/Header';
import Footer from './page-elements/Footer';
import Homepage from './Homepage';
import Service from './Service';
import ServiceCreation from './ServiceCreation'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setToken } from '../actions/auth-actions';
import { withCookies } from 'react-cookie';
import { setUser } from '../actions/user-actions';
import { updateDisplay } from '../actions/displayed-services-actions';
import AdvancedSearch from './AdvancedSearch';
import Profile from './Profile';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

    fetch(`/services/search`, {
      method: 'POST',
      headers: { 
        'Accept': '*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        search: this.props.displayedServices.search,
        page:this.props.displayedServices.page,
        ipp: this.props.displayedServices.ipp
      })
    }).then(response => response.json()).then((e) => {
        if (e.type === "res") {
          this.props.onUpdateDisplay({
            services: [...e.value],
            page: 1
          })
        } else {
          alert(e.value)
        }

      }).catch((e)=> {
        console.log(e);
    });
    
    const { cookies } = this.props;
    let authToken = cookies.get("authToken");
    let authUser = cookies.get("authUser");
    if(authToken && authUser){
      let requestOptions = {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${authToken}`
        }
      }

      fetch(`/user`, requestOptions).then(response => response.json()).then((e) => {
          if (e.type === "res") {
            this.props.onSetUser(e);
            this.props.onSetToken(cookies.get("authToken"));
          } else {
            cookies.set("authToken", undefined, {path:"/"});
            cookies.set("authUser", undefined, {path:"/"});
          }

        }).catch((e)=> {
          console.log(e);
      });
    } else {
      cookies.set("authToken", undefined, {path:"/"});
      cookies.set("authUser", undefined, {path:"/"});
    }
  }

  render() {
    return (
      <Router>
        <Header />
        <Routes>
          <Route exact path="/" element={<Homepage props={{username: this.props.currentUser.username}}/>} />
          <Route path="/signin" element={<SignIn props={{username: this.props.currentUser.username, redirect: this.props.displayedServices.homeredirect}}/>} />
          <Route path="/signup" element={<SignUp props={{username: this.props.currentUser.username, redirect: this.props.displayedServices.homeredirect}}/>} />
          <Route path="/service" element={<Service props={{username: this.props.currentUser.username}}/>} />
          <Route path="/servicePost" element={<ServiceCreation props={{username: this.props.currentUser.username, redirect: this.props.displayedServices.homeredirect}}/>} />
          <Route path="/advancedSearch" element={<AdvancedSearch props={{redirect: this.props.displayedServices.homeredirect}}/>} />
          <Route path="/profilePage" element={<Profile props={{redirect: this.props.displayedServices.homeredirect}}/>} />
        </Routes>
        <Footer />
      </Router>
    );
  }

}


const mapStateToProps = (state, props) => {
  return ({
    auth: state.auth,
    currentUser: state.currentUser,
    displayedServices: state.displayedServices
  });
}

const mapActionsToProps = (dispatch, props) => {
  return bindActionCreators({
    onSetToken: setToken,
    onSetUser: setUser,
    onUpdateDisplay: updateDisplay
  }, dispatch); 
}

export default withCookies(connect(mapStateToProps, mapActionsToProps)(App));
