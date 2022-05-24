import React from "react";
import 'materialize-css/dist/css/materialize.min.css'
import M from 'materialize-css'

function Main(props) {
    let mainStyles = {
        minHeight: "80vh",
        marginTop: "5vh",
        marginBottom: "5%",
        marginLeft: "10%",
        marginRight: "10%",
        width: "80%",
        backgroundColor: "white",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
    } 

    return (
        <div style={mainStyles}>
            {props.children}
        </div>
    );
}

export default Main;