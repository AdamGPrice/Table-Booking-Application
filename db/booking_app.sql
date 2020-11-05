CREATE DATABASE IF NOT EXISTS booking_app;

USE booking_app;

CREATE TABLE IF NOT EXISTS business(
    id          SERIAL          NOT NULL AUTO_INCREMENT,
    email       varchar(100)    NOT NULL UNIQUE,
    password    varchar(250)    NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS user(
    id          SERIAL          NOT NULL AUTO_INCREMENT,
    email       varchar(100)    NOT NULL UNIQUE,
    password    varchar(250)    NOT NULL,
    PRIMARY KEY(id)
);