import React from "react";
import { NavLink } from "react-router-dom";
import "../../index.css";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import 'materialize-css/dist/css/materialize.min.css'
import M from 'materialize-css'
import { resetFilters, updateDisplay, updateFilters, updateFiltersTags, updateSearch } from "../../actions/displayed-services-actions";

export class AdvancedSearchForm extends React.Component {
  constructor() {
    super();
  
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(e) {
    if(e.target.name == "tags") {
      this.props.onUpdateFiltersTags(e);  
    } else if(e.target.name == "searchBar"){
      this.props.onUpdateSearch(e.target.value);
    } else {
      this.props.onUpdateFilters(e);
    }
  }

  handleClick() { 
    let searchtext = this.props.displayedServices.search;
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

    let queryBody = {
        search: searchtext,
        page: "0",
        ipp: this.props.displayedServices.ipp,
        datefrom: datefrom,
        dateto: dateto,
        pricefrom: this.props.displayedServices.filters.pricefrom,
        priceto: this.props.displayedServices.filters.priceto,
        priceType: this.props.displayedServices.filters.priceType,
        tags: [...parsedTags]
    }

    fetch(`/services/search`, {
      method: 'POST',
      headers: { 
        'Accept': '*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({...queryBody})
    }).then(response => response.json()).then((e) => {
        if (e.type === "res") {
          this.props.onUpdateDisplay({
            services: [...e.value],
            page: 1,
            search: searchtext,
            filters: {...this.props.displayedServices.filters}
          })
        } else {
          alert(e.value);
        }

      }).catch((e)=> {
        console.log(e);
    });
  }

  componentDidMount() {
    this.props.onResetFilters();
    M.updateTextFields();
    this.props.onUpdateSearch("")
  }

  render() {
    let taglist = ["Diseño web","Software","Traducción","Trámites legales","Redacción","Correcciones","Composición musical","Ilustración","Modelado 3D","Edición de vídeos","Edición de imágenes","Márketing","Asesoría","Idiomas","Otro"]
    let tags = []
    for(let i in taglist){
        tags.push(
            <label class="input-field col s12 m12 l4">
              <input type="checkbox" name="tags" value={taglist[i]} class="filled-in" onChange={this.handleChange} />
              <span>{taglist[i]}</span>
            </label>
          )
    }

    let content = 
    <div class="container">
        <h1 class="center" style={{fontSize: "30px"}}>Búsqueda avanzada</h1>
        <div class="row">
            <form class="col s12">
                <div class="row">
                  <div class="input-field col s12">
                      
                      <input placeholder="Busqueda..." type="text" name="searchBar" class="" onChange={this.handleChange}/>
                  </div>
                </div>
                <br/><br/>
                
                <div class="row">
                  <div class="input-field col s12 m6 l6">             
                      <input id="datefrom" placeholder="Desde..." type="datetime-local" name="datefrom" onChange={this.handleChange} />
                      <label class="active" for="datefrom">Fecha desde: </label>
                  </div>
                  <div class="input-field col s12 m6 l6">             
                      <input id="dateto" placeholder="Hasta..." type="datetime-local" name="dateto" onChange={this.handleChange} />
                      <label class="active" for="dateto">Fecha hasta: </label>
                  </div>
                </div>
                <br/><br/>
                <div class="row">
                  <div class="input-field col s12 m6 l6">             
                      <input id="pricefrom" placeholder="Desde..." type="number" min="0" name="pricefrom" onChange={this.handleChange} />
                      <label for="pricefrom">Precio desde: </label>
                  </div>
                  <div class="input-field col s12 m6 l6">             
                      <input id="priceto" placeholder="Hasta..." type="number" min="0" name="priceto" onChange={this.handleChange} />
                      <label for="priceto">Precio hasta: </label>
                  </div>
                </div>
                <br/><br/>

                <div class="row">
                  <div class="input-field col s12">
                      <select class="browser-default" name="priceType" onChange={this.handleChange}>
                          <option value="Cualquiera" selected>Cualquiera</option>
                          <option value="Total">Total</option>
                          <option value="Por hora">Por hora</option>
                      </select>
                  </div>
                </div>
                <h2 style={{fontSize: "20px"}}>Tags</h2>
                {tags}
            </form>
            <br/>
            <div class="row">
              <NavLink to="/"><a class="waves-effect waves-light btn col s12" onClick={this.handleClick}>Buscar</a></NavLink>
            </div>
            <br/>
        </div>

    </div>

    return (
      content
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
    onUpdateFilters: updateFilters,
    onUpdateFiltersTags: updateFiltersTags,
    onUpdateSearch: updateSearch,
    onResetFilters: resetFilters,
    onUpdateDisplay: updateDisplay
  }, dispatch); 
}

export default connect(mapStateToProps, mapActionsToProps)(AdvancedSearchForm);