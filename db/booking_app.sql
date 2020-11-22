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
    open            time            NOT NULL,
    close           time            NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(pub_id) REFERENCES pub (id)
);

CREATE TABLE IF NOT EXISTS `table` (
    id              int             NOT NULL AUTO_INCREMENT,
    pub_id          int             NOT NULL,
    table_num       int             NOT NULL,
    seats           int             NOT NULL,
    is_outside      boolean         NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(pub_id) REFERENCES pub (id),
    UNIQUE (pub_id, table_num)
);

/* TEST PUB ACCOUNT */
INSERT INTO owner (email, password) VALUES ('testpub@email.com', 'bd05882172acae1ec49222d55aed4aa719372458fe9a144ec85e30d773fe36ef039a371ed63e283dcbd4f3d81b98398183e8a3a3a8bd43aab40a4279769e36a1');
INSERT INTO pub (owner_id, name, description, email, phone) VALUES (1, 'Test Pub', 'A pub for testing', 'test@contact.com', 19289289323);
INSERT INTO address (pub_id, line_1, line_2, town, country, postcode) VALUES (1, '10 Test Street', 'Nottingham', 'Giltbrook', 'England', 'NG10 3DU');
/* Opening hours */
INSERT INTO opening_hours (pub_id, day, open, close) VALUES (1, 1, '11:00', '23:00');
INSERT INTO opening_hours (pub_id, day, open, close) VALUES (1, 2, '11:00', '23:00');
INSERT INTO opening_hours (pub_id, day, open, close) VALUES (1, 3, '10:00', '22:00');
INSERT INTO opening_hours (pub_id, day, open, close) VALUES (1, 4, '10:00', '22:00');
INSERT INTO opening_hours (pub_id, day, open, close) VALUES (1, 5, '11:00', '02:00');
INSERT INTO opening_hours (pub_id, day, open, close) VALUES (1, 6, '15:00', '02:00');
/* Tables */
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (1, 1, 4, 0);
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (1, 2, 6, 0);
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (1, 3, 4, 1);
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (1, 4, 6, 0);
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (1, 5, 2, 0);
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (1, 6, 2, 1);
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (1, 7, 8, 0);