CREATE DATABASE MediAssist;

-- Sessions Table
CREATE TABLE Session (
    sid VARCHAR(255) NOT NULL,
    sess json NOT NULL,
    expire TIMESTAMP(6) NOT NULL,
    PRIMARY KEY (sid)
);

-- User Table
CREATE TABLE Users (
    id VARCHAR(255),
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
	name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

-- Patient Table
CREATE TABLE Patient (
    id CHAR(12),
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    gender CHAR(1),
    height FLOAT,
    weight FLOAT,
    blood_group VARCHAR(3),
    diseases VARCHAR(255),
    past_history VARCHAR(1023),
    address VARCHAR(255),
    contact VARCHAR(255)
);