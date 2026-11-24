CREATE DATABASE IF NOT EXISTS borrowing_system
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE borrowing_system;

CREATE TABLE IF NOT EXISTS student (
    studentID VARCHAR(50) NOT NULL PRIMARY KEY,
    username VARCHAR(100) NULL,
    lastName VARCHAR(100) NULL,
    middleName VARCHAR(100) NULL,
    firstName VARCHAR(100) NULL,
    birthdate DATE NULL,
    age INT NULL,
    gender VARCHAR(30) NULL,
    contactNumber VARCHAR(30) NULL,
    email VARCHAR(255) NULL,
    institution VARCHAR(100) NULL,
    province VARCHAR(100) NULL,
    city VARCHAR(100) NULL,
    barangay VARCHAR(100) NULL,
    blkLot VARCHAR(255) NULL,
    warning INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS loginUsers (
    username VARCHAR(100) NOT NULL PRIMARY KEY,
    email VARCHAR(255) NULL,
    studentID VARCHAR(50) NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'user',
    lastName VARCHAR(100) NULL,
    middleName VARCHAR(100) NULL,
    firstName VARCHAR(100) NULL,
    birthdate DATE NULL,
    age INT NULL,
    gender VARCHAR(30) NULL,
    contactNumber VARCHAR(30) NULL,
    institution VARCHAR(100) NULL,
    province VARCHAR(100) NULL,
    city VARCHAR(100) NULL,
    barangay VARCHAR(100) NULL,
    blkLot VARCHAR(255) NULL,
    KEY idx_loginUsers_studentID (studentID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS admin (
    adminID VARCHAR(50) NOT NULL PRIMARY KEY,
    adminName VARCHAR(150) NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS books (
    bookID VARCHAR(50) NOT NULL PRIMARY KEY,
    categoryID VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NULL,
    image VARCHAR(255) NULL,
    description TEXT NULL,
    publishedDate DATE NULL,
    totalStock INT NOT NULL DEFAULT 0,
    availableStock INT NOT NULL DEFAULT 0,
    KEY idx_books_categoryID (categoryID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bookstatus (
    bookID VARCHAR(50) NOT NULL PRIMARY KEY,
    status VARCHAR(30) NOT NULL DEFAULT 'available'
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS borrowedbook (
    borrowedID BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    borrowID BIGINT UNSIGNED NULL,
    bookID VARCHAR(50) NOT NULL,
    borrowedDate DATE NULL,
    returnDate DATE NULL,
    studentID VARCHAR(50) NOT NULL,
    adminID VARCHAR(50) NULL,
    KEY idx_borrowedbook_studentID (studentID),
    KEY idx_borrowedbook_bookID (bookID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS overduebook (
    borrowedID BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    bookID VARCHAR(50) NOT NULL,
    borrowedDate DATE NULL,
    returnDate DATE NULL,
    studentID VARCHAR(50) NOT NULL,
    adminID VARCHAR(50) NULL,
    KEY idx_overduebook_studentID (studentID),
    KEY idx_overduebook_bookID (bookID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS returnbook (
    returnID BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    borrowID BIGINT UNSIGNED NULL,
    bookID VARCHAR(50) NOT NULL,
    returnDate DATETIME NOT NULL,
    studentID VARCHAR(50) NOT NULL,
    adminID VARCHAR(50) NULL,
    KEY idx_returnbook_studentID (studentID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notification (
    notificationID BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    notificationType VARCHAR(50) NOT NULL,
    notificationMessage TEXT NOT NULL,
    notificationDate DATETIME NOT NULL,
    bookID VARCHAR(50) NULL,
    studentID VARCHAR(50) NOT NULL,
    notificationColor VARCHAR(30) NULL,
    KEY idx_notification_studentID (studentID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS transactionlog (
    transactionID BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    date DATETIME NOT NULL,
    bookID VARCHAR(50) NOT NULL,
    studentID VARCHAR(50) NOT NULL,
    logType VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(100) NOT NULL PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB;

INSERT IGNORE INTO admin (adminID, adminName)
VALUES ('1', 'Library Administrator');

INSERT IGNORE INTO loginUsers (
    username, email, studentID, password, role, lastName, firstName
) VALUES (
    'admin',
    'admin@example.local',
    'ADMIN001',
    '$2y$10$N8Kqyt7ox30FlO6/P5YwWuFCT5Vu6syXVJu7j07pCKdNfZo6cvgTC',
    'admin',
    'Administrator',
    'Library'
);
