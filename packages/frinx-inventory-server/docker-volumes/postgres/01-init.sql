CREATE DATABASE "frinx";

\c "frinx";

CREATE TABLE IF NOT EXISTS tenants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS uniconfig_zones (
    id SERIAL PRIMARY KEY,
    name VARCHAR(250) NOT NULL UNIQUE,
    tenant INTEGER,
    FOREIGN KEY (tenant) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS device_inventory (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50),
    management_ip inet,
    config json,
    location VARCHAR(255),
    model VARCHAR(255),
    sw VARCHAR(50),
    sw_version VARCHAR(50),
    mac_address macaddr,
    serial_number VARCHAR(50),
    vendor VARCHAR(50),
    uniconfig_zone INTEGER,
    mount_parameters jsonb,
    username VARCHAR(50),
    password VARCHAR(50),
    FOREIGN KEY (uniconfig_zone) REFERENCES uniconfig_zones(id) ON DELETE CASCADE
);
