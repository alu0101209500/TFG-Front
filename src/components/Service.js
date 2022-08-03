import React from "react";
import Main from "./page-elements/Main";
import { Link, NavLink, Navigate } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withCookies } from "react-cookie";
import {resetSearch, setPFP, setRedirect, updateDisplayedService } from "../actions/displayed-services-actions";
import 'materialize-css/dist/css/materialize.min.css'
import M from 'materialize-css'
import { resetProfile, setProfile } from "../actions/displayed-profile-actions";
import { logOut } from "../actions/user-actions";
import { setDisplayEditor, updateNewMessage } from "../actions/displayed-messages-actions";
import { resetInput, setServerMessage, updateInput } from "../actions/displayed-transactions-actions";

const baseimg = "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";

export class Service extends React.Component {
  constructor(props) {
    super(props);
    this.modals = undefined;
    this.handleContact = this.handleContact.bind(this)
    this.updateTransaction = this.updateTransaction.bind(this)
    this.startTransaction = this.startTransaction.bind(this)
  }

  updateTransaction(e) {
    this.props.onUpdateTransactionInput(e)
  }

  startTransaction() {
    if(this.props.auth.authToken) {
      let requestOptions = {
        method: 'POST',
        headers: { 
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.props.auth.authToken}`
        },
        body: JSON.stringify({
          id: this.props.displayedServices.displayed._id,
          notes: this.props.displayedTransactions.inputFields.aplicantNotes
        })
      }

      let that = this
      fetch(`/transactions`, requestOptions).then(response => response.json()).then((firstRes) => {         
        if(firstRes.type == "res") {
          that.props.onSetServerMessage("La transacción se ha iniciado de forma correcta. El propietario del servicio ha sido notificado.")
        } else {
          that.props.onSetServerMessage("Error al publicar el servicio: " + firstRes.value)
        }
      }).catch((err)=> {
          console.log(err);
          that.props.onLogOut();
      });
    }
  }

  handleContact() {
    this.props.onUpdateNewMessage({
      target: {
        name: "to",
        value: this.props.displayedServices.displayed.postedBy
      }
    })
    this.props.onUpdateNewMessage({
      target: {
        name: "subject",
        value: "Consulta sobre el servicio " + this.props.displayedServices.displayed.serviceName
      }
      
    })
    this.props.onUpdateNewMessage({
      target: {
        name: "message",
        value: "¡Saludos! Quisiera consultarle acerca de..."
      }
      
    })
    this.props.onSetDisplayEditor(true)
  }

  componentDidMount() {
    var elems = document.querySelectorAll('.slider');
    var instances = M.Slider.init(elems, {height: 230});
    var elems2 = document.querySelectorAll('.materialboxed');
    var instances2 = M.Materialbox.init(elems2, {});
    var elems3 = document.querySelectorAll('.modal')
    this.modals = M.Modal.init(elems3, {});
    //this.props.onResetProfile();
    let that = this
    setTimeout(() => {
      if(that.props.displayedServices.displayed.serviceName == undefined) {
        that.props.onSetRedirect(true);
      }else {
        let requestOptions = {
            method: 'GET',
            headers: { 
                'Accept': '*/*'
            }
        }
          fetch(`/profile?username=${that.props.displayedServices.displayed.postedBy}`, requestOptions).then(response => response.json()).then((e) => {         
              if(e.type == "res") {
                that.props.onSetPFP(e.value.icon);
                that.props.onSetProfile(e.value);
              } else {
                console.log(JSON.stringify(e))
              }
          }).catch((e)=> {
              console.log(e);
              that.props.onLogOut();
          });
      }
    }, 400)
  }

  render() {
    let dispimages = [];
    let dispvideos = [];
    if(this.props.displayedServices.displayed.images != "" && this.props.displayedServices.displayed.images != undefined){
      dispimages = this.props.displayedServices.displayed.images.split(",");
    }
    if(this.props.displayedServices.displayed.videos != "" && this.props.displayedServices.displayed.videos != undefined){
      dispvideos = this.props.displayedServices.displayed.videos.split(",");
    }
    
    
    if(this.props.displayedServices.homeredirect == true) {
        return(<Navigate to="/" />)
    } else {
      let carousel = [];
      if(dispimages.length == 0) {
          carousel.push(<li>
              <img class="materialboxed" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAssAAAHfCAMAAACReWX5AAAA51BMVEVpXM3TwL6wn8Pl0byHeMmbi8a5qMKHfdH/6rillcXBsMF7bct9b8pqXc365bn+6bjRv75xZMxvYszt2brItsCSg8fSwL6gkMV/ccp7bcrLuL+qmcTZxr13acvn1Lt1aMuGeMn24rmDdcnFs8D04LmUhcejk8Xj0LyzosOhkcXjz7ziz7xxY8yyocOxoMOBcsqunsPArsGuncOPgMjRvr9+b8rv2rqNf8iejsaMfcj757iKe8jLub9rXs3cyb3Jt7+qmsR5bMt5a8upmMT65rmIesl2aMt0Z8uGd8m1pMKXh8f14bmWhsfTbQknAAADrElEQVR42uzc106VURSF0a1IXBaKYG+AXWPvxth7ef/nkXNU5AKM5cjPno7xDF+yd+bFagAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACMHTpdQ5g9eKDBJN2brYEcbDBJJ2oosw0maWcNpoGWYbOWd28xLaNl0DLptEwKLZNCy6TQMim0TAotk0LLpNAyKbRMCi2TQsuk0DIptEwKLZNCy6TQMim0TAotk0LL9OjtrpHlA1qmbwt366vXr7RM167Xd3M3tEzPDteay1qmZztqzWMt07MfLd/yX6Zr45YXp6en39sx6Nu45Sn7Mv3TMim0TAotk0LLpNAyKbRMCi2TQsuk0DIptEwKLZNCy6TQMim0TAotk0LLpNAyKbRMCi2TQst06NSRPd88fKdlOvZopdace6Nl+jVV65zUMv2aq3Xua5l+1XrHtUy/ap2nS1qmXzXybP/IC5scPauRvfZl+qdlUmiZFFomhZZJoWVSaJkUWiaFlkmhZVJomRRaJoWWSaFlUmiZFFomxe+1PAQto2X+L1W/3vLNGspcg0m2/LmGMtVgki3PHK9hrNxpMLGWxx7sGcKRUw3+uGUPO73RMim0TAotk0LLpNAyKbRMiu3U8szy0ZkG/be8dKXq5NUG3bd8tlZ9aNB9yxdr1Y4G3bc8pWW0DFomh5ZJoWVSaJkUWiaFlkmhZVJomRQ/aXlxemstapl/0fIQtIyWYbOWD9cGtMy2VrVRy5dqKNcaTLLlhfkaxvxCg4m1PHZs1xCONfjLlqF7WiaFlkmhZVJomRRaJoWWSTFMy2eef3Q5joSWL8xVzYuZ/lt+8qlWnW/Qe8sva+R2g95b3lcjOxtoGbRMLi2TQsuk0DIptEwKLX9pl45NAISBAAB+JY9FQFAQBBdwA3H/ucQB7KKBcDfD0QuX6YXL9CIfx/Cr0WU+kC24jMvwqmQrW0BNVzZyrgE1TXPJFvYlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIiIuAHhdnvCvNaURQAAAABJRU5ErkJggg==" />
            </li>)
      } else {
          for(let i in dispimages) {
              carousel.push(<li>
                    <img class="materialboxed" src={"data:image/png;base64," + dispimages[i]} />
                </li>)
          }
      }

      if((dispvideos.length > 0)) {
          for(let str in dispvideos) {
              let aux = decodeURIComponent(escape(window.atob( dispvideos[str] )))
              carousel.push(<li>
                  <iframe src={aux} ></iframe>
                </li>)
          }
      }

      let redirectionContent = <div class="col s12 l6"><NavLink to="/signin"><a style={{marginTop: "32px", width: "100%", fontSize: "12px", padding: "2px"}} class="waves-effect waves-light btn">Identifícate&nbsp;para&nbsp;solicitar&nbsp;el&nbsp;servicio</a></NavLink></div>
      if(this.props.currentUser.username != "") {
        if(this.props.currentUser.username != this.props.displayedServices.displayed.postedBy) {
          redirectionContent = <div>
            <div class="col s6 l3 center">
                <NavLink to="/messagesPage" ><a style={{marginTop: "32px", width: "100%", fontSize: "12px", padding: "2px"}} onClick={this.handleContact} class="waves-effect waves-light btn">Enviar&nbsp;mensaje</a></NavLink>
              </div>
              <div class="col s6 l3 center">
                <a style={{marginTop: "32px" , width: "100%", fontSize: "12px", padding: "2px"}} class="waves-effect waves-light btn modal-trigger" data-target="transactionModal" onClick={this.props.onResetTransactionInput}>Solicitar&nbsp;servicio</a>
              </div>
            </div>
        } else {
          redirectionContent = <div class="col s12 l6 center-align"><p class="center-align">Este servicio es tuyo</p></div>
        }
      }

      let tags = []
      for(let i in this.props.displayedServices.displayed.tags) {
        tags.push(
          <div class="chip">
            {this.props.displayedServices.displayed.tags[i]}
          </div>
        )
      }

      let displayedPFP = "data:image/png;base64," +  baseimg;
      if(this.props.displayedServices.displayedIcon != ""){
        displayedPFP = "data:image/png;base64," + this.props.displayedServices.displayedIcon
      }
      return(
        <Main>
            <div class="container">
                <br />
                <h1 class="center" style={{fontSize: "30px"}}>{this.props.displayedServices.displayed.serviceName}</h1>
                <div class="slider" style={{height: "250px"}}>
                    <ul class="slides" style={{height: "250px"}}>
                    {carousel}
                    </ul>
                </div>

                <p class="right-align" style={{fontSize: "35px"}}>{this.props.displayedServices.displayed.price}€ {this.props.displayedServices.displayed.priceType=="Total"?"":"/ Hora"}</p>
          
                <div style={{borderColor: "lightgray", backgroundColor: "lightgray", borderStyle: "solid", borderWidth: "thin"}}/>
                <div class="row">
                  <ul class="collection col s12 l6" style={{margin: "0px", border: "none"}}>
                    <li class="collection-item avatar" style={{minHeight: "auto"}}>
                      <img src={displayedPFP} alt="" class="circle"/>
                      <span class="title"><NavLink to="/profilePage">{this.props.displayedServices.displayed.postedBy}</NavLink></span>
                      <p>Publicado en: {new Date(this.props.displayedServices.displayed.postedAt).toLocaleDateString() + " - " + new Date(this.props.displayedServices.displayed.postedAt).toLocaleTimeString()}</p>
                    </li>
                  </ul>
                  {redirectionContent}
                </div>

                <div style={{borderColor: "lightgray", backgroundColor: "lightgray", borderStyle: "solid", borderWidth: "thin"}}/>
                <p style={{fontSize: "20px"}}>Descripción del servicio</p>
                <p class="flow-text" style={{fontSize: "18px"}}>{this.props.displayedServices.displayed.serviceDesc}</p>
                <br/>
                <div style={{borderColor: "lightgray", backgroundColor: "lightgray", borderStyle: "solid", borderWidth: "thin", marginBottom: "10px"}}/>
                {tags}
            </div>
            <br/>

            <div id="transactionModal" class="modal">
              <div class="modal-content">
                <h4 class="center-align">Solicitar servicio</h4>
                <p class="">Si desea añadir alguna nota para el vendedor, puede hacerlo en el siguiente campo. Recuerde que en caso de duda puede contactar con el vendedor mediante mensaje directo.</p>
                <textarea id="aplicantNotes" name="aplicantNotes" placeholder="Notas y aclaraciones para el vendedor (Opcional)..." onChange={this.updateTransaction} class="materialize-textarea"></textarea>
                <label for="aplicantNotes">Notas</label>
              </div>
              <div class="modal-footer">
                <a href="#!" class="modal-close waves-effect waves-green btn-flat modal-trigger" data-target="statusModal" onClick={this.startTransaction}>Confirmar</a>
                <a href="#!" class="modal-close waves-effect waves-green btn-flat">Cancelar</a>
              </div>
            </div>

            <div id="statusModal" class="modal">
              <div class="modal-content">
                <h4 class="center-align">Solicitar servicio</h4>
                <p class="">{this.props.displayedTransactions.responseMsg}</p>
              </div>
              <div class="modal-footer">
                <a href="#!" class="modal-close waves-effect waves-green btn-flat">Aceptar</a>
              </div>
            </div>
        </Main>
      );
    }
  }
}

const mapStateToProps = (state, props) => {
  return ({
    displayedServices: state.displayedServices,
    currentUser: state.currentUser,
    auth: state.auth,
    displayedTransactions: state.displayedTransactions
  });
}

const mapActionsToProps = (dispatch, props) => {
  return bindActionCreators({
    onResetSearch: resetSearch,
    onUpdateDisplayedService: updateDisplayedService,
    onSetPFP: setPFP,
    onSetProfile: setProfile,
    onResetProfile: resetProfile,
    onLogOut: logOut,
    onSetRedirect: setRedirect,
    onUpdateNewMessage: updateNewMessage,
    onSetDisplayEditor: setDisplayEditor,
    onUpdateTransactionInput: updateInput,
    onSetServerMessage : setServerMessage,
    onResetTransactionInput : resetInput
  }, dispatch); 
}

export default withCookies(connect(mapStateToProps, mapActionsToProps)(Service));