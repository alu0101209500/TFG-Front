import React from "react";
import Main from "./page-elements/Main";
import { Link, NavLink } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withCookies } from "react-cookie";
import ServiceCard from "./page-elements/ServiceCard";
import { addContent, resetSearch, setRedirect, updateDisplay, updateDisplayedService } from "../actions/displayed-services-actions";

export class Homepage extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
  }

  handleRedirect(element) {
    this.props.onSetRedirect(false)
    this.props.onUpdateDisplayedService(element.target.id)
  }

  handleClick() {
    let parsedTags = [];
    for(let i in this.props.displayedServices.filters.tags) {
        if (this.props.displayedServices.filters.tags[i] == true) {
          parsedTags.push(i);
        }
    }
    let datefrom = "";
    let dateto = "";

    if(this.props.displayedServices.filters.datefrom != "") {
      datefrom = new Date(this.props.displayedServices.filters.datefrom).getTime()
    }

    if(this.props.displayedServices.filters.dateto != "") {
      dateto = new Date(this.props.displayedServices.filters.dateto).getTime()
    }

    fetch(`/services/search`, {
      method: 'POST',
      headers: { 
        'Accept': '*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        search: this.props.displayedServices.search,
        page: this.props.displayedServices.page,
        ipp: this.props.displayedServices.ipp,
        datefrom: datefrom,
        dateto: dateto,
        pricefrom: this.props.displayedServices.filters.paymentfrom,
        priceto: this.props.displayedServices.filters.paymentto,
        priceType: this.props.displayedServices.filters.priceType,
        tags: [...parsedTags]  
      })
    }).then(response => response.json()).then((e) => {
        if (e.type === "res") {
          this.props.onAddContent([...e.value])
        } else {
          alert(e.value)
        }

      }).catch((e)=> {
        console.log(e);
      });
  }

  //componentDidUpdate() {
  //  this.props.onSetRedirect(false)
  //}
  componentDidMount() {
    this.props.onSetRedirect(false)
  }

  render() {
    let items = [];

    for (let i = 0; i < this.props.displayedServices.services.length; i++) {
      items.push(
        <div class="col l3 m6 s12" onClick={this.handleRedirect} id = {String(this.props.displayedServices.services[i]._id)}>
          <Link to="/service">
            <ServiceCard  elementInfo = {{...this.props.displayedServices.services[i]}} id = {String(this.props.displayedServices.services[i]._id)} key = {String(this.props.displayedServices.services[i]._id)} />
          </Link>
          
        </div>
      )
    }
    let contentloader = <br/>
    if(this.props.displayedServices.services.length%this.props.displayedServices.ipp == 0 && this.props.displayedServices.services.length) {
      contentloader = 
      <div class="center" style={{borderColor: "lightgray", borderStyle: "solid", borderWidth: "thin"}} onClick={this.handleClick}>
        <p>Cargar más anuncios...</p>
      </div>
    }
    return (
      <Main>
        <div class="row">
          {items}
        </div>
        {contentloader}  
      </Main>
    );
  }
}

const mapStateToProps = (state, props) => {
  return ({
    displayedServices: state.displayedServices
  });
}

const mapActionsToProps = (dispatch, props) => {
  return bindActionCreators({
    onAddContent: addContent,
    onResetSearch: resetSearch,
    onUpdateDisplayedService: updateDisplayedService,
    onUpdateDisplay: updateDisplay,
    onSetRedirect: setRedirect
  }, dispatch); 
}

export default withCookies(connect(mapStateToProps, mapActionsToProps)(Homepage));
