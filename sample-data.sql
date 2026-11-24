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

-- These cover-to-record matches are based on the title and author printed on each image.
-- Publication dates are left NULL until the exact edition on the cover is verified.
INSERT IGNORE INTO books (
    bookID, categoryID, title, author, image, description, publishedDate,
    totalStock, availableStock
) VALUES
    ('DEMO-IS-001', 'KLDIS001', 'The Pragmatic Programmer: Your Journey to Mastery', 'David Thomas, Andrew Hunt',
     'book-image/book1.jpg', 'Practical techniques for software development and professional programming.', NULL, 5, 4),
    ('DEMO-IS-002', 'KLDIS001', 'C# Game Programming Cookbook for Unity 3D', 'Jeff W. Murray',
     'book-image/book2.jpg', 'A cookbook of C# techniques for building games with Unity 3D.', NULL, 4, 4),
    ('DEMO-PSY-001', 'KLDIS001', 'Clean Code', 'Robert C. Martin',
     'book-image/book3.jpg', 'A handbook of agile software craftsmanship and readable code.', NULL, 4, 4),
    ('DEMO-PSY-002', 'KLDIS001', 'Introduction to Algorithms', 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
     'book-image/book4.jpg', 'A comprehensive reference to algorithms and their analysis.', NULL, 3, 3),
    ('DEMO-CE-001', 'KLDPS002', 'Introduction to Psychology', NULL,
     'book-image/book5.jpg', 'An introductory overview of psychology from Quick & Easy Learning.', NULL, 4, 4),
    ('DEMO-CE-002', 'KLDPS002', 'Forty Studies That Changed Psychology', 'Roger R. Hock',
     'book-image/book6.jpg', 'A guided look at influential experiments and research in psychology.', NULL, 3, 3),
    ('DEMO-NS-001', 'KLDPS002', 'Exploring Psychology', 'David G. Myers',
     'book-image/book7.jpg', 'An introduction to core topics and research in psychology.', NULL, 5, 4),
    ('DEMO-NS-002', 'KLDPS002', 'Abnormal Psychology', 'Ronald J. Comer',
     'book-image/book8.jpg', 'A study of psychological disorders, their causes, and their treatment.', NULL, 3, 3),
    ('DEMO-MW-001', 'KLDCE003', 'Civil Engineering Formulas', 'Tyler G. Hicks',
     'book-image/book9.jpg', 'A reference of formulas used across civil engineering disciplines.', NULL, 4, 4),
    ('DEMO-MW-002', 'KLDCE003', 'The Tower and the Bridge', 'David P. Billington',
     'book-image/book10.jpg', 'A history and analysis of notable bridges and towers as works of structural art.', NULL, 3, 3),
    ('DEMO-CE-003', 'KLDCE003', 'Why Buildings Fall Down', 'Matthys Levy, Mario Salvadori',
     'book-image/book11.jpg', 'Case studies explain structural failures and the engineering lessons they reveal.', NULL, 3, 3),
    ('DEMO-CE-004', 'KLDCE003', 'Beyond Failure: Forensic Case Studies for Civil Engineers', 'Norbert J. Delatte',
     'book-image/book12.jpg', 'Forensic case studies of structural failures for civil engineering practice.', NULL, 3, 3),
    ('DEMO-NS-003', 'KLDNS004', 'Nursing Diagnosis Handbook', 'Betty J. Ackley, Gail B. Ladwig',
     'book-image/book13.jpg', 'A handbook for selecting nursing diagnoses and planning patient care.', NULL, 3, 3),
    ('DEMO-NS-004', 'KLDNS004', 'Skill Checklists for Fundamentals of Nursing: The Art and Science of Nursing Care', 'Carol Taylor, Carol Lillis, Priscilla LeMone, Pamela Lynn, Marilee LeBon',
     'book-image/book14.jpg', 'A companion of nursing skill checklists for the Fundamentals of Nursing text.', NULL, 3, 3),
    ('DEMO-NS-005', 'KLDNS004', 'Nursing Care Plans', 'Meg Gulanick, Judith L. Myers',
     'book-image/book15.jpg', 'A practical collection of nursing care plans organized around patient needs.', NULL, 3, 3),
    ('DEMO-NS-006', 'KLDNS004', 'Nursing: The Ultimate Study Guide', 'Nadia R. Singh',
     'book-image/book16.jpg', 'A study guide for nursing students reviewing essential clinical knowledge.', NULL, 3, 3),
    ('DEMO-MW-003', 'KLDMW005', 'Anatomy and Physiology for Midwives', 'Jane Coad, Melvyn Dunstall',
     'book-image/book17.jpg', 'Anatomy and physiology explained for midwifery education and practice.', NULL, 3, 3),
    ('DEMO-MW-004', 'KLDMW005', 'Skills for Midwifery Practice', 'Ruth Johnson, Wendy Taylor',
     'book-image/book18.jpg', 'A practical guide to essential clinical skills for midwifery.', NULL, 3, 3),
    ('DEMO-MW-005', 'KLDMW005', 'Fetal Monitoring in Practice', 'Donald Gibb, Sabaratnam Arulkumaran',
     'book-image/book19.jpg', 'A clinical guide to interpreting fetal monitoring in practice.', NULL, 3, 3),
    ('DEMO-MW-006', 'KLDMW005', 'Midwifery Essentials', 'Joanne Gray, Rachel Smith',
     'book-image/book20.jpg', 'A concise guide to essential midwifery knowledge and practice.', NULL, 3, 3);

INSERT INTO bookstatus (bookID, status)
SELECT bookID, IF(availableStock > 0, 'available', 'unavailable')
FROM books
WHERE bookID LIKE 'DEMO-%'
ON DUPLICATE KEY UPDATE status = VALUES(status);

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
