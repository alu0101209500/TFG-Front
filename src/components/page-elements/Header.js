import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { logOut } from '../../actions/user-actions'
import { withCookies } from "react-cookie";
import { setToken } from "../../actions/auth-actions";
import 'materialize-css/dist/css/materialize.min.css'
import M from 'materialize-css'
import { resetFilters, setRedirect, updateDisplay, updateSearch } from "../../actions/displayed-services-actions";
import { setProfile } from "../../actions/displayed-profile-actions";

const baseimg = "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";

export class Header extends React.Component {
    constructor(props) {
        super(props);
        this.dropdownInstances = undefined;
        this.sidenavInstances = undefined;
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.renderContent = this.renderContent.bind(this);
        this.handleButton = this.handleButton.bind(this);
        this.loadProfile = this.loadProfile.bind(this);
    }
    loadProfile() {
      let requestOptions = {
          method: 'GET',
          headers: { 
              'Accept': '*/*'
          }
      }
      let that = this;
      //setTimeout(() => {
        fetch(`/profile?username=${that.props.currentUser.username}`, requestOptions).then(response => response.json()).then((e) => {         
                if(e.type == "res") {
                  that.props.onSetProfile(e.value);
                } else {
                  console.log(JSON.stringify(e))
                }
            }).catch((e)=> {
                console.log(e);
                that.props.onLogOut();
            });
      //}, 100)
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
      this.props.onResetFilters();
      let searchtext = this.props.displayedServices.search;
      if(e.key === "Enter") {
        fetch(`/services/search`, {
          method: 'POST',
          headers: { 
            'Accept': '*/*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            search: searchtext,
            page: "0",
            ipp: this.props.displayedServices.ipp
          })
        }).then(response => response.json()).then((e) => {
            if (e.type === "res") {
              this.props.onUpdateDisplay({
                services: [...e.value],
                page: 1,
                search: searchtext,
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
    componentDidUpdate() {
      let that = this;
      setTimeout(() => {
        let elems = document.querySelectorAll('.sidenav');
        that.sidenavInstances = M.Sidenav.init(elems, {preventScrolling: false}); //preventScrolling: true
        if(that.props.currentUser.username !== ""){
          elems = document.querySelectorAll('.dropdown-trigger');
          that.dropdownInstances = M.Dropdown.init(elems, {alignment: "right", constrainWidth: false, coverTrigger: false});
        }
      }, 500)      
    }
    componentDidMount() {
      let that = this;
      setTimeout(() => {
        let elems = document.querySelectorAll('.sidenav');
        that.sidenavInstances = M.Sidenav.init(elems, {preventScrolling: false}); //preventScrolling: true
        if(that.props.currentUser.username !== ""){
          elems = document.querySelectorAll('.dropdown-trigger');
          that.dropdownInstances = M.Dropdown.init(elems, {alignment: "right", constrainWidth: false, coverTrigger: false});
        }
      }, 500)
        
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
              <div class="col s10 m10 l5 offset-l3">
                <input type="search" placeholder="Buscar..." onChange={this.handleChange} onKeyPress={this.handleKeyPress} style={{color: "white"}}></input>
              </div>
              <ul class="col l2 hide-on-med-and-down">
                <li><NavLink to="/advancedSearch" onClick={this.handleButton}>Búsqueda avanzada</NavLink></li>
              </ul>
              <ul class="col l2 right hide-on-med-and-down">
                <li><NavLink to="/signin" onClick={this.handleButton}>LogIn</NavLink></li>
                <li><NavLink to="/signup" onClick={this.handleButton}>Registro</NavLink></li>
              </ul>
            </div>
          </nav>
        </div>

        <ul class="sidenav" id="mobile-demo">
          <li><NavLink to="/signin" onClick={this.handleButton}>LogIn</NavLink></li>
          <li><NavLink to="/signup" onClick={this.handleButton}>Registro</NavLink></li>
          <li><NavLink to="/advancedSearch" onClick={this.handleButton}>Búsqueda avanzada</NavLink></li>
          <li><a href="#" type="button" onClick={this.handleClick}>Cerrar Sesión</a></li>
        </ul>

        <ul class="col l2 right hide-on-med-and-down dropdown-trigger" data-target='dropdown1' style={{width: "auto", height: "64px", display: "none"}}/>
        <ul id='dropdown1' class='dropdown-content'></ul>
      </div>
      
      
      let logged = 
      <div>
        <div class="navbar-fixed">
          <nav>
          
            <div class="nav-wrapper row" style={{backgroundColor: "#00774f"}}>
              <a href="#" data-target="mobile-demo" class="sidenav-trigger col s1"><i class="material-icons">menu</i></a>
              <div class="col s10 m10 l5 offset-l3">
                <input type="search" placeholder="Buscar..." onChange={this.handleChange} onKeyPress={this.handleKeyPress} style={{color: "white"}}></input>
              </div>
              <ul class="col l2 hide-on-med-and-down">
                <li><NavLink to="/advancedSearch" onClick={this.handleButton}>Búsqueda avanzada</NavLink></li>
              </ul>
              <ul class="col l2 right hide-on-med-and-down dropdown-trigger" data-target='dropdown1' style={{width: "auto", height: "64px"}}>
                  <li>
                    <p style={{lineHeight: "7px", fontWeight: "400", marginTop: "25%"}}>{this.props.currentUser.username}</p>
                  </li>
                  <li>
                    <img src={"data:image/png;base64," + this.props.currentUser.icon} alt="" class="circle" style={{width: "42px", height: "42px", marginTop: "25%", marginLeft: "5px"}}/>
                  </li>
              </ul>
            </div>
          </nav>
        </div>

        

        <ul class="sidenav" id="mobile-demo">
          <ul class="collection">
            <li class="collection-item avatar" style={{backgroundColor: "#f0fff8"}}>
              <img src={"data:image/png;base64," + this.props.currentUser.icon} alt="" class="circle"/>
              <span class="title">{this.props.currentUser.username}</span>
              <NavLink to="/profilePage" onClick={this.loadProfile}>Mi perfil</NavLink>
              <NavLink to="/transactionsPage" onClick={this.handleButton}>Mis transacciones</NavLink>
              <NavLink to="/messagesPage" onClick={this.handleButton}>Mis mensajes</NavLink>
            </li>
          </ul>
          <li><NavLink to="/advancedSearch" onClick={this.handleButton}>Búsqueda avanzada</NavLink></li>
          <li><NavLink to="/servicePost" onClick={this.handleButton}>Publicar servicio</NavLink></li>  
          <li><a href="#" type="button" onClick={this.handleClick}>Cerrar Sesión</a></li>
        </ul>


        <ul id='dropdown1' class='dropdown-content'>
          <li><NavLink to="/profilePage"><a tabindex="-1" href="#" type="button" class="nohovering" onClick={this.loadProfile} style={{color: "#26a69a"}}>Mi perfil</a></NavLink></li>
          <li><NavLink to="/transactionsPage"><a tabindex="-1" href="#" type="button" class="nohovering" onClick={this.handleButton} style={{color: "#26a69a"}}>Mis transacciones</a></NavLink></li>
          <li><NavLink to="/messagesPage"><a tabindex="-1" href="#" type="button" class="nohovering" onClick={this.handleButton} style={{color: "#26a69a"}}>Mis mensajes</a></NavLink></li>
          <li class="divider" tabindex="-1"></li>
          <li><NavLink to="/servicePost"><a tabindex="-1" href="#" type="button" class="nohovering" onClick={this.handleButton} style={{color: "#26a69a"}}>Publicar servicio</a></NavLink></li>
          <li class="divider" tabindex="-1"></li>
          <li><a href="#" type="button" onClick={this.handleClick}>Cerrar Sesión</a></li>
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
      onSetRedirect: setRedirect,
      onResetFilters: resetFilters,
      onSetProfile: setProfile
    }, dispatch); 
  }
  
  export default withCookies(connect(mapStateToProps, mapActionsToProps)(Header));