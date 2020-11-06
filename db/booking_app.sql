CREATE DATABASE IF NOT EXISTS booking_app;

USE booking_app;

CREATE TABLE IF NOT EXISTS owner (
    id              int             NOT NULL AUTO_INCREMENT,
    email           varchar(100)    NOT NULL UNIQUE,
    password        varchar(250)    NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS user (
    id              int             NOT NULL AUTO_INCREMENT,
    email           varchar(100)    NOT NULL UNIQUE,
    password        varchar(250)    NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS pub (
    id              int             NOT NULL AUTO_INCREMENT,
    owner_id        int             NOT NULL,
    name            varchar(100)    NOT NULL,
    description     varchar(999),
    email           varchar(100),
    phone           varchar(11),
    PRIMARY KEY(id),
    FOREIGN KEY(owner_id) REFERENCES owner (id)
);

CREATE TABLE IF NOT EXISTS address (
    id              int             NOT NULL AUTO_INCREMENT,
    pub_id          int             NOT NULL,
    line_1          varchar(255)    NOT NULL,
    line_2          varchar(255),
    town            varchar(35)     NOT NULL,
    country         varchar(35),
    postcode        varchar(8)      NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(pub_id) REFERENCES pub (id)
);

CREATE TABLE IF NOT EXISTS opening_hours (
    id              int             NOT NULL AUTO_INCREMENT,
    pub_id          int             NOT NULL,
    day             int             NOT NULL,
    open            timestamp       NOT NULL,
    close           timestamp       NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(pub_id) REFERENCES pub (id)
);