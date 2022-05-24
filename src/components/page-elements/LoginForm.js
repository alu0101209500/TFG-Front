import React from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateSignInForm, resetSignInForm, updateSignInMessage } from '../../actions/sign-in-actions'
import { setUser, logOut } from '../../actions/user-actions'
import { withCookies } from "react-cookie";
import { setToken } from "../../actions/auth-actions";
import 'materialize-css/dist/css/materialize.min.css'
import M from 'materialize-css'

export class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(e) {
    if(e.key === "Enter") {
      this.handleClick();
    }
  }

  handleChange(e) {
    console.log(e)
    this.props.onUpdateSignInForm(e);
  }

  handleClick() {
    let chain = this.props.signIn.username + ":" + this.props.signIn.password
    let b64chain = window.btoa(unescape(encodeURIComponent( chain )));
    const { cookies } = this.props;

    let requestOptions = {
      method: 'POST',
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${b64chain}`
      }
    }

    fetch("/users/auth", requestOptions).then(response => response.json()).then((e) => {
        if (e.status === "true") {
          this.props.onUpdateSignInMessage("");
          this.props.onSetUser(e);
          if(e.authToken) {
            cookies.set("authToken", e.authToken, {path: "/"}); 
            cookies.set("authUser", e.username, {path: "/"});
            this.props.onSetToken(cookies.get("authToken"));
          }
        } else {
          this.props.onUpdateSignInMessage(e.msg);
        }

      }).catch((e)=> {
        alert(e);
    });
  }

  componentDidMount() {
    M.updateTextFields();
  }

  render() {
      return (
        <div class="container">
          <h1 class="center" style={{fontSize: "30px"}}>Inicio de sesión</h1>
          <div class="row">
            <form class="col s12">
              <div class="row">
                <div class="input-field col s12">
                  <input placeholder="Introduzca su usuario" id="usuario" type="text" name="username" class="" onChange={this.handleChange}/>
                  <label for="usuario">Usuario</label>
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
                  <input placeholder="Introduzca su contraseña" id="contrasena" type="password" name="password" class="" onChange={this.handleChange} onKeyPress={this.handleKeyPress}/>
                  <label for="contrasena">Contraseña</label>
                  <span class="helper-text">{this.props.signIn.msg}</span>
                </div>
              </div>
            </form>
            <br/>
            <div class="row">
              <a class="waves-effect waves-light btn col s12" onClick={this.handleClick}>Iniciar sesión</a>
            </div>
          </div>
        </div>
    );/*
    return (
      <form className="Login">
        <h2 style={{
          color: "white"
        }}>Introduzca sus datos:</h2>
        <input type="text" placeholder="Usuario" name="username" onChange={this.handleChange}></input>
        <input type="password" placeholder="Contraseña" name= "password" onChange={this.handleChange} onKeyPress={this.handleKeyPress}></input>
        <button type="button" className="greenbutton" onClick={this.handleClick}>Enviar</button>
        <br></br>
        <p>{this.props.signIn.msg}</p>
      </form>      
    );*/
  }
}

const mapStateToProps = (state, props) => {
  return ({
    currentUser: state.currentUser,
    signIn: state.signIn,
    auth: state.auth
  });
}

const mapActionsToProps = (dispatch, props) => {
  return bindActionCreators({
    onUpdateSignInForm: updateSignInForm,
    onResetSignInForm: resetSignInForm,
    onUpdateSignInMessage: updateSignInMessage,
    onSetUser: setUser,
    onLogOut: logOut,
    onSetToken: setToken
  }, dispatch); 
}

export default withCookies(connect(mapStateToProps, mapActionsToProps)(LoginForm));