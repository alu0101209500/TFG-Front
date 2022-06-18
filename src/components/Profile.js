import React from "react";
import Main from "./page-elements/Main";
import { Link, NavLink, Navigate } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withCookies } from "react-cookie";
import { setDisplayedService, setRedirect, updateDisplayedService } from "../actions/displayed-services-actions";
import 'materialize-css/dist/css/materialize.min.css'
import M from 'materialize-css'
import { setProfile } from "../actions/displayed-profile-actions";
import { setUser } from "../actions/user-actions";


function bilinealScale(modCtx) {
  let scaleX = 250/modCtx.width;
  let scaleY = 250/modCtx.height;
  let newX = Math.trunc(modCtx.width * Number(scaleX));
  let newY = Math.trunc(modCtx.height * Number(scaleY));
  let modImgData = modCtx.getImageData(0, 0, modCtx.width, modCtx.height);

  let result = new ImageData(newX, newY);
  let currentPosition = 0;


  for (let i = 0; i < newY; i++) {
      for (let j = 0; j < newX; j++) {
          currentPosition = (i * newX + j) * 4;
          let X = Math.trunc(j * (1 / scaleX));
          let Y = Math.trunc(i * (1 / scaleY));
          let X1 = X+1;
          let Y1 = Y+1;
          let p = (j * (1 / scaleX)) - X;
          let q = (i * (1 / scaleY)) - Y;
          let Ar = modImgData.data[((Y1 * modImgData.width + X)*4)];
          let Br = modImgData.data[((Y1 * modImgData.width + X1)*4)];
          let Cr = modImgData.data[((Y * modImgData.width + X)*4)];
          let Dr = modImgData.data[((Y * modImgData.width + X1)*4)];
          let Ag = modImgData.data[((Y1 * modImgData.width + X)*4)+1];
          let Bg = modImgData.data[((Y1 * modImgData.width + X1)*4)+1];
          let Cg = modImgData.data[((Y * modImgData.width + X)*4)+1];
          let Dg = modImgData.data[((Y * modImgData.width + X1)*4)+1];
          let Ab = modImgData.data[((Y1 * modImgData.width + X)*4)+2];
          let Bb = modImgData.data[((Y1 * modImgData.width + X1)*4)+2];
          let Cb = modImgData.data[((Y * modImgData.width + X)*4)+2];
          let Db = modImgData.data[((Y * modImgData.width + X1)*4)+2];
          result.data[currentPosition] = Cr + ((Dr-Cr) * p) + ((Ar-Cr) * q) + ((Br+Cr-Ar-Dr)*p*q);
          result.data[currentPosition + 1] = Cg + ((Dg-Cg) * p) + ((Ag-Cg) * q) + ((Bg+Cg-Ag-Dg)*p*q);
          result.data[currentPosition + 2] = Cb + ((Db-Cb) * p) + ((Ab-Cb) * q) + ((Bb+Cb-Ab-Db)*p*q);
          result.data[currentPosition + 3] = 255;
      }
  }
  return result;
}

export class Profile extends React.Component {
  constructor(props) {
    super(props);
    
    this.modals = undefined
    this.handleRedirect = this.handleRedirect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }
  handleRedirect(element) {
    this.props.onSetRedirect(false)
    for(let i in this.props.displayedProfile.userServices) {
      console.log(element.target.id)
      if(element.target.id == this.props.displayedProfile.userServices[i]._id) {  
        this.props.onSetDisplayedService(this.props.displayedProfile.userServices[i])
      }
    }  
  }

