import React, { FC } from 'react';
import { Navbar } from 'react-bootstrap';
import UserNav from './UserNav';
import './Header.css';
import logo from './logo-min.png';

import { BrowserRouter as Router, Switch, Route, Link, useParams, useRouteMatch } from 'react-router-dom';

const Header: FC<{ isAuthEnabled: boolean }> = ({ isAuthEnabled }) => {
  return (
    <Navbar className="navbarHeader">
      <Navbar.Brand href={window.CONFIG.public_url}>
        <img src={logo} alt="logo" />
      </Navbar.Brand>
      {isAuthEnabled ? <UserNav /> : null}
      <ul style={{ width: '200px', display: 'flex', flexDirection: 'row', listStyle: 'none' }}>
        <li style={{ marginRight: '20px' }}>
          <Link to="/" style={{ color: 'white' }}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/uniflow/ui" style={{ color: 'white' }}>
            UniFlow
          </Link>
        </li>
      </ul>
    </Navbar>
  );
};

export default Header;
