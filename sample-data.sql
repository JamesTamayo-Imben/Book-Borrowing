USE borrowing_system;

INSERT IGNORE INTO student (
    studentID, username, lastName, middleName, firstName, birthdate, age,
    gender, contactNumber, email, institution, province, city, barangay,
    blkLot, warning
) VALUES
    ('DEMO2026001', 'demo.reader1', 'Santos', 'Reyes', 'Alex', '2004-03-14', 22,
     'Other', '09000000001', 'reader1@example.local', 'IMACS', 'Metro Manila',
     'Manila', 'Sample Barangay', 'Demo Block 1', 0),
    ('DEMO2026002', 'demo.reader2', 'Garcia', 'Cruz', 'Jamie', '2003-08-22', 23,
     'Other', '09000000002', 'reader2@example.local', 'ILA', 'Metro Manila',
     'Manila', 'Sample Barangay', 'Demo Block 2', 0),
    ('DEMO2026003', 'demo.reader3', 'Dela Cruz', 'Lopez', 'Taylor', '2005-01-09', 21,
     'Other', '09000000003', 'reader3@example.local', 'IOE', 'Metro Manila',
     'Manila', 'Sample Barangay', 'Demo Block 3', 0);

INSERT IGNORE INTO loginUsers (
    username, email, studentID, password, role, lastName, middleName, firstName,
    birthdate, age, gender, contactNumber, institution, province, city,
    barangay, blkLot
) VALUES
    ('demo.reader1', 'reader1@example.local', 'DEMO2026001',
     '$2y$10$3JZtxZLYlWjFEZgPajhep.0CzQp9mn3eVWrkbEtwd2xj6HMogAMSm',
     'user', 'Santos', 'Reyes', 'Alex', '2004-03-14', 22, 'Other',
     '09000000001', 'IMACS', 'Metro Manila', 'Manila', 'Sample Barangay', 'Demo Block 1'),
    ('demo.reader2', 'reader2@example.local', 'DEMO2026002',
     '$2y$10$KSY.lFCHNl8EUnJWOa1jUe2VMV5l4jph6j8fGgB4KbqhRyRWT8iBW',
     'user', 'Garcia', 'Cruz', 'Jamie', '2003-08-22', 23, 'Other',
     '09000000002', 'ILA', 'Metro Manila', 'Manila', 'Sample Barangay', 'Demo Block 2'),
    ('demo.reader3', 'reader3@example.local', 'DEMO2026003',
     '$2y$10$.DfBVb4Ypz3CebXSGv1c/.YHUlqkJtOGW8vhEYcJXnkxrjetBTaRO',
     'user', 'Dela Cruz', 'Lopez', 'Taylor', '2005-01-09', 21, 'Other',
     '09000000003', 'IOE', 'Metro Manila', 'Manila', 'Sample Barangay', 'Demo Block 3');

INSERT IGNORE INTO books (
    bookID, categoryID, title, author, image, description, publishedDate,
    totalStock, availableStock
) VALUES
    ('DEMO-IS-001', 'KLDIS001', 'The Art of War', 'Sun Tzu',
     'book-image/book1.jpg', 'A classic work on strategy and leadership.', '1910-01-01', 5, 4),
    ('DEMO-IS-002', 'KLDIS001', 'Common Sense', 'Thomas Paine',
     'book-image/book2.jpg', 'A landmark pamphlet on government and society.', '1776-01-10', 4, 4),
    ('DEMO-PSY-001', 'KLDPS002', 'The Principles of Psychology', 'William James',
     'book-image/book3.jpg', 'A foundational work in the study of psychology.', '1890-01-01', 4, 4),
    ('DEMO-PSY-002', 'KLDPS002', 'The Expression of the Emotions in Man and Animals', 'Charles Darwin',
     'book-image/book4.jpg', 'A historical study of emotion and expression.', '1872-01-01', 3, 3),
    ('DEMO-CE-001', 'KLDCE003', 'A Text-book on Roofs and Bridges', 'Mansfield Merriman',
     'book-image/book5.jpg', 'An introductory historical text on structural design.', '1892-01-01', 4, 4),
    ('DEMO-CE-002', 'KLDCE003', 'The Theory and Practice of Surveying', 'John Butler Johnson',
     'book-image/book6.jpg', 'A historical reference on surveying methods.', '1901-01-01', 3, 3),
    ('DEMO-NS-001', 'KLDNS004', 'On the Origin of Species', 'Charles Darwin',
     'book-image/book7.jpg', 'A foundational work in the history of biology.', '1859-11-24', 5, 4),
    ('DEMO-NS-002', 'KLDNS004', 'The Voyage of the Beagle', 'Charles Darwin',
     'book-image/book8.jpg', 'An account of observations made during a scientific voyage.', '1839-01-01', 3, 3),
    ('DEMO-MW-001', 'KLDMW005', 'An Introduction to Mathematics', 'Alfred North Whitehead',
     'book-image/book9.jpg', 'An accessible introduction to mathematical ideas.', '1911-01-01', 4, 4),
    ('DEMO-MW-002', 'KLDMW005', 'The Elements of Euclid', 'Euclid',
     'book-image/book10.jpg', 'A classic introduction to geometry.', '1897-01-01', 3, 3);

INSERT IGNORE INTO bookstatus (bookID, status)
SELECT bookID,
       IF(availableStock > 0, 'available', 'unavailable')
FROM books
WHERE bookID LIKE 'DEMO-%';

INSERT INTO borrowedbook (bookID, borrowedDate, returnDate, studentID, adminID)
SELECT 'DEMO-IS-001', CURRENT_DATE - INTERVAL 3 DAY,
       CURRENT_DATE + INTERVAL 11 DAY, 'DEMO2026001', '1'
WHERE NOT EXISTS (
    SELECT 1 FROM borrowedbook
    WHERE bookID = 'DEMO-IS-001' AND studentID = 'DEMO2026001'
);

INSERT INTO borrowedbook (bookID, borrowedDate, returnDate, studentID, adminID)
SELECT 'DEMO-NS-001', CURRENT_DATE - INTERVAL 1 DAY,
       CURRENT_DATE + INTERVAL 13 DAY, 'DEMO2026002', '1'
WHERE NOT EXISTS (
    SELECT 1 FROM borrowedbook
    WHERE bookID = 'DEMO-NS-001' AND studentID = 'DEMO2026002'
);

INSERT INTO notification (
    notificationType, notificationMessage, notificationDate, bookID,
    studentID, notificationColor
)
SELECT 'BORROW', 'You successfully borrowed DEMO-IS-001 Book!',
       NOW(), 'DEMO-IS-001', 'DEMO2026001', '#00b33c'
WHERE NOT EXISTS (
    SELECT 1 FROM notification
    WHERE notificationType = 'BORROW'
      AND bookID = 'DEMO-IS-001'
      AND studentID = 'DEMO2026001'
);
