import React from 'react';
import {Alert} from "react-bootstrap";

const customAlertCss = {
    position: "absolute",
    width: "100%",
    zIndex: "9"
};

const CustomAlert = (props) => {
    return (
        <div style={customAlertCss}>
            {props.show ?
                <Alert variant={props.alertVariant} dismissible
                       onClose={() => props.showCustomAlert(false, "")}
                       style={{textAlign: "right"}}>
                    {props.alertVariant === "danger" ?
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