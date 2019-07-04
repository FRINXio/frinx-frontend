import React, {Component} from 'react';
import './Login.css';
import {Button, Col, Container, Form, InputGroup, Row} from 'react-bootstrap';
import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faLock, faUser, faTimes, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import logoWhite from './logoWhite.png';
import * as authActions from "../../store/actions/auth";
import {connect} from "react-redux";

class Login extends Component {

    constructor(props){
        super(props);
        library.add(faUser, faLock);
        this.state = {
            activeUsername: false,
            activePassword: false,
            password: '',
            email: '',
            error: ''
        };
        this.setEmail = this.setEmail.bind(this);
        this.setPassword = this.setPassword.bind(this);
    }

    redirectToRegister = (e) => {
        e.preventDefault();
        this.props.switchAuth();
        this.props.history.push('/registration');
    };

    login = (e) => {
        e.preventDefault();
        this.props.onAuth(this.state.email, this.state.password, false);
    };

    setEmail(event) {
        this.setState({email: event.target.value});
    }

    setPassword(event) {
        this.setState({password: event.target.value});
    }

    render(){

        let {error} = this.props.authReducer;
        let errorMsg = error ? error.response.body.error.message : null;

        return(
            <Container>
                <div className="accessPanel">
                <Row>
                    <Col className="whiteBg" xs="7">
                        <div className="loginWindow">
                        <h1>Sign in</h1>
                        <center>
                            <Form onSubmit={this.logIn}>
                                <InputGroup className={!this.state.activeUsername ? "input-user pretty-feild paddedFeild" : "input-user pretty-feild paddedFeild focusedInput"}>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="user-addon"><FontAwesomeIcon icon={faEnvelope} /></InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <input onFocus={() => {this.setState({activeUsername: true})}} onBlur={() => {this.setState({activeUsername: false})}} type="email" placeholder="Email" onChange={this.setEmail}/>
                                </InputGroup>
                                <InputGroup className={!this.state.activePassword ? "input-password pretty-feild paddedFeild" : "input-password pretty-feild paddedFeild focusedInput"}>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="password-addon"><FontAwesomeIcon icon={faLock} /></InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <input onFocus={() => {this.setState({activePassword: true})}} onBlur={() => {this.setState({activePassword: false})}} type="password" placeholder="Password" onChange={this.setPassword}/>
                                </InputGroup>
                            </Form>
                        </center>
                            <div style={{marginTop: "20px"}} className={ error ? 'wrongLogin' : 'hidden'}>
                                <FontAwesomeIcon icon={faTimes} /> {errorMsg}
                            </div>
                        <Button variant="primary" onClick={this.login} style={{width: "334px"}} className="paddedButton">
                            Sign in
                        </Button>
                            <br/>
                        <Button variant="primary" onClick={this.props.logIn} style={{width: "334px"}} className="paddedButton">
                            Sign in using Facebook
                        </Button>
                        </div>
                        <br />
                        <br />
                    </Col>
                    <Col className="gradientBg" xs="5">
                        <div className="registerWindow">
                        <h1>Sign up</h1>
                        Don't have an account yet? You can:<br />
                        <Button className="btn-margin" variant="outline-light" type="submit">
                            Sign up using Facebook
                        </Button><br />
                        or<br />
                        <Button className="btn-margin" variant="outline-light" onClick={this.redirectToRegister}>
                            Register as a new user
                        </Button>
                        <br />
                        <a href="https://frinx.io"><img className="logo" alt="Logo" src={logoWhite}/></a>
                        </div>
                    </Col>
                </Row>
                </div>
            </Container>
            
        )
    }
}

const mapStateToProps = state => {
    return {
        authReducer: state.authReducer,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(authActions.auth(email, password, isSignup)),
        switchAuth: () => dispatch(authActions.switchAuth())
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Login);