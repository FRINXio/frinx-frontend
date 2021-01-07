import React, { FC } from "react";
import { Navbar } from "react-bootstrap";
import UserNav from "./UserNav";
import "./Header.css";
import logo from "./logo-min.png";

const Header: FC<{ isAuthEnabled: boolean }> = ({ isAuthEnabled }) => {
  return (
    <Navbar className="navbarHeader">
      <Navbar.Brand href={process.env.PUBLIC_URL}>
        <img src={logo} alt="logo" />
      </Navbar.Brand>
      {isAuthEnabled ? <UserNav /> : null}
    </Navbar>
  );
};

export default Header;
