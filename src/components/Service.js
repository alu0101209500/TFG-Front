import React from "react";
import Main from "./page-elements/Main";
import { Link, NavLink, Navigate } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withCookies } from "react-cookie";
import {resetSearch, updateDisplayedService } from "../actions/displayed-services-actions";
import 'materialize-css/dist/css/materialize.min.css'
import M from 'materialize-css'

export class Service extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
        var elems = document.querySelectorAll('.slider');
        var instances = M.Slider.init(elems, {height: 230});
        var elems2 = document.querySelectorAll('.materialboxed');
        var instances2 = M.Materialbox.init(elems2, {});
  }

  componentDidUpdate() {
    console.log("UPDATE")
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
    
    
    if(this.props.displayedServices.displayed.serviceName == undefined || this.props.displayedServices.homeredirect == true) {
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
        
      return(
        <Main>
            <div class="container">
                <br />
                <h1 class="center">{this.props.displayedServices.displayed.serviceName}</h1>
                <div class="slider" style={{height: "250px"}}>
                    <ul class="slides" style={{height: "250px"}}>
                    {carousel}
                    </ul>
                </div>
                <br/>
                <div class="rigth">{this.props.displayedServices.displayed.postedBy}</div>
                <p class="flow-text">{this.props.displayedServices.displayed.serviceDesc}</p>
            </div>
            <br/>
        </Main>
      );
    }
  }
}

const mapStateToProps = (state, props) => {
  return ({
    displayedServices: state.displayedServices
  });
}

const mapActionsToProps = (dispatch, props) => {
  return bindActionCreators({
    onResetSearch: resetSearch,
    onUpdateDisplayedService: updateDisplayedService
  }, dispatch); 
}

export default withCookies(connect(mapStateToProps, mapActionsToProps)(Service));