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
import { resetInput, setServerMessage, setTransactions, setTransactionsInteractionIndex, updateInput } from "../actions/displayed-transactions-actions";


export class Transactions extends React.Component {
  constructor(props) {
    super(props);
    
    this.modals = undefined;
    this.tabs = undefined;
    this.tooltip = undefined;
    this.setInteraction = this.setInteraction.bind(this)
    this.updateTransaction = this.updateTransaction.bind(this)
    this.refreshTransactions = this.refreshTransactions.bind(this)
    this.payWithPunctuation = this.payWithPunctuation.bind(this)
    this.payWithoutPunctuation = this.payWithoutPunctuation.bind(this)
    this.acceptTransaction = this.acceptTransaction.bind(this)
    this.rejectTransaction = this.rejectTransaction.bind(this)
    this.cancelTransaction = this.cancelTransaction.bind(this)
    this.deleteTransaction = this.deleteTransaction.bind(this)
  }

  deleteTransaction() {
    let that = this
    if(this.props.auth.authToken) {  
      let requestOptions = {
        method: 'DELETE',
        headers: { 
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${that.props.auth.authToken}`
        }, body: JSON.stringify({
          id: that.props.displayedTransactions.transactions[that.props.displayedTransactions.interactionIndex]._id
        })
      }
  
      fetch(`/transactions`, requestOptions).then(response => response.json()).then((e) => {         
        if(e.type == "res") {
          that.refreshTransactions()
        } else {
          console.log(JSON.stringify(e))
        }
      }).catch((e)=> {
          console.log(e);
          that.props.onLogOut();
      });
    }
  }

  payWithPunctuation() {   
    let that = this
    if(this.props.auth.authToken) {  
      let requestOptions = {
        method: 'PUT',
        headers: { 
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${that.props.auth.authToken}`
        }, body: JSON.stringify({
          id: that.props.displayedTransactions.transactions[that.props.displayedTransactions.interactionIndex]._id,
          operation: "pay",
          punctuation: that.props.displayedTransactions.inputFields.punctuation
        })
      }
  
      fetch(`/transactions`, requestOptions).then(response => response.json()).then((e) => {         
        if(e.type == "res") {
          that.props.onSetServerMessage("Pago realizado correctamente")
          that.refreshTransactions()
        } else {
          that.props.onSetServerMessage(String(e.value))
          console.log(JSON.stringify(e))
        }
      }).catch((e)=> {
          console.log(e);
          that.props.onLogOut();
      });
    }
  }

  payWithoutPunctuation() {
    let that = this
    if(this.props.auth.authToken) {  
      let requestOptions = {
        method: 'PUT',
        headers: { 
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${that.props.auth.authToken}`
        }, body: JSON.stringify({
          id: that.props.displayedTransactions.transactions[that.props.displayedTransactions.interactionIndex]._id,
          operation: "pay",
        })
      }
  
      fetch(`/transactions`, requestOptions).then(response => response.json()).then((e) => {         
        if(e.type == "res") {
          that.props.onSetServerMessage("Pago realizado correctamente")
          that.refreshTransactions()
        } else {
          that.props.onSetServerMessage(String(e.value))
          console.log(JSON.stringify(e))
        }
      }).catch((e)=> {
          console.log(e);
          that.props.onLogOut();
      });
    }
  }
  
  acceptTransaction() {
    let that = this
    if(this.props.displayedTransactions.inputFields.finalPayment == 0 || this.props.displayedTransactions.inputFields.finalPayment == "" || this.props.displayedTransactions.inputFields.finalPayment == undefined) {
      this.props.onSetServerMessage("Introduzca un precio válido")
      return
    }
    if(this.props.auth.authToken) {  
      let requestOptions = {
        method: 'PUT',
        headers: { 
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${that.props.auth.authToken}`
        }, body: JSON.stringify({
          id: that.props.displayedTransactions.transactions[that.props.displayedTransactions.interactionIndex]._id,
          operation: "accept",
          previousPayment: that.props.displayedTransactions.inputFields.firstPayment,
          finalPayment: that.props.displayedTransactions.inputFields.finalPayment,
          notes: that.props.displayedTransactions.inputFields.proprietaryNotes
        })
      }

      console.log(requestOptions.body)
  
      fetch(`/transactions`, requestOptions).then(response => response.json()).then((e) => {         
        if(e.type == "res") {
          that.props.onSetServerMessage("Transacción aceptada")
          that.refreshTransactions()
        } else {
          that.props.onSetServerMessage(String(e.value))
          console.log(JSON.stringify(e))
        }
      }).catch((e)=> {
          console.log(e);
          that.props.onLogOut();
      });
    }
  }

