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

-- Medicine Table
CREATE TABLE Medicine(
    medicine_name VARCHAR(255),
    brand_name VARCHAR(255),
    PRIMARY KEY(medicine_name, brand_name)
);

-- Pharmacy Table
CREATE TABLE Pharmacy(
    email VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    contact CHAR(10),
    email_hospital CHAR(255),
    PRIMARY KEY(email),
    FOREIGN KEY(email_hospital) REFERENCES Hospital(EMAIL)
);

-- Works Table
CREATE TABLE works(
    doc_reg_no VARCHAR(12),
    email VARCHAR(12),
    start_time TIME,
    end_time TIME,
    salary DECIMAL(9,2),
    PRIMARY KEY(doc_reg_no,email),
    FOREIGN KEY(doc_reg_no) REFERENCES Doctor(reg_no),
    FOREIGN KEY(email) REFERENCES Hospital(EMAIL)
);