  handleImageUpload(e) {
    console.log("Image upload")
    let that = this;
    let files = [];

    let aux = {...this.props.displayedProfile};

    files = [...e.target.files];

    if (!/image/.test(files[0].type)) {
        console.log("Formato no válido: " + files[0].type);
    } else {
        var reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onloadend = function() {
          let img = new Image();
          img.src = reader.result;
          img.onload = function() {
            let canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;
            let ctx = canvas.getContext('2d');
            ctx.width = this.width;
            ctx.height = this.height;
            ctx.drawImage(this, 0, 0);
            let imgdata = bilinealScale(ctx);
            canvas.width = 250;
            canvas.height = 250;
            ctx.putImageData(imgdata, 0, 0);
            let newimg = canvas.toDataURL();
            aux.newIcon = newimg.split(",")[1];
            that.props.onSetProfile(aux);
          }
        };
    }
  }

  handleChange(e) {
    let aux = {...this.props.displayedProfile};
    aux.newDescription = e.target.value
    this.props.onSetProfile(aux)
  }

  handleUpdate() {
    let aux = {}
    if(this.props.displayedProfile.newIcon) {
      aux.icon = this.props.displayedProfile.newIcon
    }
    if(this.props.displayedProfile.newDescription) {
      aux.description = this.props.displayedProfile.newDescription
    }

    let requestOptions = {
      method: 'POST',
      headers: { 
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.auth.authToken}`
      },
      body: JSON.stringify(aux)
    }

    let that = this;
    fetch(`/profile`, requestOptions).then(response => response.json()).then((e) => {         
      if(e.type == "res" && e.value == "OK") {
        let newState = that.props.displayedProfile
        if(aux.icon){
          let user = that.props.currentUser
          user.icon = aux.icon
          newState.icon = aux.icon
          that.props.onSetUser(user)
        }
        if(aux.description) {
          newState.description = aux.description
        }
        newState.newIcon = undefined
        newState.newDescription = undefined
        that.props.onSetProfile(newState)
      } else {
        console.log(JSON.stringify(e))
      }
    }).catch((e)=> {
        console.log(e);
        that.props.onLogOut();
    });
  }


  componentDidMount() {
    let elems = document.querySelectorAll('.modal');
    this.modals = M.Modal.init(elems, {});
    setTimeout(() =>{
      if(this.props.displayedProfile.username == "") {
        this.props.onSetRedirect(true);
      }
    },400)
  }

  render() {
    let serviceList = [];

    let resolution = window.screen.width;

    for(let i in this.props.displayedProfile.userServices) {
      let previewImg = "iVBORw0KGgoAAAANSUhEUgAAAssAAAHfCAMAAACReWX5AAAA51BMVEVpXM3TwL6wn8Pl0byHeMmbi8a5qMKHfdH/6rillcXBsMF7bct9b8pqXc365bn+6bjRv75xZMxvYszt2brItsCSg8fSwL6gkMV/ccp7bcrLuL+qmcTZxr13acvn1Lt1aMuGeMn24rmDdcnFs8D04LmUhcejk8Xj0LyzosOhkcXjz7ziz7xxY8yyocOxoMOBcsqunsPArsGuncOPgMjRvr9+b8rv2rqNf8iejsaMfcj757iKe8jLub9rXs3cyb3Jt7+qmsR5bMt5a8upmMT65rmIesl2aMt0Z8uGd8m1pMKXh8f14bmWhsfTbQknAAADrElEQVR42uzc106VURSF0a1IXBaKYG+AXWPvxth7ef/nkXNU5AKM5cjPno7xDF+yd+bFagAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACMHTpdQ5g9eKDBJN2brYEcbDBJJ2oosw0maWcNpoGWYbOWd28xLaNl0DLptEwKLZNCy6TQMim0TAotk0LLpNAyKbRMCi2TQsuk0DIptEwKLZNCy6TQMim0TAotk0LL9OjtrpHlA1qmbwt366vXr7RM167Xd3M3tEzPDteay1qmZztqzWMt07MfLd/yX6Zr45YXp6en39sx6Nu45Sn7Mv3TMim0TAotk0LLpNAyKbRMCi2TQsuk0DIptEwKLZNCy6TQMim0TAotk0LLpNAyKbRMCi2TQst06NSRPd88fKdlOvZopdace6Nl+jVV65zUMv2aq3Xua5l+1XrHtUy/ap2nS1qmXzXybP/IC5scPauRvfZl+qdlUmiZFFomhZZJoWVSaJkUWiaFlkmhZVJomRRaJoWWSaFlUmiZFFomxe+1PAQto2X+L1W/3vLNGspcg0m2/LmGMtVgki3PHK9hrNxpMLGWxx7sGcKRUw3+uGUPO73RMim0TAotk0LLpNAyKbRMiu3U8szy0ZkG/be8dKXq5NUG3bd8tlZ9aNB9yxdr1Y4G3bc8pWW0DFomh5ZJoWVSaJkUWiaFlkmhZVJomRQ/aXlxemstapl/0fIQtIyWYbOWD9cGtMy2VrVRy5dqKNcaTLLlhfkaxvxCg4m1PHZs1xCONfjLlqF7WiaFlkmhZVJomRRaJoWWSTFMy2eef3Q5joSWL8xVzYuZ/lt+8qlWnW/Qe8sva+R2g95b3lcjOxtoGbRMLi2TQsuk0DIptEwKLX9pl45NAISBAAB+JY9FQFAQBBdwA3H/ucQB7KKBcDfD0QuX6YXL9CIfx/Cr0WU+kC24jMvwqmQrW0BNVzZyrgE1TXPJFvYlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIiIuAHhdnvCvNaURQAAAABJRU5ErkJggg==";
      if(this.props.displayedProfile.userServices[i].images != ""){
        previewImg = this.props.displayedProfile.userServices[i].images.split(",")[0];
      }
      let elementid = String(this.props.displayedProfile.userServices[i]._id)
      serviceList.push(
        <Link to="/service">
          <div class="row hoverable" onClick={this.handleRedirect} id={elementid} style={{borderTop: "thin solid lightgrey", borderBottom: "thin solid lightgrey", marginBottom: "0", paddingTop: "5px", paddingBottom: "5px"}}>
            
            <div class="col s4">
              <div class="valign-wrapper">
                <img src={"data:image/png;base64," + previewImg} id={elementid} style={{width: "100%", height: "auto"}} />            
              </div>

            </div>
            <div class="col s6">
              <p class="truncate" style={{fontWeight: "bold"}} id={elementid}>{this.props.displayedProfile.userServices[i].serviceName}</p>
              <p class="truncate" id={elementid}>{this.props.displayedProfile.userServices[i].serviceDesc}</p>
            </div>
            <div class="col s2">
              <p id={elementid}>{this.props.displayedProfile.userServices[i].price}€ {this.props.displayedProfile.userServices[i].priceType=="Total"?"":"/Hora"}</p>
            </div>  
            
          </div>
        </Link>
      )
    }
    let content = <Navigate to="/"/>
    let totalScore = 0;
    if(this.props.displayedProfile.reviewNumber != 0) {
      totalScore = Number(this.props.displayedProfile.reviewScore)/Number(this.props.displayedProfile.reviewNumber)
    }
    if(this.props.displayedServices.homeredirect == false) {
      content = <Main>
        <br/>
        <div class="row" style={{marginTop: "20px", padding:"20px"}}>
          <div class="col s12 m7 l7" style={resolution>600?{borderRight: "thin solid lightgrey"}:{}}>
            <div class="row">
              <div class="col s6 offset-s3">
                <img class="circle" src={"data:image/png;base64," + this.props.displayedProfile.icon} style={{width: "100%", height: "auto"}} />
              </div>
              <div class="col s3">
                {this.props.displayedProfile.username == this.props.currentUser.username?<i data-target="modal1"  class="tiny material-icons modal-trigger" style={{cursor: "pointer"}}>border_color</i>:<div></div>}
              </div>
            </div>
            <h1 class="center-align" style={{fontSize: "35px", margin: "10px"}}>{this.props.displayedProfile.username}</h1>
            <h2 class="center-align" style={{fontSize: "25px", margin: "10px"}}>Calificación: {totalScore.toFixed(2) + " (" + this.props.displayedProfile.reviewNumber + " reseñas)"}</h2>

            <div style={{borderTop: "thin solid lightgrey", borderBottom: "thin solid lightgrey", marginTop: "10px", marginBottom: "10px", paddingTop: "10px", paddingBottom: "10px"}}>
              <p style={{fontSize: "16px", margin: "auto"}}> - {this.props.displayedProfile.fullname}</p>
              <p style={{fontSize: "16px", margin: "auto"}}> - {this.props.displayedProfile.email}</p>
              <p style={{fontSize: "16px", margin: "auto"}}> - Registrado el {new Date(Number(this.props.displayedProfile.registration)).toDateString()}</p>
            </div>
            <div class="container">
              <br/>
              <h2 class="center-align" style={{fontSize: "20px", margin: "auto"}}> Acerca de {this.props.displayedProfile.username}</h2>
              <br/>
              <p> {this.props.displayedProfile.description} {this.props.displayedProfile.username == this.props.currentUser.username?<i data-target="modal2"  class="tiny material-icons modal-trigger" style={{cursor: "pointer"}}>border_color</i>:<div></div>}</p>
            </div>
          </div>

          <div class="col s12 m5 l5" style={resolution>600?{borderLeft: "thin solid lightgrey"}:{}}>
            <h2 style={{fontSize: "25px", margin: "10px"}}>Servicios del usuario:</h2>
            {serviceList}
          </div>
        </div>


        <div id="modal1" class="modal">
          <div class="modal-content">
            <h4>Cambiar icono</h4>
            <div class="row">
                <form class="col s12">
                  <div class="file-field input-field">
                      <div class="btn">
                          <span>File</span>
                          <input type="file" onChange={this.handleImageUpload} />
                      </div>
                      <div class="file-path-wrapper">
                          <input class="file-path validate" type="text" placeholder="Upload one or more files" />
                      </div>  
                  </div>
                </form>
                <br/>
            </div>
          </div>
          <div class="modal-footer">
          <a href="#" type="button" onClick={() => {this.modals[0].close(); this.handleUpdate()}} class="waves-effect waves-green btn-flat">Actualizar</a>
            <a href="#" type="button" onClick={() => {this.modals[0].close()}} class="waves-effect waves-green btn-flat">Cancelar</a>
          </div>
        </div>

        <div id="modal2" class="modal">
          <div class="modal-content">
            <h4>Cambiar descripción</h4>
            <div class="row">
                <form class="col s12">
                    <div class="row">
                        <div class="input-field col s12">
                            <textarea id="newDescription" class="materialize-textarea" name="newDescription" onChange={this.handleChange}></textarea>
                            <label for="newDescription">Nueva descripción</label>
                        </div>
                    </div>
                </form>
                <br/>
            </div>
          </div>
          <div class="modal-footer">
            <a href="#" type="button" onClick={() => {this.modals[1].close(); this.handleUpdate()}} class="waves-effect waves-green btn-flat">Actualizar</a>
            <a href="#" type="button" onClick={() => {this.modals[1].close()}} class="waves-effect waves-green btn-flat">Cancelar</a>
          </div>
        </div>
        
      </Main>
    }
    return(content)
  }
}

const mapStateToProps = (state, props) => {
  return ({
    displayedServices: state.displayedServices,
    displayedProfile: state.displayedProfile,
    currentUser: state.currentUser,
    auth: state.auth
  });
}

const mapActionsToProps = (dispatch, props) => {
  return bindActionCreators({
    onUpdateDisplayedService: updateDisplayedService,
    onSetRedirect: setRedirect,
    onUpdateDisplayedService: updateDisplayedService,
    onSetProfile: setProfile,
    onSetUser: setUser,
    onSetDisplayedService: setDisplayedService
  }, dispatch); 
}

export default withCookies(connect(mapStateToProps, mapActionsToProps)(Profile));