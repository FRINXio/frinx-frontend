import React, { Component } from "react";
import "./Header.css";
import logo from "./logo-min.png";
import { Navbar, Nav, Badge } from "react-bootstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { NavLink, withRouter } from "react-router-dom";

class Header extends Component {
  constructor(props) {
    super(props);
    library.add(faSignOutAlt);
  }

  logOut() {
    this.props.history.push("/logout");
  }

  getGreeting() {
    let d = new Date();
    let time = d.getHours();

    if (time <= 12 && time > 5) {
      return "Good morning";
    }
    if (time > 12 && time <= 17) {
      return "Good afternoon";
    }
    if (time > 17 || time <= 5) {
      return "Good evening";
    }
  }

  render() {
    let isLogoutDisabled = process.env.REACT_APP_LOGIN_ENABLED === "false";

    return (
      <Navbar className="navbarHeader">
        <Navbar.Brand>
          <NavLink to="/">
            <img alt="" src={logo} />
            <Badge
              style={{ fontSize: "55%", marginLeft: "10px" }}
              variant="light"
            >
              {process.env.REACT_APP_VERSION}
            </Badge>
          </NavLink>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text style={{ textAlign: "right" }}>
            {this.getGreeting()}, <b>{this.props.email}</b>
            <br />
          </Navbar.Text>
          <Nav>
            <Nav.Link
              disabled={isLogoutDisabled}
              className="nav-linkHeader"
              onClick={this.logOut.bind(this)}
            >
              <FontAwesomeIcon icon="sign-out-alt" />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default withRouter(Header);