  rejectTransaction() {
    let that = this
    if(this.props.auth.authToken) {  
      let requestOptions = {
        method: 'PUT',
        headers: { 
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${that.props.auth.authToken}`
        }, body: JSON.stringify({
          id: that.props.displayedTransactions.transactions[that.props.displayedTransactions.interactionIndex]._id,
          operation: "reject",
          notes: that.props.displayedTransactions.inputFields.proprietaryNotes
        })
      }
  
      fetch(`/transactions`, requestOptions).then(response => response.json()).then((e) => {         
        if(e.type == "res") {
          that.props.onSetServerMessage("Transacción rechazada")
          that.refreshTransactions()
        } else {
          that.props.onSetServerMessage(String(e.value))
          console.log(JSON.stringify(e))
        }
      }).catch((e)=> {
          console.log(e);
          that.props.onLogOut();
      });
    }
  }
  
  cancelTransaction() {
    let that = this
    if(this.props.auth.authToken) {  
      let requestOptions = {
        method: 'PUT',
        headers: { 
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${that.props.auth.authToken}`
        }, body: JSON.stringify({
          id: that.props.displayedTransactions.transactions[that.props.displayedTransactions.interactionIndex]._id,
          operation: "cancel"
        })
      }
  
      fetch(`/transactions`, requestOptions).then(response => response.json()).then((e) => {         
        if(e.type == "res") {
          that.props.onSetServerMessage("Trámite cancelado")
          that.refreshTransactions()
        } else {
          that.props.onSetServerMessage(String(e.value))
          console.log(JSON.stringify(e))
        }
      }).catch((e)=> {
          console.log(e);
          that.props.onLogOut();
      });
    }
  }

