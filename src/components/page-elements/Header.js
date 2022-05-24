import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { logOut } from '../../actions/user-actions'
import { withCookies } from "react-cookie";
import { setToken } from "../../actions/auth-actions";
import 'materialize-css/dist/css/materialize.min.css'
import M from 'materialize-css'
import { setRedirect, updateDisplay, updateSearch } from "../../actions/displayed-services-actions";

export class Header extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.renderContent = this.renderContent.bind(this);
        this.handleButton = this.handleButton.bind(this);
    }

    handleClick() {
        let { cookies } = this.props
        this.props.onLogOut();
        this.props.onSetToken("");
        cookies.set("authToken", undefined, {path: "/"}); 
        cookies.set("authUser", undefined, {path:"/"});
    }

    handleChange(e) {
     this.props.onUpdateSearch(e.target.value) 
    }

    handleKeyPress(e) {
      let searchtext = this.props.displayedServices.search;
      if(e.key === "Enter") {
        fetch(`/services?search=${searchtext}&page=0&ipp=${this.props.displayedServices.ipp}`, {
          method: 'GET',
          headers: { 
            'Accept': '*/*',
            'Content-Type': 'application/json'
          }
        }).then(response => response.json()).then((e) => {
            if (e.type === "res") {
              this.props.onUpdateDisplay({
                services: [...e.value],
                page: 1,
                homeredirect: true
              })
            } else {
              alert(e.value);
            }
    
          }).catch((e)=> {
            console.log(e);
        });
      }
    }
    componentDidMount() {
      document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.sidenav');
        var instances = M.Sidenav.init(elems, {preventScrolling: true});
      });
    }

    handleButton() {
      this.props.onSetRedirect(false)
    }

    renderContent() {
      let notlogged = 
      <div>
        <div class="navbar-fixed">
            <nav>
              <div class="nav-wrapper row" style={{backgroundColor: "#00774f"}}>
                <a href="#" data-target="mobile-demo" class="sidenav-trigger col s1"><i class="material-icons">menu</i></a>
                <div class="col s10 m10 l6 offset-l3">
                  <input type="search" placeholder="Buscar..." onChange={this.handleChange} onKeyPress={this.handleKeyPress}></input>
                </div>
                <ul class="col l2 offset-l1 right hide-on-med-and-down">
                  <li><NavLink to="/signin" onClick={this.handleButton}>LogIn</NavLink></li>
                  <li><NavLink to="/signup" onClick={this.handleButton}>Registro</NavLink></li>
                </ul>
              </div>
            </nav>
          </div>
            <ul class="sidenav" id="mobile-demo">
              <li><NavLink to="/signin" onClick={this.handleButton}>LogIn</NavLink></li>
              <li><NavLink to="/signup" onClick={this.handleButton}>Registro</NavLink></li>
            </ul>
        
      </div>
      
      
      let logged = 
      <div>
        <div class="navbar-fixed">
          <nav>
            <div class="nav-wrapper row" style={{backgroundColor: "#00774f"}}>
              <a href="#" data-target="mobile-demo" class="sidenav-trigger col s1"><i class="material-icons">menu</i></a>
              <div class="col s10 m10 l6 offset-l3">
                <input type="search" placeholder="Buscar..." onChange={this.handleChange} onKeyPress={this.handleKeyPress}></input>
              </div>
              
              <ul class="col l3 right hide-on-med-and-down">
                <li><NavLink to="/" onClick={this.handleButton}>Mi cuenta</NavLink></li>
                <li><NavLink to="/servicePost" onClick={this.handleButton}>Publicar servicio</NavLink></li>                
                <li><a href="#" onClick={this.handleClick}>Cerrar Sesión</a></li>
              </ul>
            </div>
          </nav>
        </div>
        <ul class="sidenav" id="mobile-demo">
          <li><NavLink to="/" onClick={this.handleButton}>Mi cuenta</NavLink></li>
          <li><NavLink to="/servicePost" onClick={this.handleButton}>Publicar servicio</NavLink></li>  
          <li><a href="#" onClick={this.handleClick}>Cerrar Sesión</a></li>
        </ul>
      
      </div>

      if(this.props.currentUser.username === ""){
        return notlogged
      } else {
        return logged
      }
    }

    render() {
      return(this.renderContent())
    }
}

const mapStateToProps = (state, props) => {
    return ({
      currentUser: state.currentUser,
      auth: state.auth,
      displayedServices: state.displayedServices
    });
  }
  
  const mapActionsToProps = (dispatch, props) => {
    return bindActionCreators({
      onLogOut: logOut,
      onSetToken: setToken,
      onUpdateSearch: updateSearch,
      onUpdateDisplay: updateDisplay,
      onSetRedirect: setRedirect
    }, dispatch); 
  }
  
  export default withCookies(connect(mapStateToProps, mapActionsToProps)(Header));