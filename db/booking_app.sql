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

CREATE TABLE IF NOT EXISTS user_info (
    id              int             NOT NULL AUTO_INCREMENT,
    user_id         int             NOT NULL,
    first_name      varchar(100)    NOT NULL,
    last_name       varchar(100),
    phone           varchar(50)     NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES user (id) 
);

CREATE TABLE IF NOT EXISTS pub (
    id              int             NOT NULL AUTO_INCREMENT,
    owner_id        int             NOT NULL,
    name            varchar(100)    NOT NULL,
    description     varchar(999),
    email           varchar(100),
    phone           varchar(50),
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

/* could store the type in the same table and filter based on pub and type */
CREATE TABLE IF NOT EXISTS picture (
    id              int             NOT NULL AUTO_INCREMENT,
    pub_id          int             NOT NULL,
    name            varchar(100)    NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(pub_id) REFERENCES pub (id)
);

CREATE TABLE IF NOT EXISTS guest (
    id              int             NOT NULL AUTO_INCREMENT,
    first_name      varchar(100)    NOT NULL,
    last_name       varchar(100),
    phone           varchar(50),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS booking (
    id              int             NOT NULL AUTO_INCREMENT,
    table_id        int             NOT NULL,
    is_guest        boolean         NOT NULL,
    guest_id        int,
    user_id         int,
    start           datetime        NOT NULL,
    end             datetime        NOT NULL,
    past_day        bool            NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(table_id) REFERENCES `table` (id),
    FOREIGN KEY(guest_id) REFERENCES guest (id),
    FOREIGN KEY(user_id) REFERENCES user (id)
);

/*** TEST PUB ACCOUNT ***/
INSERT INTO owner (email, password) VALUES ('testpub@email.com', 'a6818b8188b36c44d17784c5551f63accc5deaf8786f9d0ad1ae3cd8d887cbab4f777286dbb315fb14854c8774dc0d10b5567e4a705536cc2a1d61ec0a16a7a6');
INSERT INTO pub (owner_id, name, description, email, phone) VALUES (1, 'The Hayloft', 'This is the description a test pub blah blah blah blah very interesting information being displayed before your eyes blah blah blah', 'contact.TheEagle@mail.com', '0115 3073900');
INSERT INTO address (pub_id, line_1, line_2, town, country, postcode) VALUES (1, '10 Test Street', 'Nottingham', 'Giltbrook', 'England', 'NG10 3DU');
/* Opening hours */
INSERT INTO opening_hours (pub_id, day, open, close) VALUES (1, 1, '11:00', '23:00');
INSERT INTO opening_hours (pub_id, day, open, close) VALUES (1, 2, '11:00', '23:00');
INSERT INTO opening_hours (pub_id, day, open, close) VALUES (1, 3, '10:00', '22:00');
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
/* Pictures*/
INSERT INTO picture (pub_id, name) VALUES (1, 'pub1-1.jpg');
INSERT INTO picture (pub_id, name) VALUES (1, 'pub1-2.jpg');
INSERT INTO picture (pub_id, name) VALUES (1, 'pub1-3.jpg');
INSERT INTO picture (pub_id, name) VALUES (1, 'pub1-4.jpg');
INSERT INTO picture (pub_id, name) VALUES (1, 'pub1-5.jpg');
INSERT INTO picture (pub_id, name) VALUES (1, 'pub1-6.jpg');
INSERT INTO picture (pub_id, name) VALUES (1, 'pub1-7.jpg');


/*** TEST PUB ACCOUNT 2 ***/
INSERT INTO owner (email, password) VALUES ('testpub2@email.com', 'a6818b8188b36c44d17784c5551f63accc5deaf8786f9d0ad1ae3cd8d887cbab4f777286dbb315fb14854c8774dc0d10b5567e4a705536cc2a1d61ec0a16a7a6');
INSERT INTO pub (owner_id, name, description, email, phone) VALUES (1, 'Black Spaniard', 'This is the description a test pub blah blah blah blah very interesting information being displayed before your eyes blah blah blah', 'contact.Spaniard@mail.com', '0115 4725580');
INSERT INTO address (pub_id, line_1, line_2, town, country, postcode) VALUES (1, '64 Zoo Lane', 'Nottingham', 'Vrombaut', 'England', 'NG01 5VT');
/* Opening hours */
INSERT INTO opening_hours (pub_id, day, open, close) VALUES (2, 1, '11:00', '22:00');
INSERT INTO opening_hours (pub_id, day, open, close) VALUES (2, 3, '10:00', '21:00');
INSERT INTO opening_hours (pub_id, day, open, close) VALUES (2, 4, '13:00', '21:00');
INSERT INTO opening_hours (pub_id, day, open, close) VALUES (2, 5, '11:00', '23:00');
INSERT INTO opening_hours (pub_id, day, open, close) VALUES (2, 6, '15:00', '23:00');
/* Tables */
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (2, 1, 4, 0);
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (2, 2, 6, 0);
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (2, 3, 4, 1);
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (2, 4, 6, 0);
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (2, 5, 2, 0);
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (2, 6, 2, 1);
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (2, 7, 8, 0);
/* Pictures*/
INSERT INTO picture (pub_id, name) VALUES (2, 'pub2-1.jpg');
INSERT INTO picture (pub_id, name) VALUES (2, 'pub2-2.jpg');
INSERT INTO picture (pub_id, name) VALUES (2, 'pub2-3.jpg');
INSERT INTO picture (pub_id, name) VALUES (2, 'pub2-4.jpg');
INSERT INTO picture (pub_id, name) VALUES (2, 'pub2-5.jpg');
INSERT INTO picture (pub_id, name) VALUES (2, 'pub2-6.jpg');
INSERT INTO picture (pub_id, name) VALUES (2, 'pub2-7.jpg');


/*** TEST PUB ACCOUNT 3 ***/
INSERT INTO owner (email, password) VALUES ('testpub3@email.com', 'a6818b8188b36c44d17784c5551f63accc5deaf8786f9d0ad1ae3cd8d887cbab4f777286dbb315fb14854c8774dc0d10b5567e4a705536cc2a1d61ec0a16a7a6');
INSERT INTO pub (owner_id, name, description, email, phone) VALUES (1, 'Peacock Arms', 'This is the description a test pub blah blah blah blah very interesting information being displayed before your eyes blah blah blah', 'contact.peacockarms@mail.com', '0115 2484184');
INSERT INTO address (pub_id, line_1, line_2, town, country, postcode) VALUES (1, '10 Test Street', 'Nottingham', 'Giltbrook', 'England', 'NG10 3DU');
/* Opening hours */
INSERT INTO opening_hours (pub_id, day, open, close) VALUES (3, 1, '11:00', '22:00');
INSERT INTO opening_hours (pub_id, day, open, close) VALUES (3, 3, '10:00', '23:00');
INSERT INTO opening_hours (pub_id, day, open, close) VALUES (3, 5, '11:00', '01:00');
INSERT INTO opening_hours (pub_id, day, open, close) VALUES (3, 6, '15:00', '01:30');
/* Tables */
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (3, 1, 4, 0);
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (3, 2, 6, 0);
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (3, 3, 4, 1);
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (3, 4, 6, 0);
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (3, 5, 2, 0);
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (3, 6, 2, 1);
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (3, 7, 8, 0);
/* Pictures*/
INSERT INTO picture (pub_id, name) VALUES (3, 'pub3-1.jpg');
INSERT INTO picture (pub_id, name) VALUES (3, 'pub3-2.jpg');
INSERT INTO picture (pub_id, name) VALUES (3, 'pub3-3.jpg');
INSERT INTO picture (pub_id, name) VALUES (3, 'pub3-4.jpg');
INSERT INTO picture (pub_id, name) VALUES (3, 'pub3-5.jpg');
INSERT INTO picture (pub_id, name) VALUES (3, 'pub3-6.jpg');
INSERT INTO picture (pub_id, name) VALUES (3, 'pub3-7.jpg');


/*** TEST PUB ACCOUNT 4 ***/
INSERT INTO owner (email, password) VALUES ('testpub4@email.com', 'a6818b8188b36c44d17784c5551f63accc5deaf8786f9d0ad1ae3cd8d887cbab4f777286dbb315fb14854c8774dc0d10b5567e4a705536cc2a1d61ec0a16a7a6');
INSERT INTO pub (owner_id, name, description, email, phone) VALUES (1, 'The Bell', 'This is the description a test pub blah blah blah blah very interesting information being displayed before your eyes blah blah blah', 'contact.thebell@mail.com', '0115 8293153');
INSERT INTO address (pub_id, line_1, line_2, town, country, postcode) VALUES (1, '10 Test Street', 'Nottingham', 'Giltbrook', 'England', 'NG10 3DU');
/* Opening hours */
INSERT INTO opening_hours (pub_id, day, open, close) VALUES (4, 1, '11:00', '22:00');
INSERT INTO opening_hours (pub_id, day, open, close) VALUES (4, 4, '13:00', '23:00');
INSERT INTO opening_hours (pub_id, day, open, close) VALUES (4, 5, '11:00', '01:00');
INSERT INTO opening_hours (pub_id, day, open, close) VALUES (4, 6, '15:00', '01:30');
/* Tables */
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (4, 1, 4, 0);
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (4, 2, 6, 0);
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (4, 3, 4, 1);
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (4, 4, 6, 0);
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (4, 5, 2, 0);
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (4, 6, 2, 1);
INSERT INTO `table` (pub_id, table_num, seats, is_outside) VALUES (4, 7, 8, 0);
/* Pictures*/
INSERT INTO picture (pub_id, name) VALUES (4, 'pub4-1.jpg');
INSERT INTO picture (pub_id, name) VALUES (4, 'pub4-2.jpg');
INSERT INTO picture (pub_id, name) VALUES (4, 'pub4-3.jpg');
INSERT INTO picture (pub_id, name) VALUES (4, 'pub4-4.jpg');
INSERT INTO picture (pub_id, name) VALUES (4, 'pub4-5.jpg');
INSERT INTO picture (pub_id, name) VALUES (4, 'pub4-6.jpg');
INSERT INTO picture (pub_id, name) VALUES (4, 'pub4-7.jpg');


/*** TEST USER ACCOUNT ***/
INSERT INTO user (email, password) VALUES ('testuser1@email.com', 'a6818b8188b36c44d17784c5551f63accc5deaf8786f9d0ad1ae3cd8d887cbab4f777286dbb315fb14854c8774dc0d10b5567e4a705536cc2a1d61ec0a16a7a6');
INSERT INTO user_info (user_id, first_name, last_name, phone) VALUES (1, 'Richard', 'Hendricks', '0722838183');