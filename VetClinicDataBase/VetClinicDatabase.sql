CREATE DATABASE VetClinicDataBase;

-- Table for Doctors
CREATE TABLE Doctor (
    doctorID INT PRIMARY KEY IDENTITY(1,1),
    doctorInitials VARCHAR(5),
    doctorSurname VARCHAR(50),
    doctorContact_Num VARCHAR(15)
);


-- Table for Admin Staff
CREATE TABLE AdminStaff (
    AdminID INT PRIMARY KEY IDENTITY(1,1),
    AdminInitials VARCHAR(5),
    AdminSurname VARCHAR(50),
    AdminContact_Num VARCHAR(15)
);

-- Table for Clients (Pet Owners)
CREATE TABLE Client (
    ownerID INT PRIMARY KEY IDENTITY(1,1),
    ownerFName VARCHAR(50),
    ownerLName VARCHAR(50),
    ownerEmail_addr VARCHAR(100),
    ownerPhy_addr VARCHAR(255),
    ownerContactNum VARCHAR(15)
);

-- Table for Pets
CREATE TABLE Pet (
    petID INT PRIMARY KEY IDENTITY(1,1),
    petName VARCHAR(50),
    petType VARCHAR(50),
    petBreed VARCHAR(50),
    petAge INT,
    ownerID INT,
    FOREIGN KEY (ownerID) REFERENCES Client(ownerID)
);

-- Table for Appointments
CREATE TABLE Appointment (
    AppointNum INT PRIMARY KEY IDENTITY(1,1),
    AppointTime TIME,
    AppointDate DATE,
    AppointStatus VARCHAR(20),
    AdminID INT,
    ownerID INT,
    petID INT,
    doctorID INT,
    FOREIGN KEY (AdminID) REFERENCES AdminStaff(AdminID),
    FOREIGN KEY (ownerID) REFERENCES Client(ownerID),
    FOREIGN KEY (petID) REFERENCES Pet(petID),
    FOREIGN KEY (doctorID) REFERENCES Doctor(doctorID)
);

--Table for Notifications
CREATE TABLE Notifications (
  appointNum INT,
  clientID INT,
  notificationType VARCHAR(50),
  notificationMessage VARCHAR(50),
  notificationStatus VARCHAR(20),
  FOREIGN KEY (appointmentID) REFERENCES Appointment(AppointNum),
  FOREIGN KEY (clientID) REFERENCES Client(ownerID)
);

-- Table for Consultations
CREATE TABLE Consultation (
    ConsulNum INT PRIMARY KEY IDENTITY(1,1),
    ConsulDate DATE,
    ConsulStartTime TIME,
    ConsulEndTime TIME,
    doctorID INT,
    petID INT,
    FOREIGN KEY (doctorID) REFERENCES Doctor(doctorID),
    FOREIGN KEY (petID) REFERENCES Pet(petID)
);

-- Table for Medical Services/History
CREATE TABLE MedicalHistory (
    serviceID INT PRIMARY KEY IDENTITY(1,1),
    serviceType VARCHAR(50),
    serviceDate DATE,
    serviceStartTime TIME,
    serviceEndTime TIME,
    serviceDesc VARCHAR(255),
    ConsulNum INT,
    petID INT,
    FOREIGN KEY (ConsulNum) REFERENCES Consultation(ConsulNum),
    FOREIGN KEY (petID) REFERENCES Pet(petID)
);

-- Table for Payments
CREATE TABLE Payment (
    paymentNum INT PRIMARY KEY IDENTITY(1,1),
    paymentMethod VARCHAR(50),
    accountNum VARCHAR(20),
    accountHolder VARCHAR(100),
    accountExpDate DATE,
    accountCVV INT,
    paymentAmt DECIMAL(10, 2),
    paymentDate DATE,
    ownerID INT,
    FOREIGN KEY (ownerID) REFERENCES Client(ownerID)
); 

ALTER TABLE Client ADD Password VARCHAR(10);
ALTER TABLE AdminStaff ADD Password VARCHAR(10);
ALTER TABLE Doctor ADD Password VARCHAR(10);

-- Updating Consultation Table
ALTER TABLE Consultation ADD ConsultantID INT;
ALTER TABLE Consultation 
ADD FOREIGN KEY (ConsultantID) REFERENCES Doctor(doctorID);

-- Updating Appointment Table
ALTER TABLE Appointment ADD AppointHolderID INT;
ALTER TABLE Appointment 
ADD FOREIGN KEY (AppointHolderID) REFERENCES Client(ownerID);

-- Updating MedicalHistory Table
ALTER TABLE MedicalHistory ADD AssignedDoctorID INT;
ALTER TABLE MedicalHistory 
ADD FOREIGN KEY (AssignedDoctorID) REFERENCES Doctor(doctorID);

SELECT TABLE_NAME 
FROM VetClinicDatabase.INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE';

SELECT * FROM Doctor;

EXEC sp_columns 'Doctor';
