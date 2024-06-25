CREATE DATABASE MediAssist;

-- Session Table
CREATE TABLE Session (
    sid VARCHAR(255) NOT NULL,
    sess json NOT NULL,
    expire TIMESTAMP(6) NOT NULL,
    PRIMARY KEY (sid)
);

-- Users Table
CREATE TABLE Users (
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    PRIMARY KEY (email)
);

-- Patient Table
CREATE TABLE Patient (
    id CHAR(12) NOT NULL,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    gender CHAR(1),
    height FLOAT,
    weight FLOAT,
    birth_date VARCHAR(10),
    blood_group VARCHAR(3),
    diseases VARCHAR(255),
    past_history VARCHAR(1023),
    address VARCHAR(255),
    contact CHAR(10),
    location VARCHAR(20),
    PRIMARY KEY (email),
    FOREIGN KEY (email) REFERENCES Users(email),
    FOREIGN KEY (username) REFERENCES Users(username)
);

-- Hospital Table
CREATE TABLE Hospital(
	EMAIL VARCHAR(255) NOT NULL,
	USERNAME VARCHAR(255) NOT NULL,
	NAME VARCHAR(255) NOT NULL,
	LOCATION VARCHAR(20),
	ADDRESS VARCHAR(1023),
	SPECIALITIES VARCHAR(1023),
	INSURANCE_POLICIES VARCHAR(1023),
	CASHLESS VARCHAR(3),
	ICU INT,
	IICU INT,
	OPERATION_THEATRE INT,
	GENERAL_WARD INT,
	NURSE INT,
	INTERN INT,
	OT_TECHNICIAN INT,
	PRIMARY KEY(EMAIL),
    FOREIGN KEY (email) REFERENCES Users(email),
    FOREIGN KEY (username) REFERENCES Users(username)
);

-- Hospital Contact Table
CREATE TABLE Hospital_Contact(
    INDEX INTEGER,
	EMAIL VARCHAR(255),
	CONTACT VARCHAR(20),
	PRIMARY KEY (EMAIL, CONTACT)
);

-- Doctor Table
CREATE TABLE Doctor(
    REG_NO VARCHAR(15),
    EMAIL VARCHAR(255) NOT NULL,
    USERNAME VARCHAR(255) NOT NULL,
    NAME VARCHAR(255) NOT NULL,
    GENDER CHAR(1),
    QUALIFICATION VARCHAR(512),
    EXPERIENCE VARCHAR(255),
    CONTACT CHAR(10),
    INSTITUTE VARCHAR(255),
    ADDRESS VARCHAR(1023),
    SPECIALIZATION VARCHAR(255),
    PRIMARY KEY (EMAIL),
    FOREIGN KEY (email) REFERENCES Users(email),
    FOREIGN KEY (username) REFERENCES Users(username)
);

-- Pharmacy Table
CREATE TABLE Pharmacy(
    email VARCHAR(255) NOT NULL,
	username VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact CHAR(10),
    email_hospital VARCHAR(255) NOT NULL,
    PRIMARY KEY(email),
    FOREIGN KEY(email_hospital) REFERENCES Hospital(EMAIL),
    FOREIGN KEY (email) REFERENCES Users(email),
    FOREIGN KEY (username) REFERENCES Users(username)
);

--Laboratory table
CREATE TABLE Laboratory(
    email VARCHAR(255) NOT NULL,
	username VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact CHAR(10) ,
    instruments VARCHAR(255),
    email_hospital VARCHAR(255) NOT NULL,
    FOREIGN KEY (email_hospital) REFERENCES Hospital(email),
    PRIMARY KEY(email),
    FOREIGN KEY (email) REFERENCES Users(email),
    FOREIGN KEY (username) REFERENCES Users(username)
);
-- Gov_Agency
CREATE TABLE Govt_agency(
    email VARCHAR(255) NOT NULL,
	name VARCHAR(255) NOT NULL,
	username VARCHAR(255) NOT NULL,
    id VARCHAR(20),
    contact CHAR(10),
    PRIMARY KEY (email),
    FOREIGN KEY (email) REFERENCES Users(email),
    FOREIGN KEY (username) REFERENCES Users(username)
);

--Ambulance_driver
CREATE TABLE Ambulance_driver(
    email VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact CHAR(10),
    licence  VARCHAR(16) NOT NULL,
    vehicle_number VARCHAR(10) NOT NULL
);

-- Medicine Table
CREATE TABLE Medicine(
    name VARCHAR(255),
    brand_name VARCHAR(255),
    PRIMARY KEY(name, brand_name)
);

--Stores
CREATE TABLE stores(
    email_pharm VARCHAR(255),
    name VARCHAR(255),
    brand_name VARCHAR(255),
    stock INT,
    PRIMARY KEY(email_pharm,name,brand_name),
    FOREIGN KEY(email_pharm) REFERENCES Pharmacy(email),
    FOREIGN KEY(name,brand_name) REFERENCES Medicine
);

--Access
CREATE TABLE access(
    email_hospital VARCHAR(255),
    email_driver VARCHAR(255),
    PRIMARY KEY (email_hospital,email_driver),
    FOREIGN KEY(email_hospital) REFERENCES Hospital(EMAIL),
    FOREIGN KEY(email_driver) REFERENCES Ambulance_driver(email) 
);

-- appointment table
CREATE TABLE appoints (
    id CHAR(15),
    patient_email VARCHAR(255),
    doc_email VARCHAR(255),
    start_time VARCHAR(8),
    end_time VARCHAR(8),
    date VARCHAR(10),
    is_pending CHAR(1),
    prescription VARCHAR(2047),
    PRIMARY KEY(id),
    FOREIGN KEY (patient_email) REFERENCES Patient(EMAIL),
    FOREIGN KEY (doc_email) REFERENCES Doctor(EMAIL)
);
-- Medicine Table
CREATE TABLE Medicine(
    name VARCHAR(255),
    brand_name VARCHAR(255),
    PRIMARY KEY(name, brand_name)
);

-- Pharmacy Table
CREATE TABLE Pharmacy(
    email VARCHAR(255) NOT NULL,
	username VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact CHAR(10),
    email_hospital VARCHAR(255) NOT NULL,
    PRIMARY KEY(email),
    FOREIGN KEY(email_hospital) REFERENCES Hospital(EMAIL),
    FOREIGN KEY (email) REFERENCES Users(email),
    FOREIGN KEY (username) REFERENCES Users(username)
);

-- Works Table
CREATE TABLE works(
    doc_email VARCHAR(255),
    hosp_email VARCHAR(255),
    start_time VARCHAR(8),
    end_time VARCHAR(8),
    salary DECIMAL(9,2),
    PRIMARY KEY(doc_email,hosp_email),
    FOREIGN KEY(doc_email) REFERENCES Doctor(EMAIL),
    FOREIGN KEY(hosp_email) REFERENCES Hospital(EMAIL)
);

-- Patient ID generate trigger
CREATE OR REPLACE FUNCTION generate_patient_id()
RETURNS CHAR(12) AS $$
DECLARE
    result CHAR(12);
BEGIN
    -- Generate a unique 12-digit ID using timestamp and random number
    result := to_char(LPAD(FLOOR(RANDOM() * 100000000000)::TEXT, 12, '0'));
    RETURN result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_patient_id()
RETURNS TRIGGER AS $$
BEGIN
    -- Set the patient ID using the generate_patient_id function
    NEW.id := generate_patient_id();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_patient_id_trigger
BEFORE INSERT ON patient
FOR EACH ROW EXECUTE FUNCTION set_patient_id();