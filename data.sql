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
--
CREATE TABLE Hospital
(
       hospital_name VARCHAR(255),
       email VARCHAR(255),
       location VARCHAR(255),
       address VARCHAR(255),
       specialities VARCHAR(255),
       insurance_policies VARCHAR(255),
       cashless BOOLEAN,
       contact_number VARCHARA(255),
       PRIMARY KEY (email),
       FOREIGN KEY (email) REFERENCES User(email) 

);

CREATE TABLE appoints
(
   appointment_id CHAR(20) PRIMARY KEY,
   patient_id CHAR(12),
   doctor_registration_number CHAR(5),
   start_time VARCHAR(10),
   end_time VARCHAR(10),
   date VARCHAR(10),
   FOREIGN KEY (patient_id) REFERENCES Patients(patient_id),
   FOREIGN KEY (doctor_registration_number) REFERENCES Doctors(registration_number)

);
CREATE TABLE Appointments (
    appointment_id CHAR(20) PRIMARY KEY,
    patient_id CHAR(12),
    doctor_registration_number CHAR(5),
    start_time VARCHAR(10),
    end_time VARCHAR(10),
    date VARCHAR(10),
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id), 
    FOREIGN KEY (doctor_registration_number) REFERENCES Doctors(registration_number) 
);

CREATE TABLE 
