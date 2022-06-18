import React from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { logOut } from '../../actions/user-actions'
import { withCookies } from "react-cookie";
import { setToken } from "../../actions/auth-actions";
import 'materialize-css/dist/css/materialize.min.css'
import M from 'materialize-css'
import { addImage, changeTag, resetImage, resetServiceForm, updateServiceForm } from "../../actions/service-post-actions";
import { Link } from "react-router-dom";

export class ServiceForm extends React.Component {
  constructor(props) {
    super(props);

    this.instances = undefined;
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
  }

  handleImageUpload(e) {
    let that = this;
    this.props.onResetImage();
    let files = [];
    files = [...e.target.files];
    console.log(files)
    for (let i = 0; i < files.length; i++){
        if (!/image/.test(files[i].type)) {
            console.log("Formato no válido: " + files[i].type);
        } else {
            var reader = new FileReader();
            reader.readAsDataURL(files[i]);
            reader.onloadend = function() {
                let img = reader.result.split(",")[1];
                that.props.onAddImage(img);
            };
        }
    }
  }

  handleKeyPress(e) {
    if(e.key === "Enter") {
      this.handleClick();
    }
  }

  handleChange(e) {
    if(e.target.name != "tags") {
        this.props.onUpdateServiceForm(e);
    } else {
        this.props.onChangeTag(e)
    }
  }

  handleClick() {
    if(this.props.servicePost.serviceName == "" || this.props.servicePost.serviceDescription == "" || this.props.servicePost.price == ""){
        this.instances[1].open()
        return
    }

    let parsedTags = [];
    for(let i in this.props.servicePost.tags) {
        if (this.props.servicePost.tags[i] == true) {
            parsedTags.push(i);
        }
    }
    
    let requestOptions = {
        method: 'POST',
        headers: { 
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.props.auth.authToken}`
        },
        body: JSON.stringify({
            serviceName: this.props.servicePost.serviceName,
            serviceDesc: this.props.servicePost.serviceDescription,
            price: this.props.servicePost.price,
            priceType: this.props.servicePost.priceType,
            tags: parsedTags
        })
    }

    fetch(`/services`, requestOptions).then(response => response.json()).then((e) => {         
        if(e.type == "res" && e.value == "OK") {
            for(let i in this.props.servicePost.images) {
                fetch(`/services/addimg`, {method: 'POST',
                headers: { 
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.props.auth.authToken}`
                },
                body: JSON.stringify({
                    id: e.id,
                    image: this.props.servicePost.images[i]
                })}).then(response => response.json()).then(e => {console.log(e)}).catch((e) => console.log(e));
            }
            let that = this
            this.instances[0].open();
        } else {
            alert(JSON.stringify(e))
        }
    }).catch((e)=> {
        console.log(e);
        this.props.onLogOut();
    });
  }

  componentDidMount() {
    this.props.onResetServiceForm();
    M.updateTextFields();
    let elems = document.querySelectorAll('.modal');
    this.instances = M.Modal.init(elems, {});
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
    return (
    <div class="container">
        <h1 class="center" style={{fontSize: "30px"}}>Publicar servicio</h1>
        <div class="row">
            <form class="col s12">
                <div class="row">
                <div class="input-field col s12">
                    <input placeholder="Introduzca su usuario" id="serviceName" type="text" name="serviceName" class="" onChange={this.handleChange}/>
                    <label for="serviceName">Nombre del servicio *</label>
                </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <textarea id="serviceDescription" class="materialize-textarea" name="serviceDescription" onChange={this.handleChange}></textarea>
                        <label for="serviceDescription">Descripción del servicio *</label>
                    </div>
                </div>
                <div class="file-field input-field">
                    <div class="btn">
                        <span>File</span>
                        <input type="file" multiple onChange={this.handleImageUpload} />
                    </div>
                    <div class="file-path-wrapper">
                        <input class="file-path validate" type="text" placeholder="Upload one or more files" />
                    </div>  
                </div>
                <div class="row">
                    <div class="input-field col s12 m6 l6">
                        <input placeholder="Exacto o estimado" id="price" type="number" name="price" min="0" class="" onChange={this.handleChange} />
                        <label for="price">Precio del servicio</label>
                    </div>
                    <div class="input-field col s12 m6 l6">
                        <select class="browser-default" name="priceType" onChange={this.handleChange}>
                            <option value="Total" selected>Total</option>
                            <option value="Por hora">Por hora</option>
                        </select>
                    </div>
                </div>
                <h2 style={{fontSize: "20px"}}>Tags</h2>
                <p style={{fontSize: "14px"}} class="flow-text">Puedes incorporar etiquetas a tus servicios para que sean más sencillos de encontrar por parte de los usuarios. Incluir etiquetas no es obligatorio para poder publicar el servicio.</p>
                {tags}
            </form>
            <br/>
            <div class="row">
                <a class="waves-effect waves-light btn col s12" onClick={this.handleClick}>Publicar anuncio</a>
            </div>
        </div>
        <div id="modal1" class="modal">
            <div class="center modal-content">
                <h4>Anuncio publicado</h4>
                <p>El anuncio ha sido publicado correctamente</p>
            </div>
            <div class="modal-footer">
                <div class="row">
                    <Link to="/" onClick={() => {this.instances[0].close()}}><a class="waves-effect waves-light btn col s12">Aceptar</a></Link>
                </div>
            </div>
        </div>
        <div id="errormodal" class="modal">
            <div class="center modal-content">
                <h4>Error al publicar el anuncio</h4>
                <p>El anuncio debe contener nombre, precio y descripción para poder ser publicado</p>
            </div>
            <div class="modal-footer">
                <div class="row">
                    <a class="waves-effect waves-light btn col s12" onClick={() => {this.instances[1].close()}}>Aceptar</a>
                </div>
            </div>
        </div>
    </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return ({
    currentUser: state.currentUser,
    signIn: state.signIn,
    auth: state.auth,
    servicePost: state.servicePost
  });
}

const mapActionsToProps = (dispatch, props) => {
  return bindActionCreators({
    onLogOut: logOut,
    onSetToken: setToken,
    onUpdateServiceForm: updateServiceForm,
    onResetServiceForm: resetServiceForm,
    onAddImage: addImage,
    onResetImage: resetImage,
    onChangeTag: changeTag
  }, dispatch); 
}

export default withCookies(connect(mapStateToProps, mapActionsToProps)(ServiceForm));