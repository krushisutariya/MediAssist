CREATE DATABASE MediAssist;

-- Session Table
CREATE TABLE Session (
    sid VARCHAR(255) NOT NULL,
    sess json NOT NULL,
    expire TIMESTAMP(6) NOT NULL,
    PRIMARY KEY (sid)
);

-- UserS Table
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
    username VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    gender CHAR(1),
    height FLOAT,
    weight FLOAT,
    blood_group VARCHAR(3),
    diseases VARCHAR(255),
    past_history VARCHAR(1023),
    address VARCHAR(255),
    contact VARCHAR(255),
    PRIMARY KEY (id)
);

-- Hospital Table
CREATE TABLE Hospital(
	EMAIL VARCHAR(255),
	USERNAME VARCHAR(255),
	NAME VARCHAR(255),
	LOCATION VARCHAR(1023),
	ADDRESS VARCHAR(1023),
	TOTAL_DOCTORS INT,
	SPECIALITIES VARCHAR(1023),
	INSURANCE_POLICIES VARCHAR(1023),
	CASHLESS VARCHAR(3),
	ICU INT,
	IICU INT,
	OPERATION_THEATRES INT,
	GENERAL_WARD INT,
	NURSE INT,
	INTERNS INT,
	OT_TECHNICIANS INT,
	PRIMARY KEY(EMAIL)
);

-- Hospital Contact Table
CREATE TABLE Hospital_Contact(
    INDEX INTEGER,
	EMAIL VARCHAR(255),
	CONTACT VARCHAR(20),
	PRIMARY KEY (EMAIL, CONTACT)
);

--Stores
CREATE TABLE Stores(
    email_pharm VARCHAR(255),
    medicine_name VARCHAR(255),
    brand_name VARCHAR(255),
    stock INT,
    PRIMARY KEY(email_pharm,medicine_name,brand_name),
    FOREIGN KEY(email_pharm) REFERENCES Pharmacy(email),
    FOREIGN KEY(medicine_name,brand_name) REFERENCES Medicine
);

--Access
CREATE TABLE Access(
    email_hospital VARCHAR(255),
    email_driver VARCHAR(255),
    PRIMARY KEY (email_hospital,email_driver),
    FOREIGN KEY(email_hospital) REFERENCES Hospital(EMAIL),
    FOREIGN KEY(email_driver) REFERENCES Ambulance_driver(email) 
);

-- Gov_Agency
CREATE TABLE Gov_Agency(
    email VARCHAR(255) NOT NULL,
    agency_id VARCHAR(20) NOT NULL,
    PRIMARY KEY (email,agency_id)
);