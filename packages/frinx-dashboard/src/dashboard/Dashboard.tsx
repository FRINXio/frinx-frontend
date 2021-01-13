import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import Panel from "./panel/Panel";
import {
  faCogs,
  faLaptopCode,
  faBoxOpen,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

function isURLDisabled(envValue: string | undefined) {
  return envValue !== "true";
}

const PANELS = [
  {
    title: "UniConfig",
    description: "Manage network device configurations.",
    url: window.CONFIG.url_uniconfig,
    isExternal: false,
    icon: faLaptopCode,
    isDisabled: isURLDisabled(window.CONFIG.uniconfig_enabled),
  },
  {
    title: "UniFlow",
    description: "Create, organize and execute workflows.",
    url: window.CONFIG.url_uniflow,
    isExternal: false,
    icon: faCogs,
    isDisabled: isURLDisabled(window.CONFIG.uniflow_enabled),
  },
  {
    title: "Inventory & Logs",
    description: "Manage network device configurations.",
    url: window.CONFIG.url_inventory,
    isExternal: false,
    icon: faBoxOpen,
    isDisabled: isURLDisabled(window.CONFIG.inventory_enabled),
  },
  {
    title: "User Management",
    description: "Manage users and permissions.",
    url: window.CONFIG.url_usermanagement,
    isExternal: true,
    icon: faUsers,
    isDisabled: isURLDisabled(window.CONFIG.usermanagement_enabled),
  },
];

function Dashboard() {
  return (
    <Container>
      <Row>
        {PANELS.map((p) => {
          return (
            <Col key={p.title}>
              <Panel
                title={p.title}
                description={p.description}
                icon={p.icon}
                style={{ background: "linear-gradient" }}
                url={p.url}
                isExternal={p.isExternal}
                isDisabled={p.isDisabled}
              />
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export default Dashboard;