  refreshTransactions() {
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
      fetch(`/transactions`, requestOptions).then(response => response.json()).then((e) => {         
        if(e.type == "res") {
          console.log(e)
          that.props.onSetTransactions([...e.value])
        } else {
          console.log(JSON.stringify(e))
        }
      }).catch((e)=> {
          console.log(e);
          that.props.onLogOut();
      });
    }
  }


  updateTransaction(e) {
    if(e.target.name == "firstPayment") {
      this.props.onUpdateTransactionInput({
        target: {
          name: e.target.name,
          value: Number(e.target.value)
        }
      })
    } else {
      this.props.onUpdateTransactionInput(e)
    }
    
  }

  setInteraction(e) {
    this.props.onResetInput()
    console.log(e)
    this.props.onSetIndex(e.target.id)
  }
  componentDidMount() {
    let elems = document.querySelectorAll('.modal');
    this.modals = M.Modal.init(elems, {});
    elems = document.querySelectorAll('.tabs')
    this.tabs = M.Tabs.init(elems, {});
    elems = document.querySelectorAll('.tooltipped');
    this.tooltip = M.Tooltip.init(elems, {});

    this.refreshTransactions()
  }

  render() {
    
    let content = <Navigate to="/"/>
    let proprietaryList = []
    let applicantList = []
    let closedList = []
    let selectedColor = {cursor: "pointer"}
    let modalContent = <div></div>
    let requiresFirstPayment = false
    
    for(let i = this.props.displayedTransactions.transactions.length-1; i >= 0; i--) {
      let code = i;
      let status = ""
      if(this.props.displayedTransactions.transactions[i].status == "new") {
        status = "Solicitud pendiente de revisar por el ofertante";
      } else if(this.props.displayedTransactions.transactions[i].status == "accepted") {
        if(this.props.displayedTransactions.transactions[i].previousPayment == 0) {
          status = "Solicitud aceptada por el ofertante";
        } else {
          status = "Solicitud aceptada. Se requiere el pago de una señal"
        }
        
      } else if(this.props.displayedTransactions.transactions[i].status == "firstPayment"){
        status = "Pago de la señal abonado";
      } else {
        status = "Cerrado";
      }
      
      

      if(this.props.displayedTransactions.transactions[i].status == "closed") {
        closedList.push(
          <li class="collection-item avatar hoverable modal-trigger" data-target="transaccionInfoModal" id={code} style={selectedColor} onClick={this.setInteraction}>
        <img src={"data:image/png;base64," + this.props.displayedTransactions.transactions[i].icon} id={code} class="circle"/>
          <span id={code} class="title truncate">{this.props.displayedTransactions.transactions[i].serviceName}</span>
          <p id={code}>{status}</p>
          <p  id={code} class="truncate">Por: {this.props.displayedTransactions.transactions[i].proprietary == this.props.currentUser.username?this.props.displayedTransactions.transactions[i].applicant:this.props.displayedTransactions.transactions[i].proprietary}</p>
          <p id={code}>At: {new Date(Number(this.props.displayedTransactions.transactions[i].requestedAt)).toDateString()}</p>
          <a id={code} href="#!" data-target="eliminarMensaje" class="secondary-content modal-trigger"><i class="material-icons">close</i></a>
        </li>
        )
      } else if(this.props.displayedTransactions.transactions[i].applicant == this.props.currentUser.username) {
        applicantList.push(
        <li class="collection-item avatar hoverable modal-trigger" data-target="transaccionInfoModal" id={code} style={selectedColor} onClick={this.setInteraction}>
          <img src={"data:image/png;base64," + this.props.displayedTransactions.transactions[i].icon} id={code} class="circle"/>
          <span id={code} class="title truncate">{this.props.displayedTransactions.transactions[i].serviceName}</span>
          <p id={code}>{status}</p>
          <p  id={code} class="truncate">Por: {this.props.displayedTransactions.transactions[i].proprietary == this.props.currentUser.username?this.props.displayedTransactions.transactions[i].applicant:this.props.displayedTransactions.transactions[i].proprietary}</p>
          <p id={code}>At: {new Date(Number(this.props.displayedTransactions.transactions[i].requestedAt)).toDateString()}</p>
        </li>)
      } else if(this.props.displayedTransactions.transactions[i].proprietary == this.props.currentUser.username) {
        proprietaryList.push(
        <li class="collection-item avatar hoverable modal-trigger" data-target="transaccionInfoModal" id={code} style={selectedColor} onClick={this.setInteraction}>
          <img src={"data:image/png;base64," + this.props.displayedTransactions.transactions[i].icon} id={code} class="circle"/>
          <span id={code} class="title truncate">{this.props.displayedTransactions.transactions[i].serviceName}</span>
          <p id={code}>{status}</p>
          <p  id={code} class="truncate">Por: {this.props.displayedTransactions.transactions[i].proprietary == this.props.currentUser.username?this.props.displayedTransactions.transactions[i].applicant:this.props.displayedTransactions.transactions[i].proprietary}</p>
          <p id={code}>At: {new Date(Number(this.props.displayedTransactions.transactions[i].requestedAt)).toDateString()}</p>
        </li>)
      }
    }

    let selectedId = this.props.displayedTransactions.interactionIndex
    if(this.props.displayedTransactions.transactions.length > 0){
      if(this.props.displayedTransactions.transactions[selectedId].previousPayment > 0) {
        requiresFirstPayment = true
      } 
      if(this.props.displayedTransactions.transactions[selectedId].status == "closed") {
        modalContent = <div>
          <div class="modal-content">
                <h4 class="center-align">{this.props.displayedTransactions.transactions[selectedId].serviceName}</h4>
                <p style={{width: "100%", borderBottom: "solid thin lightgray"}}>Por: {this.props.displayedTransactions.transactions[selectedId].proprietary == this.props.currentUser.username?this.props.displayedTransactions.transactions[selectedId].applicant:this.props.displayedTransactions.transactions[selectedId].proprietary}</p>
                <p style={{width: "100%", borderBottom: "solid thin lightgray"}}>Iniciado: {new Date(Number(this.props.displayedTransactions.transactions[selectedId].requestedAt)).toDateString()}</p>
                <p style={{width: "100%", borderBottom: "solid thin lightgray"}}>Finalizado: {new Date(Number(this.props.displayedTransactions.transactions[selectedId].closedAt)).toDateString()}</p>
                
                <p>Notas del comprador:</p>
                <p>{this.props.displayedTransactions.transactions[selectedId].applicantNotes}</p>
                <p>Notas del vendedor:</p>
                <p>{this.props.displayedTransactions.transactions[selectedId].proprietaryNotes}</p>
                <br/>
                <p>Precio final: {String(this.props.displayedTransactions.transactions[selectedId].finalPayment)}€</p>
              </div>
              <div class="modal-footer">
                <a href="#!" class="modal-close waves-effect waves-green btn-flat">Cerrar</a>
              </div>
        </div>
      } else if(this.props.displayedTransactions.transactions[selectedId].applicant == this.props.currentUser.username) {
        if(this.props.displayedTransactions.transactions[selectedId].status == "new") {
          modalContent = <div>
            <div class="modal-content">
              <h4 class="center-align">{this.props.displayedTransactions.transactions[selectedId].serviceName}</h4>
              <p style={{width: "100%", borderBottom: "solid thin lightgray"}}>Por: {this.props.displayedTransactions.transactions[selectedId].proprietary == this.props.currentUser.username?this.props.displayedTransactions.transactions[selectedId].applicant:this.props.displayedTransactions.transactions[selectedId].proprietary}</p>
              <p style={{width: "100%", borderBottom: "solid thin lightgray"}}>Iniciado: {new Date(Number(this.props.displayedTransactions.transactions[selectedId].requestedAt)).toDateString()}</p>

              <p>Notas del comprador:</p>
              <p>{this.props.displayedTransactions.transactions[selectedId].applicantNotes == "" ? "No has añadido descripción adicional a tu solicitud":this.props.displayedTransactions.transactions[selectedId].applicantNotes}</p>
              <br/>
            </div>
            <div class="modal-footer">
              <a href="#!" class="modal-close waves-effect waves-green btn-flat modal-trigger" data-target="confirmCancel" style={{backgroundColor: "red", color: "white", fontWeight: "bold"}}>Cancelar</a>
              <a href="#!" class="modal-close waves-effect waves-green btn-flat">Cerrar</a>
            </div>
          </div>
        } else if(this.props.displayedTransactions.transactions[selectedId].status == "accepted") {
          let previousPaymentMsg = ""
          let buttonMsg = "Pagar"
          if(Number(this.props.displayedTransactions.transactions[selectedId].previousPayment) > 0) {
            previousPaymentMsg = "El vendedor ha solicitado que abones una señal inicial de " + String(this.props.displayedTransactions.transactions[selectedId].previousPayment) + "€ por el servicio. Podrás completar el resto del pago una vez finalizado el servicio"
            buttonMsg = "Pagar señal"
          }
          modalContent = <div>
          <div class="modal-content">
                <h4 class="center-align">{this.props.displayedTransactions.transactions[selectedId].serviceName}</h4>
                <p style={{width: "100%", borderBottom: "solid thin lightgray"}}>Por: {this.props.displayedTransactions.transactions[selectedId].proprietary == this.props.currentUser.username?this.props.displayedTransactions.transactions[selectedId].applicant:this.props.displayedTransactions.transactions[selectedId].proprietary}</p>
                <p style={{width: "100%", borderBottom: "solid thin lightgray"}}>Iniciado: {new Date(Number(this.props.displayedTransactions.transactions[selectedId].requestedAt)).toDateString()}</p>
                
                <p>Notas del vendedor:</p>
                <p>{this.props.displayedTransactions.transactions[selectedId].proprietaryNotes == "" ? "El vendedor no ha adjuntado ninguna nota...":this.props.displayedTransactions.transactions[selectedId].proprietaryNotes}</p>
                
                <p>{previousPaymentMsg}</p>
                <p>Precio final: {String(this.props.displayedTransactions.transactions[selectedId].finalPayment)}€</p>
              </div>
              <div class="modal-footer">
                <a href="#!" class="modal-close waves-effect waves-green btn-flat modal-trigger" data-target="confirmPayment" style={{backgroundColor: "green", color: "white", fontWeight: "bold"}}>{buttonMsg}</a>
                <a href="#!" class="modal-close waves-effect waves-green btn-flat modal-trigger" data-target="confirmCancel" style={{backgroundColor: "red", color: "white", fontWeight: "bold"}}>Cancelar</a>
                <a href="#!" class="modal-close waves-effect waves-green btn-flat">Cerrar</a>
              </div>
        </div>
        } else if(this.props.displayedTransactions.transactions[selectedId].status == "firstPayment") {
          
          modalContent = <div>
          <div class="modal-content">
                <h4 class="center-align">{this.props.displayedTransactions.transactions[selectedId].serviceName}</h4>
                <p style={{width: "100%", borderBottom: "solid thin lightgray"}}>Por: {this.props.displayedTransactions.transactions[selectedId].proprietary == this.props.currentUser.username?this.props.displayedTransactions.transactions[selectedId].applicant:this.props.displayedTransactions.transactions[selectedId].proprietary}</p>
                <p style={{width: "100%", borderBottom: "solid thin lightgray"}}>Iniciado: {new Date(Number(this.props.displayedTransactions.transactions[selectedId].requestedAt)).toDateString()}</p>
                
                <p>Notas del vendedor:</p>
                <p>{this.props.displayedTransactions.transactions[selectedId].proprietaryNotes == "" ? "El vendedor no ha adjuntado ninguna nota...":this.props.displayedTransactions.transactions[selectedId].proprietaryNotes}</p>
                
                <p>La señal ha sido abonada satisfactoriamente y el vendedor ha sido notificado. Puede abonar el resto del pago una vez finalizado el servicio.</p>
                <p>Precio final: {String(this.props.displayedTransactions.transactions[selectedId].finalPayment)}€</p>
              </div>
              <div class="modal-footer">
                <a href="#!" class="modal-close waves-effect waves-green btn-flat modal-trigger" data-target="confirmPayment">Pagar</a>
                <a href="#!" class="modal-close waves-effect waves-green btn-flat modal-trigger" data-target="confirmCancel" style={{backgroundColor: "red", color: "white", fontWeight: "bold"}}>Cancelar</a>
                <a href="#!" class="modal-close waves-effect waves-green btn-flat">Cerrar</a>
              </div>
        </div>
        }
      } else if(this.props.displayedTransactions.transactions[selectedId].proprietary == this.props.currentUser.username) {
        if(this.props.displayedTransactions.transactions[selectedId].status == "new") {
          modalContent = <div>
            <div class="modal-content">
              <h4 class="center-align">{this.props.displayedTransactions.transactions[selectedId].serviceName}</h4>
              <p style={{width: "100%", borderBottom: "solid thin lightgray"}}>Por: {this.props.displayedTransactions.transactions[selectedId].proprietary == this.props.currentUser.username?this.props.displayedTransactions.transactions[selectedId].applicant:this.props.displayedTransactions.transactions[selectedId].proprietary}</p>
              <p style={{width: "100%", borderBottom: "solid thin lightgray"}}>Iniciado: {new Date(Number(this.props.displayedTransactions.transactions[selectedId].requestedAt)).toDateString()}</p>
              <p>Notas del comprador:</p>
              <p>{this.props.displayedTransactions.transactions[selectedId].applicantNotes == "" ? "No has añadido descripción adicional a tu solicitud":this.props.displayedTransactions.transactions[selectedId].applicantNotes}</p>
              <br/>
              <p>Si lo desea puede socilitar una señal proporcional al precio final. Una vez el cliente abone la cantidad solicitada, serás informado a través de el sistema de mensajería de la plataforma. Si el cliente cancela el servicio una vez comenzado, perderá la señal. No obstante, si la transacción es finalizada por parte del vendedor, el cliente recibirá el reintegro de la señal.</p>
              <br/>
              <p>Es necesario que defina un precio final por el servicio. Si el precio del servicio está expresado en €/hora, realice una estimación del número de horas requeridas. En tal caso, recomendamos que se ponga en contacto con el cliente para verificar que ambas partes están de acuerdo.</p>
              <div class="row">
                <div class="col s6">
                 
                  <label for="firstPaymentInput">Señal<select id="firstPaymentInput" class="browser-default" name="firstPayment" onChange={this.updateTransaction}>
                    <option value={0}> Ninguna</option>
                    <option value={Number(0.1)}>10%</option>
                    <option value={Number(0.2)}>20%</option>
                    <option value={Number(0.3)}>30%</option>
                    <option value={Number(0.4)}>40%</option>
                    <option value={Number(0.5)}>50%</option>
                  </select> </label>
                </div>
                <div class="col s6">
                  <label>Precio final <input name="finalPayment" type="number" min="0" placeholder={Number(this.props.displayedTransactions.transactions[selectedId].finalPayment)} onChange={this.updateTransaction} value={this.props.displayedTransactions.inputFields.finalPayment}></input></label>
                </div>
              </div>
              <p>A la hora de definir un precio, tenga presente que la comisión por el trámite de un importe de {String(this.props.displayedTransactions.transactions[selectedId].finalPayment)}€ es del {String(this.props.displayedTransactions.transactions[selectedId].commision)}%</p>
              <br/>
              <p class="">Si desea añadir alguna nota para el comprador, puede hacerlo en el siguiente campo. Recuerde que ante cualquier inconveniente puede contactar con el comprador mediante mensaje directo.</p>
                <label for="proprietaryNotes">Notas<textarea id="proprietaryNotes" name="proprietaryNotes" placeholder="Notas y aclaraciones para el comprador (Opcional)..." onChange={this.updateTransaction} class="materialize-textarea" value={this.props.displayedTransactions.inputFields.proprietaryNotes}></textarea></label>
            </div>
            <div class="modal-footer">
              <a href="#!" class="modal-close waves-effect waves-green btn-flat modal-trigger" style={{backgroundColor: "green", color: "white", fontWeight: "bold"}} data-target="confirmAccept">Aceptar</a>
              <a href="#!" class="modal-close waves-effect waves-green btn-flat modal-trigger" style={{backgroundColor: "red", color: "white", fontWeight: "bold"}} data-target="confirmReject">Rechazar</a>
              <a href="#!" class="modal-close waves-effect waves-green btn-flat">Cerrar</a>
            </div>
          </div>
        } else if(this.props.displayedTransactions.transactions[selectedId].status == "accepted") {
          modalContent = <div>
          <div class="modal-content">
                <h4 class="center-align">{this.props.displayedTransactions.transactions[selectedId].serviceName}</h4>
                <p style={{width: "100%", borderBottom: "solid thin lightgray"}}>Por: {this.props.displayedTransactions.transactions[selectedId].proprietary == this.props.currentUser.username?this.props.displayedTransactions.transactions[selectedId].applicant:this.props.displayedTransactions.transactions[selectedId].proprietary}</p>
                <p style={{width: "100%", borderBottom: "solid thin lightgray"}}>Iniciado: {new Date(Number(this.props.displayedTransactions.transactions[selectedId].requestedAt)).toDateString()}</p>
                
                <p>Precio final: {String(this.props.displayedTransactions.transactions[selectedId].finalPayment)}€</p>
              </div>
              <div class="modal-footer">
              <a href="#!" class="modal-close waves-effect waves-green btn-flat modal-trigger" data-target="confirmCancel" style={{backgroundColor: "red", color: "white", fontWeight: "bold"}}>Cancelar</a>
                <a href="#!" class="modal-close waves-effect waves-green btn-flat">Cerrar</a>
              </div>
        </div>
        } else if(this.props.displayedTransactions.transactions[selectedId].status == "firstPayment") {
          
          modalContent = <div>
          <div class="modal-content">
                <h4 class="center-align">{this.props.displayedTransactions.transactions[selectedId].serviceName}</h4>
                <p style={{width: "100%", borderBottom: "solid thin lightgray"}}>Por: {this.props.displayedTransactions.transactions[selectedId].proprietary == this.props.currentUser.username?this.props.displayedTransactions.transactions[selectedId].applicant:this.props.displayedTransactions.transactions[selectedId].proprietary}</p>
                <p style={{width: "100%", borderBottom: "solid thin lightgray"}}>Iniciado: {new Date(Number(this.props.displayedTransactions.transactions[selectedId].requestedAt)).toDateString()}</p>
                
                <p>El cliente ha abonado el pago por la señal</p>
                <p>Precio final: {String(this.props.displayedTransactions.transactions[selectedId].finalPayment)}€</p>
              </div>
              <div class="modal-footer">
                <a href="#!" class="modal-close waves-effect waves-green btn-flat modal-trigger" data-target="confirmCancel" style={{backgroundColor: "red", color: "white", fontWeight: "bold"}}>Cancelar</a>
                <a href="#!" class="modal-close waves-effect waves-green btn-flat">Cerrar</a>
              </div>
            </div>
        }
      }
    }
    
    
    if(this.props.displayedServices.homeredirect == false && this.props.currentUser.username != "") {
      content = <Main>
        <h1 class="center-align" style={{fontSize: "35px"}}>Gestión de transacciones</h1>
        <div class="row">
              <div class="col s12">
                <ul class="tabs tabs-fixed-width">
                  <li class="tab col s4" ><a class="active" style={{color: "darkgreen", fontSize: "12px"}} href="#proprietaryTab">Mis&nbsp;Solicitudes</a></li>
                  <li class="tab col s4"><a href="#applicantTab"  style={{color:"darkgreen", fontSize: "12px"}}>Mis&nbsp;Ofertas</a></li>
                  <li class="tab col s4"><a href="#closedTab"  style={{color:"darkgreen", fontSize: "12px"}}>Cerradas</a></li>
                </ul>
              </div>
              <div id="proprietaryTab" class="col s12">
                <ul class="collection">
                  {applicantList}
                </ul>
              </div>
              <div id="applicantTab" class="col s12">
                <ul class="collection">
                  {proprietaryList}
                </ul>
              </div>
              <div id="closedTab" class="col s12">
                <ul class="collection">
                  {closedList}
                </ul>
              </div>
            </div>

        <div id="transaccionInfoModal" class="modal">
          {modalContent}
        </div>

        <div id="confirmCancel" class="modal">
          <div class="modal-content">
            <h4 class="center-align">Cancelar transacción</h4>
            <p class="center-align">Si se ha abonado un pago por adelantado a modo de señal, al cancelar la transacción perderá la posibilidad de reclamarlo.</p>
            <br/>
            <p class="center-align">¿Seguro que desea cancelar la transacción?</p>
          </div>
          <div class="modal-footer">
            <a href="#!" class="modal-close waves-effect waves-green btn-flat modal-trigger" data-target="responseModal" onClick={this.cancelTransaction}>Sí</a>
            <a href="#!" class="modal-close waves-effect waves-green btn-flat">No</a>
          </div>
        </div>

        <div id="confirmAccept" class="modal">
          <div class="modal-content">
            <h4 class="center-align">Aceptar transacción</h4>
            <p class="center-align">¿Seguro que desea aceptar la transacción en los siguientes términos?</p>
            <br/>
            <p class="center-align">Precio final: {this.props.displayedTransactions.inputFields.finalPayment}€</p>
            <p class="center-align">Señal: {Number(this.props.displayedTransactions.inputFields.finalPayment) * Number(this.props.displayedTransactions.inputFields.firstPayment)}€</p>
            <p class="center-align">Notas:<br/>{this.props.displayedTransactions.inputFields.proprietaryNotes}</p>
            
          </div>
          <div class="modal-footer">
            <a href="#!" class="modal-close waves-effect waves-green btn-flat modal-trigger" data-target="responseModal" onClick={this.acceptTransaction}>Sí</a>
            <a href="#!" class="modal-close waves-effect waves-green btn-flat">No</a>
          </div>
        </div>

        <div id="confirmReject" class="modal">
          <div class="modal-content">
            <h4 class="center-align">Rechazar transacción</h4>
            <p class="center-align">¿Seguro que desea rechazar la transacción?</p>
          </div>
          <div class="modal-footer">
            <a href="#!" class="modal-close waves-effect waves-green btn-flat modal-trigger" data-target="responseModal" onClick={this.rejectTransaction}>Sí</a>
            <a href="#!" class="modal-close waves-effect waves-green btn-flat">No</a>
          </div>
        </div>

        <div id="confirmPayment" class="modal">
          <div class="modal-content">
            <h4 class="center-align">Realizar pago</h4>
            <p class="center-align">Redirigiendo a su plataforma de pago...</p>
            <div class="progress">
                <div class="indeterminate"></div>
            </div>
            <br/>
            <br/>
            <p>Esta pantalla simula el acceso a la plataforma de pago en este prototipo. ¿Continuar con el pago?</p>
          </div>
          <div class="modal-footer">
            {requiresFirstPayment == false?<a href="#!" class="modal-close waves-effect waves-green btn-flat modal-trigger" data-target="addPunctuation">Sí</a>:<a href="#!" class="modal-close waves-effect waves-green btn-flat modal-trigger" onClick={this.payWithoutPunctuation} data-target="responseModal">Sí</a>}
            <a href="#!" class="modal-close waves-effect waves-green btn-flat">No</a>
          </div>
        </div>

        <div id="addPunctuation" class="modal">
          <div class="modal-content">
            <h4 class="center-align">Valoración del servicio</h4>
            <p class="center-align">¿Desea valorar el servicio prestado</p>
            
            <p class="range-field">
              <input type="range" class="tooltipped" data-position="top" data-tooltip={this.props.displayedTransactions.inputFields.punctuation} min="0" max="10" name="punctuation" onChange={this.updateTransaction}/>
            </p>
          </div>
          <div class="modal-footer">
            <a href="#!" class="modal-close waves-effect waves-green btn-flat modal-trigger" data-target="responseModal" onClick={this.payWithPunctuation}>Valorar</a>
            <a href="#!" class="modal-close waves-effect waves-green btn-flat" onClick={this.payWithoutPunctuation}>Omitir</a>
          </div>
        </div>

        <div id="responseModal" class="modal">
          <div class="modal-content">
            <h4 class="center-align">Más información</h4>
            <p class="center-align">{this.props.displayedTransactions.responseMsg}</p>
          </div>
          <div class="modal-footer">
            <a href="#!" class="modal-close waves-effect waves-green btn-flat">Cerrar</a>
          </div>
        </div>

        <div id="eliminarMensaje" class="modal">
          <div class="modal-content">
            <h4 class="center-align">¿Eliminar la transacción?</h4>
            <p class="center-align">¿Seguro que quieres eliminar esta transacción del registro?</p>
          </div>
          <div class="modal-footer">
            <a href="#!" onClick={this.deleteTransaction} class="modal-close waves-effect waves-green btn-flat">Sí</a>
            <a href="#!" class="modal-close waves-effect waves-green btn-flat">No</a>
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
    displayedTransactions: state.displayedTransactions,
    currentUser: state.currentUser,
    auth: state.auth
  });
}

const mapActionsToProps = (dispatch, props) => {
  return bindActionCreators({
    onSetTransactions: setTransactions,
    onSetIndex: setTransactionsInteractionIndex,
    onSetServerMessage: setServerMessage,
    onUpdateTransactionInput: updateInput,
    onResetInput: resetInput
  }, dispatch); 
}

export default withCookies(connect(mapStateToProps, mapActionsToProps)(Transactions));