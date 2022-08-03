import React from "react";
import Main from "./page-elements/Main";
import { Link, NavLink, Navigate } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withCookies } from "react-cookie";
import { setRedirect } from "../actions/displayed-services-actions";
import 'materialize-css/dist/css/materialize.min.css'
import M from 'materialize-css'
import { resetNewMessage, setDisplayEditor, setDisplayedMessage, setInteractionIndex, setReceivedMessages, setSentMessages, updateNewMessage } from "../actions/displayed-messages-actions";
import { logOut } from "../actions/user-actions";


export class Messages extends React.Component {
  constructor(props) {
    super(props);
    
    this.modals = undefined;
    this.tabs = undefined;
    this.floatingbutton = undefined;
    this.handleSelection = this.handleSelection.bind(this);
    this.handleModeChange = this.handleModeChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSendMail = this.handleSendMail.bind(this);
    this.handleInteraction = this.handleInteraction.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
  }

  handleSelection(e) {
    this.props.onSetEditor(false);
    this.props.onSetDisplayedMessages(e.target.id);
  }

  deleteMessage() {
    let msgId = "";
    let originalCode = this.props.displayedMessages.interactionIndex;

    let codeSource = this.props.displayedMessages.interactionIndex.split(":")[0];
    let codeIndex = Number(this.props.displayedMessages.interactionIndex.split(":")[1]);
    if(codeIndex >= 0) {
      if(codeSource == "sent" && codeIndex < this.props.displayedMessages.sent.length) {
        msgId = this.props.displayedMessages.sent[codeIndex]._id
      } else if (codeSource == "received" && codeIndex < this.props.displayedMessages.received.length) {
        msgId = this.props.displayedMessages.received[codeIndex]._id
      }
    }

    let that = this;
    if(msgId != "") {
      if(this.props.auth.authToken) {
        let requestOptions = {
          method: 'DELETE',
          headers: { 
              'Accept': '*/*',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.props.auth.authToken}`
          },
          body: JSON.stringify({
            id: msgId
          })
        }
        let secondRequestOptions = {
          method: 'GET',
          headers: { 
              'Accept': '*/*',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${that.props.auth.authToken}`
          }
        }
  
  
        fetch(`/messages`, requestOptions).then(response => response.json()).then((firstRes) => {         
          if(firstRes.type == "res") {
          
            fetch(`/messages`, secondRequestOptions).then(response => response.json()).then((secondRes) => {         
              if(secondRes.type == "res") {
                that.props.onSetReceivedMessages(secondRes.value.received);
                that.props.onSetSentMessages(secondRes.value.sent);
              } else {
                console.log(JSON.stringify(secondRes))
              }
            }).catch((err)=> {
                console.log(err);
                that.props.onLogOut();
            });
  
          } else {
            console.log(JSON.stringify(firstRes))
          }
        }).catch((err)=> {
            console.log(err);
            that.props.onLogOut();
        });
      }
      
    }

  }

  handleInteraction(e) {
    console.log(e)
    this.props.onSetInteractionIndex(e.target.id);
  }

  handleChange(e) {
    console.log(e)
    this.props.onUpdateNewMessage(e);
  }

  handleModeChange(e) {
    this.props.onSetEditor(true);
  }

  handleSendMail() {
    let that = this;
    
    if(this.props.auth.authToken) {
      let requestOptions = {
        method: 'POST',
        headers: { 
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.props.auth.authToken}`
        },
        body: JSON.stringify({
          to: this.props.displayedMessages.newMessage.to,
          subject: this.props.displayedMessages.newMessage.subject,
          message: this.props.displayedMessages.newMessage.message
        })
      }
      let secondRequestOptions = {
        method: 'GET',
        headers: { 
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${that.props.auth.authToken}`
        }
      }


      fetch(`/messages`, requestOptions).then(response => response.json()).then((firstRes) => {         
        if(firstRes.type == "res") {
          that.props.onSetEditor(false)
          
          fetch(`/messages`, secondRequestOptions).then(response => response.json()).then((secondRes) => {         
            if(secondRes.type == "res") {
              that.props.onSetReceivedMessages(secondRes.value.received);
              that.props.onSetSentMessages(secondRes.value.sent);
            } else {
              console.log(JSON.stringify(secondRes))
            }
          }).catch((err)=> {
              console.log(err);
              that.props.onLogOut();
          });

        } else {
          console.log(JSON.stringify(firstRes))
        }
      }).catch((err)=> {
          console.log(err);
          that.props.onLogOut();
      });
    }
  }



  componentDidMount() {
    let elems = document.querySelectorAll('.modal');
    this.modals = M.Modal.init(elems, {});
    elems = document.querySelectorAll('.tabs')
    this.tabs = M.Tabs.init(elems, {});
    elems = document.querySelectorAll('.fixed-action-btn');
    this.floatingbutton = M.FloatingActionButton.init(elems, {});

    if(this.props.auth.authToken) {
      let requestOptions = {
        method: 'GET',
        headers: { 
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.props.auth.authToken}`
        }
      }
  
      let that = this;
      fetch(`/messages`, requestOptions).then(response => response.json()).then((e) => {         
        if(e.type == "res") {
          that.props.onSetReceivedMessages(e.value.received);
          that.props.onSetSentMessages(e.value.sent);
        } else {
          console.log(JSON.stringify(e))
        }
      }).catch((e)=> {
          console.log(e);
          that.props.onLogOut();
      });
    }
  }

  render() {
    
    let content = <Navigate to="/"/>
    let receivedList = []
    let sentList = []
    let smallReceivedList = []
    let smallSentList = []


    for(let i in this.props.displayedMessages.received) {
      let code = "received:" + String(i);
      let selectedColor = {cursor: "pointer"}
      if(this.props.displayedMessages.received[i]._id == this.props.displayedMessages.displayed._id) {
        selectedColor = {cursor: "pointer", backgroundColor: "#f0fff8"}
      }
      receivedList.push(
        <li class="collection-item avatar hoverable" id={code} onClick={this.handleSelection} style={selectedColor}>
        <img src={"data:image/png;base64," + this.props.displayedMessages.received[i].icon} id={code} onClick={this.handleSelection} class="circle"/>
          <span id={code} class="title truncate" onClick={this.handleSelection}>{this.props.displayedMessages.received[i].subject}</span>
            <p  id={code} class="truncate" onClick={this.handleSelection}>From: {this.props.displayedMessages.received[i].from}</p>
            <p id={code} onClick={this.handleSelection}>At: {new Date(Number(this.props.displayedMessages.received[i].sentAt)).toDateString()}</p>
            <p id={code} class="truncate" onClick={this.handleSelection}>{this.props.displayedMessages.received[i].message}</p>
            <a id={code} href="#!" onClick={this.handleInteraction} data-target="eliminarMensaje" class="secondary-content modal-trigger"><i id={code} class="material-icons">close</i></a>
        </li>
      )

      smallReceivedList.push(
        <li class="collection-item avatar hoverable modal-trigger" id={code} onClick={this.handleSelection} style={selectedColor} data-target="mostrarMensaje">
        <img src={"data:image/png;base64," + this.props.displayedMessages.received[i].icon} id={code} onClick={this.handleSelection} class="circle"/>
          <span id={code} class="title truncate" onClick={this.handleSelection}>{this.props.displayedMessages.received[i].subject}</span>
            <p  id={code} class="truncate" onClick={this.handleSelection}>From: {this.props.displayedMessages.received[i].from}</p>
            <p id={code} onClick={this.handleSelection}>At: {new Date(Number(this.props.displayedMessages.received[i].sentAt)).toDateString()}</p>
            <p id={code} class="truncate" onClick={this.handleSelection}>{this.props.displayedMessages.received[i].message}</p>
            <a id={code} href="#!" onClick={this.handleInteraction} data-target="eliminarMensaje" class="secondary-content modal-trigger"><i id={code} class="material-icons">close</i></a>
        </li>
      )

    }
    for(let i in this.props.displayedMessages.sent) {
      let code = "sent:" + String(i);
      let selectedColor = {cursor: "pointer"}
      if(this.props.displayedMessages.sent[i]._id == this.props.displayedMessages.displayed._id) {
        selectedColor = {cursor: "pointer", backgroundColor: "#f0fff8"}
      }
      sentList.push(
        <li class="collection-item avatar hoverable" id={code} onClick={this.handleSelection} style={selectedColor}>
        <img src={"data:image/png;base64," + this.props.displayedMessages.sent[i].icon} id={code} onClick={this.handleSelection} class="circle"/>
          <span id={code} class="title truncate" onClick={this.handleSelection}>{this.props.displayedMessages.sent[i].subject}</span>
            <p  id={code} class="truncate" onClick={this.handleSelection}>To: {this.props.displayedMessages.sent[i].to}</p>
            <p id={code} onClick={this.handleSelection}>At: {new Date(Number(this.props.displayedMessages.sent[i].sentAt)).toDateString()}</p>
            <p id={code} class="truncate" onClick={this.handleSelection}>{this.props.displayedMessages.sent[i].message}</p>
            <a id={code} onClick={this.handleInteraction} href="#!" data-target="eliminarMensaje" class="secondary-content modal-trigger"><i id={code} class="material-icons">close</i></a>
        </li>
      )
      smallSentList.push(
        <li class="collection-item avatar hoverable modal-trigger" id={code} onClick={this.handleSelection} style={selectedColor} data-target="mostrarMensaje">
        <img src={"data:image/png;base64," + this.props.displayedMessages.sent[i].icon} id={code} onClick={this.handleSelection} class="circle"/>
          <span id={code} class="title truncate" onClick={this.handleSelection}>{this.props.displayedMessages.sent[i].subject}</span>
            <p  id={code} class="truncate" onClick={this.handleSelection}>To: {this.props.displayedMessages.sent[i].to}</p>
            <p id={code} onClick={this.handleSelection}>At: {new Date(Number(this.props.displayedMessages.sent[i].sentAt)).toDateString()}</p>
            <p id={code} class="truncate" onClick={this.handleSelection}>{this.props.displayedMessages.sent[i].message}</p>
            <a id={code} onClick={this.handleInteraction} href="#!" data-target="eliminarMensaje" class="secondary-content modal-trigger"><i id={code} class="material-icons">close</i></a>
        </li>
      )
    }

    let mainarea = <ul class="collection"  style={{margin: "0", height: "100%"}}><li class="collection-item"></li></ul>

    if(this.props.displayedMessages.displayed.from) {
      mainarea = <ul class="collection"  style={{margin: "0", height: "100%"}}>
        <li class="collection-item avatar">
          <img src={"data:image/png;base64," + this.props.displayedMessages.displayed.icon} class="circle"/>
            <span class="title truncate">{this.props.displayedMessages.displayed.from}</span>
            <p>{this.props.displayedMessages.displayed.subject}</p>
            <p>{new Date(Number(this.props.displayedMessages.displayed.sentAt)).toDateString()}</p>
        </li>
        <li class="collection-item">{this.props.displayedMessages.displayed.message}</li>
      </ul>
    }
    
    let editor = <ul class="collection" style={{margin: "0", height: "100%"}}>
      
        <li class="collection-item">
          <div class="row" style={{marginBottom: "0px"}}>
            <label class="col s8">to: <input class="browser-default" type="text" style={{border: "0", width: "100%", outline: "none"}} onChange={this.handleChange} value={this.props.displayedMessages.newMessage.to} name="to" placeholder="Intruduzca el usuario al que va dirigido este mensaje..."></input></label>
            <div class="col s4">
              <button class="btn waves-effect waves-light" type="button" onClick={this.handleSendMail}>Enviar
                <i class="material-icons right">send</i>
              </button>
            </div> 
          </div>
        </li>
     
      

      <li class="collection-item">
        <label>subject: <input class="browser-default" type="text" style={{border: "0", width: "100%", outline: "none"}} onChange={this.handleChange} value={this.props.displayedMessages.newMessage.subject} name="subject" placeholder="Asunto del mensaje..."></input></label>
      </li>

      <li class="collection-item"  style={{border: "0", height: "100%"}}>
        <textarea type="textarea" style={{border: "0", height: "100%", outline: "none"}} onChange={this.handleChange} value={this.props.displayedMessages.newMessage.message} name="message" placeholder="Escriba su mensaje..."></textarea>
      </li>
    
    </ul>
    
    if(this.props.displayedServices.homeredirect == false && this.props.currentUser.username != "") {
      content = <Main>
        <div class="row hide-on-med-and-down">
          <div class="col s5" style={{borderRight: "solid thin lightgrey", padding: "0", height: "80vh", overflowX: "hidden", overflowY: "auto"}}>
            
            <div class="row">
              <div class="col s12">
                <ul class="tabs tabs-fixed-width">
                  <li class="tab col s6" ><a class="active" style={{color: "darkgreen"}} href="#receivedTab">Recibidos</a></li>
                  <li class="tab col s6"><a href="#sentTab"  style={{color:"darkgreen"}}>Enviados</a></li>
                </ul>
              </div>
              <div id="receivedTab" class="col s12">
                <ul class="collection">
                  {receivedList}
                </ul>
              </div>
              <div id="sentTab" class="col s12">
                <ul class="collection">
                  {sentList}
                </ul>
              </div>
            </div>

          </div>
          <div class="col s7" style={{padding: "0", height: "80vh"}}>
            {this.props.displayedMessages.displayEditor == false ? mainarea:editor}
          </div>
        </div>

        <div class="row hide-on-large-only">
          <div class="col s12" style={{borderRight: "solid thin lightgrey", padding: "0", height: "80vh", overflowX: "hidden", overflowY: "auto"}}>
            
            <div class="row">
              <div class="col s12">
                <ul class="tabs tabs-fixed-width">
                  <li class="tab col s6" ><a class="active" style={{color: "darkgreen"}} href="#smallReceivedTab">Recibidos</a></li>
                  <li class="tab col s6"><a href="#smallSentTab" style={{color:"darkgreen"}}>Enviados</a></li>
                </ul>
              </div>
              <div id="smallReceivedTab" class="col s12">
                <ul class="collection">
                  {smallReceivedList}
                </ul>
              </div>
              <div id="smallSentTab" class="col s12">
                <ul class="collection">
                  {smallSentList}
                </ul>
              </div>
            </div>

          </div>
        </div>

        <div name="true" onClick={this.handleModeChange} class="fixed-action-btn hide-on-med-and-down">
          <a name="true" onClick={this.handleModeChange} class="btn-floating btn-large green">
            <i name="true" onClick={this.handleModeChange} class="large material-icons">mode_edit</i>
          </a>
        </div>

        <div name="true" onClick={this.handleModeChange} class="fixed-action-btn modal-trigger hide-on-large-only" data-target="mostrarEditor">
          <a name="true" onClick={this.handleModeChange} class="btn-floating btn-large green">
            <i name="true" onClick={this.handleModeChange} class="large material-icons">mode_edit</i>
          </a>
        </div>

        <div id="eliminarMensaje" class="modal">
          <div class="modal-content">
            <h4 class="center-align">Eliminar mensaje</h4>
            <p class="center-align">¿Seguro que desea eliminar el mensaje?</p>
          </div>
          <div class="modal-footer">
            <a href="#!" onClick={this.deleteMessage} class="modal-close waves-effect waves-green btn-flat">Aceptar</a>
            <a href="#!" class="modal-close waves-effect waves-green btn-flat">Cancelar</a>
          </div>
        </div>

        <div id="mostrarMensaje" class="modal" style={{width: "90%", height: "100%"}}>
          {mainarea}
          <div class="modal-footer">
            <a href="#!" class="modal-close waves-effect waves-green btn-flat">Cerrar</a>
          </div>
        </div>

        <div id="mostrarEditor" class="modal" style={{width: "90%", height: "100%"}}>
          {editor}
          <div class="modal-footer">
            <a href="#!" class="modal-close waves-effect waves-green btn-flat">Cerrar</a>
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
    displayedMessages: state.displayedMessages,
    currentUser: state.currentUser,
    auth: state.auth
  });
}

const mapActionsToProps = (dispatch, props) => {
  return bindActionCreators({
    onSetRedirect: setRedirect,
    onSetReceivedMessages: setReceivedMessages,
    onSetSentMessages: setSentMessages,
    onSetEditor: setDisplayEditor,
    onLogOut: logOut,
    onUpdateNewMessage: updateNewMessage,
    onResetNewMessage: resetNewMessage,
    onSetDisplayedMessages: setDisplayedMessage,
    onSetInteractionIndex: setInteractionIndex
  }, dispatch); 
}

export default withCookies(connect(mapStateToProps, mapActionsToProps)(Messages));