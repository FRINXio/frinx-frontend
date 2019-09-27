import React from 'react';
import {Alert} from "react-bootstrap";


const CustomAlert = (props) => {
    return (
        <div>
            {props.show ?
                <Alert variant={props.alertVariant} dismissible
                       onClose={() => props.showCustomAlert(false, "")}
                       style={{margin: "0", textAlign: "right"}}>
                    {props.variant === "danger" ?
                        <i className="fas fa-exclamation-triangle"/>
                        :
                        <i className="fas fa-info-circle"/>}
                    &nbsp;&nbsp;{props.msg}
                </Alert>
                : null}
        </div>
    )
};

export default CustomAlert