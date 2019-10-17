import React, { Component } from "react";
import "./Registration.css";
import "./Login.css";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faUser,
  faTimes,
  faEnvelope,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import logoWhite from "../auth/logoWhite.png";
import * as authActions from "../../store/actions/auth";
import { connect } from "react-redux";

class Registration extends Component {
  constructor(props) {
    super(props);
    library.add(faUser, faLock);
    this.state = {
      activeUseremail: false,
      activePassword: false,
      password: "",
      email: "",
      error: ""
    };
    this.setUseremail = this.setUseremail.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.redirectToLogin = this.redirectToLogin.bind(this);
  }

  redirectToLogin = e => {
    e.preventDefault();
    this.props.switchAuth();
    this.props.history.push("/login");
  };

  setUseremail(event) {
    this.setState({ email: event.target.value });
  }

  setPassword(event) {
    this.setState({ password: event.target.value });
  }

  register = e => {
    e.preventDefault();
    this.props.onAuth(this.state.email, this.state.password, true);
  };

  render() {
    let { error, loading } = this.props.authReducer;
    let errorMsg = error ? error.response.body.error.message : null;

    return (
      <Container>
        <div className="accessPanel">
          <Row>
            <Col className="logoBg" xs="4">
              <div>
                <a href="https://frinx.io">
                  <img className="logo" alt="Logo" src={logoWhite} />
                </a>
              </div>
            </Col>
            <Col xs="1">
              <div className="loginWindow">
                <FontAwesomeIcon
                  className="pointer"
                  icon={faArrowLeft}
                  onClick={this.redirectToLogin}
                />
              </div>
            </Col>
            <Col className="whiteBg" xs="6">
              <div className="loginWindow">
                <h1>Sign Up</h1>
                <center>
                  <Form>
                    <InputGroup
                      className={
                        !this.state.activeUseremail
                          ? "pretty-feild paddedFeild"
                          : "input-email pretty-feild paddedFeild focusedInput"
                      }
                    >
                      <InputGroup.Prepend>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faEnvelope} />
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <input
                        onFocus={() => {
                          this.setState({ activeUseremail: true });
                        }}
                        onBlur={() => {
                          this.setState({ activeUseremail: false });
                        }}
                        type="email"
                        placeholder="Email"
                        onChange={this.setUseremail}
                      />
                    </InputGroup>
                    <InputGroup
                      className={
                        !this.state.activePassword
                          ? "pretty-feild paddedFeild"
                          : "input-password pretty-feild paddedFeild focusedInput"
                      }
                    >
                      <InputGroup.Prepend>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faLock} />
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <input
                        onFocus={() => {
                          this.setState({ activePassword: true });
                        }}
                        onBlur={() => {
                          this.setState({ activePassword: false });
                        }}
                        type="password"
                        placeholder="Password"
                        onChange={this.setPassword}
                      />
                    </InputGroup>
                  </Form>
                </center>
                <Button
                  variant="primary"
                  disabled={loading}
                  onClick={this.register}
                  style={{ width: "334px", marginTop: "15px" }}
                  className="gradientBtn"
                >
                  {loading ? <i className="fas fa-spinner fa-spin" /> : null}
                  {loading ? " Signing up..." : "Sign Up"}
                </Button>
                <div
                  style={{ marginTop: "20px" }}
                  className={error ? "wrongLogin" : "hidden"}
                >
                  <FontAwesomeIcon icon={faTimes} /> {errorMsg}
                </div>
              </div>
              <br />
            </Col>
            <Col className="whiteBg" xs="1" />
          </Row>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    authReducer: state.authReducer
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignup) =>
      dispatch(authActions.auth(email, password, isSignup)),
    switchAuth: () => dispatch(authActions.switchAuth())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Registration);
